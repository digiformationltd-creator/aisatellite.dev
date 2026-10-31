export interface LinkHealthCheck {
  url: string;
  isAlive: boolean;
  statusCode?: number;
  error?: string;
}

export class LinkVerifier {
  /**
   * Checks if a URL is reachable with standard HTTP GET
   */
  static async checkLink(url: string, timeoutMs = 7000): Promise<LinkHealthCheck> {
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return { url, isAlive: false, error: 'Unsupported protocol' };
      }

      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'AI-Satellite-Verification/2.0',
        },
        signal: controller.signal,
      });

      clearTimeout(id);

      return {
        url,
        isAlive: res.status < 400,
        statusCode: res.status,
      };
    } catch (err: any) {
      return {
        url,
        isAlive: false,
        error: err.name === 'AbortError' ? 'Timeout' : err.message,
      };
    }
  }
}
