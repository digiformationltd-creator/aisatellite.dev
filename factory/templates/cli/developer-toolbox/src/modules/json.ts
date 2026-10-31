export interface JsonFormatOptions {
  minify?: boolean;
  indent?: number;
}

export function formatJson(input: string, options: JsonFormatOptions = {}): {
  success: boolean;
  output?: string;
  error?: string;
} {
  try {
    const parsed = JSON.parse(input);
    const space = options.minify ? 0 : (options.indent ?? 2);
    const output = JSON.stringify(parsed, null, space);
    return { success: true, output };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Invalid JSON: ${message}` };
  }
}
