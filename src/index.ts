#!/usr/bin/env node
/**
 * Syntext MCP Server — stdio entry point.
 *
 * Model Context Protocol server that helps AI assistants generate valid Syntext documentation.
 * Provides tools for:
 * - Getting MDX component syntax and examples
 * - Getting frontmatter schema for different page types
 * - Getting syntext.config.json schema
 * - Validating MDX content
 *
 * Transport: stdio (newline-delimited JSON-RPC, per the MCP spec).
 * Server logic lives in server.ts so it can be tested with an in-memory transport.
 */

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { createServer } from './server.js'

async function main(): Promise<void> {
  const server = createServer()
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
