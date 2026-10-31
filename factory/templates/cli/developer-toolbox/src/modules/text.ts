export function analyzeText(input: string): {
  characterCount: number;
  wordCount: number;
  lineCount: number;
} {
  const words = input.trim() ? input.trim().split(/\s+/).length : 0;
  const lines = input.split(/\r\n|\r|\n/).length;

  return {
    characterCount: input.length,
    wordCount: words,
    lineCount: lines,
  };
}

export function convertCase(
  input: string,
  targetCase: 'camel' | 'kebab' | 'snake' | 'upper' | 'lower'
): string {
  if (targetCase === 'upper') return input.toUpperCase();
  if (targetCase === 'lower') return input.toLowerCase();

  const words = input
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_\-]+/g, ' ')
    .trim()
    .split(/\s+/);

  if (targetCase === 'camel') {
    return words
      .map((w, idx) =>
        idx === 0
          ? w.toLowerCase()
          : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
      )
      .join('');
  }

  if (targetCase === 'kebab') {
    return words.map((w) => w.toLowerCase()).join('-');
  }

  if (targetCase === 'snake') {
    return words.map((w) => w.toLowerCase()).join('_');
  }

  return input;
}
