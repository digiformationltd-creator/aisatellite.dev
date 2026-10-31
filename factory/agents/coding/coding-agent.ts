import fs from 'node:fs';
import path from 'node:path';
import {
  type ImplementationTaskItem,
  type AgentTask,
  AgentTaskSchema,
} from '../../schemas';
import { auditLogger } from '../../monitoring/audit-logger';

export interface CodeFilePayload {
  relativePath: string;
  content: string;
}

export class CodingAgent {
  /**
   * Execute an implementation task in the project workspace
   */
  public async executeTask(
    projectId: string,
    workspaceDir: string,
    taskItem: ImplementationTaskItem,
    filesToGenerate: CodeFilePayload[]
  ): Promise<AgentTask> {
    const taskId = `task_${taskItem.id}_${Date.now()}`;
    const evidence: string[] = [];

    // Ensure workspace directory exists
    if (!fs.existsSync(workspaceDir)) {
      fs.mkdirSync(workspaceDir, { recursive: true });
    }

    // Safety boundary check: prevent path traversal outside workspace
    const resolvedWorkspace = path.resolve(workspaceDir);

    for (const file of filesToGenerate) {
      const targetPath = path.resolve(workspaceDir, file.relativePath);

      // Verify that targetPath is strictly inside workspaceDir
      if (!targetPath.startsWith(resolvedWorkspace)) {
        throw new Error(
          `Security violation: Target file path '${file.relativePath}' resolves outside workspace boundary.`
        );
      }

      // Create parent directories if needed
      const parentDir = path.dirname(targetPath);
      if (!fs.existsSync(parentDir)) {
        fs.mkdirSync(parentDir, { recursive: true });
      }

      // Write file content
      fs.writeFileSync(targetPath, file.content, 'utf8');
      evidence.push(`Wrote ${file.relativePath} (${Buffer.byteLength(file.content)} bytes)`);
    }

    const agentTask: AgentTask = {
      taskId,
      projectId,
      assignedAgent: 'coding-agent',
      objective: taskItem.title,
      inputReferences: taskItem.dependencies,
      outputRequirements: taskItem.targetFiles,
      allowedTools: ['file_writer', 'ast_parser'],
      budget: {
        maxTokens: 50000,
        timeoutSeconds: 120,
        maxRetries: 3,
      },
      timeout: 120,
      retryCount: 0,
      status: 'completed',
      evidence,
      result: {
        taskItemId: taskItem.id,
        filesCreated: filesToGenerate.map((f) => f.relativePath),
        completedAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };

    const validated = AgentTaskSchema.parse(agentTask);

    auditLogger.log({
      actor: 'coding-agent',
      action: 'complete_coding_task',
      projectId,
      details: {
        taskId,
        taskItemId: taskItem.id,
        filesGenerated: filesToGenerate.length,
      },
    });

    return validated;
  }
}

export const codingAgent = new CodingAgent();
