#!/usr/bin/env node

import { formatJson } from './modules/json';
import { encodeBase64, decodeBase64 } from './modules/base64';
import { generateUuid } from './modules/uuid';
import { calculateHash } from './modules/hash';
import { parseTimestamp } from './modules/timestamp';
import { analyzeText, convertCase } from './modules/text';

const VERSION = '1.0.0';

export function runCli(argv: string[]): { exitCode: number; output: string } {
  const args = argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h' || command === 'help') {
    return {
      exitCode: 0,
      output: `AI Satellite Developer Toolbox CLI (v${VERSION})
Offline, zero-telemetry local developer utilities.

Usage:
  developer-toolbox <command> [options] [arguments]

Commands:
  json <string> [--minify]           Format or minify JSON
  base64 <encode|decode> <string>    Base64 encoding/decoding
  uuid                               Generate random UUID v4
  hash <sha256|md5> <string>         Calculate cryptographic hash
  timestamp [timestamp|now]          Convert epoch or ISO timestamp
  text <analyze|case> [args]         Text analysis or case conversion

Options:
  -v, --version                      Show CLI version
  -h, --help                         Show help information
`,
    };
  }

  if (command === '--version' || command === '-v') {
    return { exitCode: 0, output: `v${VERSION}` };
  }

  if (command === 'json') {
    const isMinify = args.includes('--minify');
    const input = args.filter((a) => a !== 'json' && a !== '--minify').join(' ');
    if (!input) {
      return { exitCode: 1, output: 'Error: Missing JSON input string.' };
    }
    const res = formatJson(input, { minify: isMinify });
    if (!res.success) {
      return { exitCode: 1, output: `Error: ${res.error}` };
    }
    return { exitCode: 0, output: res.output || '' };
  }

  if (command === 'base64') {
    const mode = args[1];
    const text = args.slice(2).join(' ');
    if (mode === 'encode') {
      return { exitCode: 0, output: encodeBase64(text) };
    } else if (mode === 'decode') {
      return { exitCode: 0, output: decodeBase64(text) };
    }
    return { exitCode: 1, output: 'Usage: developer-toolbox base64 <encode|decode> <string>' };
  }

  if (command === 'uuid') {
    return { exitCode: 0, output: generateUuid() };
  }

  if (command === 'hash') {
    const algo = (args[1] || 'sha256') as 'sha256' | 'md5';
    const text = args.slice(2).join(' ');
    if (algo !== 'sha256' && algo !== 'md5') {
      return { exitCode: 1, output: 'Error: Unsupported algorithm. Use sha256 or md5.' };
    }
    return { exitCode: 0, output: calculateHash(text, algo) };
  }

  if (command === 'timestamp') {
    const val = args[1] || 'now';
    try {
      const parsed = parseTimestamp(val);
      return { exitCode: 0, output: JSON.stringify(parsed, null, 2) };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { exitCode: 1, output: `Error: ${msg}` };
    }
  }

  if (command === 'text') {
    const sub = args[1];
    if (sub === 'analyze') {
      const text = args.slice(2).join(' ');
      const res = analyzeText(text);
      return { exitCode: 0, output: JSON.stringify(res, null, 2) };
    } else if (sub === 'case') {
      const targetCase = args[2] as 'camel' | 'kebab' | 'snake' | 'upper' | 'lower';
      const text = args.slice(3).join(' ');
      return { exitCode: 0, output: convertCase(text, targetCase) };
    }
    return { exitCode: 1, output: 'Usage: developer-toolbox text <analyze|case> [options]' };
  }

  return { exitCode: 1, output: `Error: Unknown command '${command}'. Run with --help for usage.` };
}

// Direct execution guard
if (typeof require !== 'undefined' && require.main === module) {
  const result = runCli(process.argv);
  if (result.output) {
    if (result.exitCode === 0) {
      console.log(result.output);
    } else {
      console.error(result.output);
    }
  }
  process.exit(result.exitCode);
}
