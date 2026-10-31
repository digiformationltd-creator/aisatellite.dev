/**
 * AI Satellite — AI Agents & MCP Knowledge Center Engine (Phase 11)
 * Curated knowledge base for Model Context Protocol (MCP) servers, tool calling,
 * autonomous agent architectures, and security defenses against prompt injection.
 */

import type { MCPServerResource } from './types';

export class MCPAndAgentsEngine {
  private servers: MCPServerResource[] = [
    {
      id: 'mcp-filesystem-secure',
      title: 'Secure Local Filesystem MCP Server',
      slug: 'secure-filesystem-mcp-server',
      summary: 'Standard Model Context Protocol server enabling LLMs to safely inspect, read, and write within strictly sandboxed directory boundaries.',
      category: 'mcp_servers',
      tags: ['mcp', 'filesystem', 'tools', 'sandbox', 'claude-desktop'],
      authorOrMaintainer: 'Anthropic & Model Context Protocol Community',
      sourceReferences: [
        { title: 'Official MCP Specification', url: 'https://modelcontextprotocol.io' },
        { title: 'MCP Servers Reference Implementation', url: 'https://github.com/modelcontextprotocol/servers' },
      ],
      verificationStatus: 'verified',
      lastVerifiedDate: '2026-10-31',
      publishedDate: '2026-10-31',
      updatedDate: '2026-10-31',
      relatedResourceIds: ['prompt-agentic-mcp-system-prompt', 'tutorial-cloudflare-worker-api-proxy'],
      editorialStatus: 'published',
      searchKeywords: ['mcp server', 'model context protocol', 'filesystem tool', 'claude mcp'],
      mcpProtocolVersion: '2024-11-05',
      serverType: 'stdio',
      toolsProvided: [
        {
          name: 'read_file',
          description: 'Reads text contents of a file within the allowed directory tree.',
          inputSchemaSummary: '{ path: string }',
        },
        {
          name: 'write_file',
          description: 'Creates or updates a file inside the isolated directory boundary.',
          inputSchemaSummary: '{ path: string, content: string }',
        },
        {
          name: 'list_directory',
          description: 'Lists files and folders within the allowed directory.',
          inputSchemaSummary: '{ path: string }',
        },
      ],
      permissionsRequired: ['Local filesystem access restricted to designated directory paths only.'],
      securityAdvisories: [
        'SECURITY NOTICE: Never pass root directory (/) or sensitive system paths to the allowed directories list.',
        'PROMPT INJECTION DEFENSE: Validate file paths using path.resolve to prevent directory traversal attacks (../).',
      ],
      installationSnippet: `{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/directory"]
    }
  }
}`,
      testedClients: ['Claude Desktop', 'Cursor', 'AI Satellite Agent Runner'],
    },
    {
      id: 'mcp-postgres-inspector',
      title: 'PostgreSQL Read-Only Schema & Query MCP Server',
      slug: 'postgresql-query-mcp-server',
      summary: 'Enables autonomous coding agents to inspect table schemas, relationships, and execute parameterized read-only queries with SQL injection prevention.',
      category: 'mcp_servers',
      tags: ['mcp', 'postgres', 'database', 'sql', 'read-only'],
      authorOrMaintainer: 'Model Context Protocol Core Working Group',
      sourceReferences: [
        { title: 'PostgreSQL MCP Server Repo', url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/postgres' },
      ],
      verificationStatus: 'verified',
      lastVerifiedDate: '2026-10-31',
      publishedDate: '2026-10-31',
      updatedDate: '2026-10-31',
      relatedResourceIds: ['tool-postgresql'],
      editorialStatus: 'published',
      searchKeywords: ['postgres mcp', 'database mcp', 'sql assistant', 'read-only sql agent'],
      mcpProtocolVersion: '2024-11-05',
      serverType: 'stdio',
      toolsProvided: [
        {
          name: 'describe_table',
          description: 'Inspect columns, data types, primary keys, and foreign keys for a specific table.',
          inputSchemaSummary: '{ tableName: string }',
        },
        {
          name: 'execute_read_query',
          description: 'Runs SELECT queries with strict transaction isolation and statement timeout.',
          inputSchemaSummary: '{ sql: string }',
        },
      ],
      permissionsRequired: ['Read-only database credentials with SELECT permissions only.'],
      securityAdvisories: [
        'LEAST PRIVILEGE: Always provision a dedicated Postgres role with SELECT only. Do not grant INSERT, UPDATE, or DROP privileges.',
        'TRANSACTION GUARD: Wrap queries in BEGIN TRANSACTION READ ONLY to ensure the server rejects mutating operations at the database engine level.',
      ],
      installationSnippet: `{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://readonly_user:password@localhost:5432/mydb"]
    }
  }
}`,
      testedClients: ['Claude Desktop', 'Cursor'],
    },
  ];

  public getAllServers(): MCPServerResource[] {
    return [...this.servers];
  }

  public getServerBySlug(slug: string): MCPServerResource | undefined {
    return this.servers.find((s) => s.slug === slug);
  }
}

export const mcpAndAgentsEngine = new MCPAndAgentsEngine();
