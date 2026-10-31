import { describe, it, expect } from 'vitest';
import { runCli } from '../src/cli';
import { formatJson } from '../src/modules/json';
import { encodeBase64, decodeBase64 } from '../src/modules/base64';
import { generateUuid } from '../src/modules/uuid';
import { calculateHash } from '../src/modules/hash';
import { parseTimestamp } from '../src/modules/timestamp';
import { analyzeText, convertCase } from '../src/modules/text';

describe('Developer Toolbox CLI Modules', () => {
  it('formats and minifies JSON properly', () => {
    const raw = '{"hello":"world","count":42}';
    const formatted = formatJson(raw);
    expect(formatted.success).toBe(true);
    expect(formatted.output).toContain('  "hello": "world"');

    const minified = formatJson(raw, { minify: true });
    expect(minified.success).toBe(true);
    expect(minified.output).toBe('{"hello":"world","count":42}');

    const invalid = formatJson('{bad json}');
    expect(invalid.success).toBe(false);
    expect(invalid.error).toBeDefined();
  });

  it('encodes and decodes base64 with UTF-8 strings', () => {
    const text = 'Hello AI Satellite! 🚀';
    const encoded = encodeBase64(text);
    expect(encoded).toBe('SGVsbG8gQUkgU2F0ZWxsaXRlISDwn5qA');
    const decoded = decodeBase64(encoded);
    expect(decoded).toBe(text);
  });

  it('generates valid RFC 4122 v4 UUIDs', () => {
    const uuid = generateUuid();
    expect(uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });

  it('calculates deterministic SHA-256 and MD5 hashes', () => {
    const input = 'satellite';
    const sha = calculateHash(input, 'sha256');
    expect(sha).toBe('dc4b4e203f9dddce4687f1d66989b838fe281ab4bb4b533bd34fd9b577bf1136');

    const md5 = calculateHash(input, 'md5');
    expect(md5).toHaveLength(32);
    expect(/^[0-9a-f]{32}$/.test(md5)).toBe(true);
  });

  it('parses timestamps correctly', () => {
    const now = parseTimestamp('now');
    expect(now.epochSec).toBeGreaterThan(0);
    expect(now.iso).toContain('T');

    const specific = parseTimestamp('1609459200'); // 2021-01-01T00:00:00.000Z
    expect(specific.iso).toBe('2021-01-01T00:00:00.000Z');
  });

  it('analyzes text metrics and performs case conversions', () => {
    const text = 'The quick brown fox jumps over the lazy dog';
    const analysis = analyzeText(text);
    expect(analysis.wordCount).toBe(9);
    expect(analysis.characterCount).toBe(43);

    expect(convertCase('hello world test', 'camel')).toBe('helloWorldTest');
    expect(convertCase('hello world test', 'kebab')).toBe('hello-world-test');
    expect(convertCase('hello world test', 'snake')).toBe('hello_world_test');
    expect(convertCase('hello world', 'upper')).toBe('HELLO WORLD');
    expect(convertCase('HELLO WORLD', 'lower')).toBe('hello world');
  });
});

describe('Developer Toolbox CLI Runner', () => {
  it('outputs help menu with code 0', () => {
    const res = runCli(['node', 'cli.js', '--help']);
    expect(res.exitCode).toBe(0);
    expect(res.output).toContain('AI Satellite Developer Toolbox CLI');
  });

  it('outputs version with code 0', () => {
    const res = runCli(['node', 'cli.js', '--version']);
    expect(res.exitCode).toBe(0);
    expect(res.output).toBe('v1.0.0');
  });

  it('executes hash command via CLI', () => {
    const res = runCli(['node', 'cli.js', 'hash', 'sha256', 'test']);
    expect(res.exitCode).toBe(0);
    expect(res.output).toBe('9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');
  });

  it('executes base64 encode/decode via CLI', () => {
    const enc = runCli(['node', 'cli.js', 'base64', 'encode', 'satellite']);
    expect(enc.exitCode).toBe(0);
    expect(enc.output).toBe('c2F0ZWxsaXRl');

    const dec = runCli(['node', 'cli.js', 'base64', 'decode', 'c2F0ZWxsaXRl']);
    expect(dec.exitCode).toBe(0);
    expect(dec.output).toBe('satellite');
  });

  it('handles unknown command with code 1', () => {
    const res = runCli(['node', 'cli.js', 'unknown-cmd']);
    expect(res.exitCode).toBe(1);
    expect(res.output).toContain('Error: Unknown command');
  });
});
