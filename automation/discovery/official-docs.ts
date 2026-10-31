import { Logger } from '../shared/logger.js';

export interface DocCheckResult {
  url: string;
  accessible: boolean;
  statusCode?: number;
  contentType?: string;
  title?: string;
  error?: string;
}

export class OfficialDocsDiscoveryConnector {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('OfficialDocsDiscovery');
  }

  /**
   * Safely checks official documentation accessibility with timeout
   */
  async checkUrl(url: string, timeoutMs = 8000): Promise<DocCheckResult> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'AI-Satellite-Verification-Bot/2.0 (compatible; research bot)',
          Accept: 'text/html,application/xhtml+xml',
        },
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (!response.ok) {
        return {
          url,
          accessible: false,
          statusCode: response.status,
          error: `HTTP ${response.status}`,
        };
      }

      const contentType = response.headers.get('content-type') || '';
      return {
        url,
        accessible: true,
        statusCode: response.status,
        contentType,
      };
    } catch (err: any) {
      clearTimeout(timer);
      return {
        url,
        accessible: false,
        error: err.name === 'AbortError' ? 'Connection timed out' : err.message,
      };
    }
  }
}
