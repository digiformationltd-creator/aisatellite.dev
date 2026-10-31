import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { exec, spawn } from 'node:child_process';
import { auditLogger } from '../monitoring/audit-logger.js';

export interface SandboxExecutionOptions {
  projectId: string;
  command: string;
  args?: string[];
  timeoutMs?: number;
  env?: Record<string, string>;
  cwdSubpath?: string;
}

export interface SandboxExecutionResult {
  exitCode: number;
  stdout: string;
  stderr: string;
  durationMs: number;
  timedOut: boolean;
  workspacePath: string;
}

export class SandboxEngine {
  private baseWorkspaceDir: string;
  private defaultTimeoutMs: number;

  constructor(customWorkspaceDir?: string, defaultTimeoutMs = 120_000) {
    this.baseWorkspaceDir =
      customWorkspaceDir || path.resolve(process.cwd(), 'factory', 'workspaces');
    this.defaultTimeoutMs = defaultTimeoutMs;

    if (!fs.existsSync(this.baseWorkspaceDir)) {
      fs.mkdirSync(this.baseWorkspaceDir, { recursive: true });
    }
  }

  /**
   * Initializes or returns an isolated workspace directory for a project
   */
  getOrCreateWorkspace(projectId: string): string {
    const safeProjectId = projectId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const workspacePath = path.join(this.baseWorkspaceDir, safeProjectId);
    if (!fs.existsSync(workspacePath)) {
      fs.mkdirSync(workspacePath, { recursive: true });
      auditLogger.log('SandboxEngine', 'WORKSPACE_CREATED', { projectId, workspacePath }, projectId);
    }
    return workspacePath;
  }

  createWorkspace(projectId: string): { workspaceDir: string; distDir: string } {
    const ws = this.getOrCreateWorkspace(projectId);
    const dist = path.join(ws, 'dist');
    if (!fs.existsSync(dist)) fs.mkdirSync(dist, { recursive: true });
    return { workspaceDir: ws, distDir: dist };
  }

  sanitizeEnvironment(customEnv: Record<string, string> = {}): NodeJS.ProcessEnv {
    return this.getSanitizedEnvironment(customEnv);
  }

  async executeCommand(projectId: string, command: string, timeoutMs = 120_000): Promise<SandboxExecutionResult> {
    return this.execute({ projectId, command, timeoutMs });
  }

  /**
   * Sanitizes environment variables so production credentials, GitHub tokens,
   * and deployment keys are NEVER leaked to the untrusted sandbox tasks.
   */
  getSanitizedEnvironment(customEnv: Record<string, string> = {}): NodeJS.ProcessEnv {
    const DANGEROUS_KEYS = [
      'CLOUDFLARE_API_TOKEN',
      'CLOUDFLARE_ACCOUNT_ID',
      'GITHUB_TOKEN',
      'GH_TOKEN',
      'AWS_SECRET_ACCESS_KEY',
      'AWS_ACCESS_KEY_ID',
      'OPENAI_API_KEY',
      'ANTHROPIC_API_KEY',
      'PRODUCTION_KEY',
      'ADMIN_SECRET',
      'DEPLOY_TOKEN',
    ];

    const safeEnv: NodeJS.ProcessEnv = {
      PATH: process.env.PATH,
      NODE_ENV: 'test',
      CI: 'true',
      LANG: process.env.LANG || 'en_US.UTF-8',
      SYSTEMROOT: process.env.SYSTEMROOT,
      TEMP: process.env.TEMP,
      TMP: process.env.TMP,
    };

    // Copy non-sensitive process env
    for (const [key, value] of Object.entries(process.env)) {
      const isDangerous = DANGEROUS_KEYS.some((dk) => key.toUpperCase().includes(dk));
      if (!isDangerous && value !== undefined) {
        safeEnv[key] = value;
      }
    }

    // Explicit custom env parameters (also checked)
    for (const [key, value] of Object.entries(customEnv)) {
      const isDangerous = DANGEROUS_KEYS.some((dk) => key.toUpperCase().includes(dk));
      if (!isDangerous) {
        safeEnv[key] = value;
      }
    }

    return safeEnv;
  }

  /**
   * Executes a command inside the isolated sandbox directory with timeout and isolation
   */
  async execute(options: SandboxExecutionOptions): Promise<SandboxExecutionResult> {
    const workspacePath = this.getOrCreateWorkspace(options.projectId);
    const targetCwd = options.cwdSubpath
      ? path.join(workspacePath, options.cwdSubpath)
      : workspacePath;

    if (!fs.existsSync(targetCwd)) {
      fs.mkdirSync(targetCwd, { recursive: true });
    }

    const timeoutMs = options.timeoutMs || this.defaultTimeoutMs;
    const sanitizedEnv = this.getSanitizedEnvironment(options.env);
    const startTime = Date.now();

    return new Promise<SandboxExecutionResult>((resolve) => {
      let stdoutData = '';
      let stderrData = '';
      let isTimedOut = false;

      const fullCommand = options.args && options.args.length > 0
        ? `${options.command} ${options.args.join(' ')}`
        : options.command;

      const child = exec(
        fullCommand,
        {
          cwd: targetCwd,
          env: sanitizedEnv,
          timeout: timeoutMs,
          maxBuffer: 10 * 1024 * 1024, // 10MB log buffer limit
        },
        (error, stdout, stderr) => {
          const durationMs = Date.now() - startTime;
          stdoutData += stdout || '';
          stderrData += stderr || '';

          if (error && error.killed) {
            isTimedOut = true;
          }

          const exitCode = error ? (error.code || 1) : 0;

          auditLogger.log(
            'SandboxEngine',
            'COMMAND_EXECUTED',
            {
              command: options.command,
              exitCode,
              durationMs,
              timedOut: isTimedOut,
            },
            options.projectId
          );

          resolve({
            exitCode: typeof exitCode === 'number' ? exitCode : 1,
            stdout: stdoutData,
            stderr: stderrData,
            durationMs,
            timedOut: isTimedOut,
            workspacePath,
          });
        }
      );
    });
  }

  /**
   * Computes SHA-256 hash and package size for an artifact file
   */
  getArtifactChecksum(filePath: string): { sha256: string; size: number } {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Artifact file ${filePath} does not exist`);
    }
    const buffer = fs.readFileSync(filePath);
    const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');
    const size = buffer.length;
    return { sha256, size };
  }

  /**
   * Destroys an isolated workspace after lifecycle cleanup
   */
  cleanupWorkspace(projectId: string): void {
    const workspacePath = this.getOrCreateWorkspace(projectId);
    if (fs.existsSync(workspacePath)) {
      fs.rmSync(workspacePath, { recursive: true, force: true });
      auditLogger.log('SandboxEngine', 'WORKSPACE_CLEANED', { projectId, workspacePath }, projectId);
    }
  }
}

export const sandboxEngine = new SandboxEngine();
