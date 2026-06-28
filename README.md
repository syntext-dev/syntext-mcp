# Syntext MCP Server

[![npm version](https://img.shields.io/npm/v/@syntext/mcp.svg)](https://www.npmjs.com/package/@syntext/mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Model Context Protocol (MCP) server that enables AI assistants (GitHub Copilot, Cursor, Claude Desktop) to generate valid [Syntext](https://syntext.dev) documentation.

## What is this?

When you're using an AI coding assistant to write documentation for your Syntext-powered docs site, the AI needs to know:
- Which MDX components are available (`<Card>`, `<CodeGroup>`, `<Note>`, etc.)
- What props each component accepts
- How to structure frontmatter for different page types
- How to configure `syntext.config.json`

This MCP server provides that knowledge to your AI assistant, so it can generate correct, valid Syntext documentation without hallucinating component names or props.

## Installation

```bash
npm install -g @syntext/mcp
```

Or with npx:

```bash
npx @syntext/mcp
```

## Configuration

### VS Code (Copilot/Claude)

Add to your VS Code settings or `~/.vscode/settings.json`:

```json
{
  "mcp.servers": {
    "syntext": {
      "command": "npx",
      "args": ["@syntext/mcp"]
    }
  }
}
```

### Cursor

Add to your Cursor MCP config:

```json
{
  "mcpServers": {
    "syntext": {
      "command": "npx",
      "args": ["@syntext/mcp"]
    }
  }
}
```

## Tools

### `get_components`
Get available MDX components with syntax, props, and examples.

**Parameters:**
- `name` (optional): Specific component name to get details for
- `category` (optional): Filter by category (layout, code, callouts, interactive, api, media, steps)

**Example response:**
```json
{
  "name": "Card",
  "description": "Display content in a card with optional link",
  "props": [
    { "name": "title", "type": "string", "required": true, "description": "Card title" },
    { "name": "icon", "type": "string", "required": false, "description": "Icon name" },
    { "name": "href", "type": "string", "required": false, "description": "Link URL" }
  ],
  "syntax": "<Card title=\"...\">content</Card>",
  "example": "<Card title=\"Quick Start\" icon=\"rocket\" href=\"/getting-started\">\n  Get up and running in 5 minutes\n</Card>"
}
```

### `get_frontmatter`
Get frontmatter schema for different page types.

**Parameters:**
- `pageType`: Type of page (guide, api-reference, changelog, landing, sdk)

**Example response for `api-reference`:**
```yaml
---
title: Create User
description: Create a new user account
method: POST
endpoint: /api/users
auth: required
---
```

### `get_config`
Get `syntext.config.json` schema with field descriptions.

**Parameters:**
- `includeExample` (boolean): Include example config in response

### `validate_mdx`
Validate MDX content for errors and warnings.

**Parameters:**
- `content`: The MDX content to validate

**Example response:**
```json
{
  "valid": false,
  "errors": [
    { "line": 1, "message": "Missing required field: title" }
  ],
  "warnings": [
    { "line": 8, "message": "<CardGroup> found without any <Card> children" }
  ]
}
```

### `create_page`
Generate a page template for a specific page type.

**Parameters:**
- `pageType`: Type of page (guide, api-reference, changelog, landing, sdk)
- `title`: Page title
- `description` (optional): Page description

## Resources

### `syntext://components`
Full component reference including all components, their props, syntax, and examples.

### `syntext://config`
Configuration schema with example configs.

## Available Components

The MCP server provides schemas for these Syntext MDX components:

| Category | Components |
|----------|------------|
| Layout | `Card`, `CardGroup`, `Hero` |
| Code | `CodeGroup` |
| Callouts | `Note`, `Tip`, `Warning`, `Danger` |
| Interactive | `Tabs`, `Expandable` |
| API Reference | `ParamField`, `ResponseField` |
| Media | `Frame`, `Video` |
| Steps | `Steps`, `Step` |

## Development

```bash
bun install
bun dev        # Run in development mode
bun test       # Run tests
bun run build  # Build for production
```

## Structure

```
src/
├── index.ts              # MCP server entry point
└── schemas/
    ├── components.ts     # Component definitions
    ├── frontmatter.ts    # Page type schemas
    ├── config.ts         # syntext.config.json schema
    └── validator.ts      # MDX validation
```

## License

MIT
