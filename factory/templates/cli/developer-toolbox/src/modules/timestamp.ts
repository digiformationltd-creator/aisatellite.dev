export function parseTimestamp(input?: string): {
  epochMs: number;
  epochSec: number;
  iso: string;
  utcString: string;
} {
  let date: Date;

  if (!input || input.trim() === 'now') {
    date = new Date();
  } else if (/^\d+$/.test(input.trim())) {
    const num = parseInt(input.trim(), 10);
    // If < 10000000000, assume seconds, otherwise ms
    date = num < 10000000000 ? new Date(num * 1000) : new Date(num);
  } else {
    date = new Date(input);
  }

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date/timestamp string: ${input}`);
  }

  return {
    epochMs: date.getTime(),
    epochSec: Math.floor(date.getTime() / 1000),
    iso: date.toISOString(),
    utcString: date.toUTCString(),
  };
}
