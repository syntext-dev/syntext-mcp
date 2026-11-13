# Syntext MCP Server

[![npm version](https://img.shields.io/npm/v/@syntext/mcp.svg)](https://www.npmjs.com/package/@syntext/mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Model Context Protocol (MCP) server that enables AI assistants (GitHub Copilot, Cursor, Claude Desktop) to generate valid [Syntext](https://syntext.dev) documentation.

## What is this?

When you're using an AI coding assistant to write documentation for your Syntext-powered docs site, the AI needs to know:
- Which MDX components are available (`<Card>`, `<CodeGroup>`, `<Note>`, etc.)
- What props each component accepts
- How to structure frontmatter for different page types
- How to configure `syntext.json`

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

The server runs over **stdio** and requires **no arguments, environment variables, or API keys** — it is a fully offline, project-agnostic authoring assistant. (To let an AI agent query a *deployed* doc site's content — search, pages, Q&A — use that site's remote MCP endpoint at `https://{slug}-docs.syntext.dev/_mcp` instead; that is separate from this package.)

### VS Code (Copilot/Claude)

Add to `.vscode/mcp.json` in your workspace (or your user-level `mcp.json`):

```json
{
  "servers": {
    "syntext": {
      "type": "stdio",
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

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

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

## Usage Example

Once configured, your AI assistant can generate valid Syntext docs:

**You:** "Create a getting started guide for my API"

**AI:** *(uses `get_frontmatter` to get guide schema, `get_components` to find available components)*

```mdx
---
title: Getting Started
description: Get up and running with our API in 5 minutes
icon: rocket
---

# Getting Started

<Note>
You'll need an API key to follow along. [Get one here](/dashboard).
</Note>

<Steps>
  <Step title="Install the SDK">
    ```bash
    npm install @acme/sdk
    ```
  </Step>
  <Step title="Initialize the client">
    ```typescript
    import { Acme } from '@acme/sdk'
    const client = new Acme({ apiKey: process.env.ACME_API_KEY })
    ```
  </Step>
</Steps>

<CardGroup cols={2}>
  <Card title="API Reference" icon="code" href="/api-reference">
    Explore all endpoints
  </Card>
  <Card title="Examples" icon="lightbulb" href="/examples">
    See working code samples
  </Card>
</CardGroup>
```

The AI knows the exact props, syntax, and nesting rules because it queried the MCP server.

## Tools

Every tool is read-only: it returns reference material or checks the text you pass it, and never reads or writes your files, account or network. Each tool declares MCP annotations (`title`, `readOnlyHint: true`, `destructiveHint: false`, `openWorldHint: false`), so clients that honour them can run the tools without asking each time.

### `get_components`
Get available MDX components with syntax, props, and examples.

**Parameters:**
- `name` (optional): Specific component name to get details for
- `category` (optional): Filter by category (layout, home, navigation, code, callouts, interactive, api, media, steps). `home` lists the components the docs home is built from.

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
- `pageType` (optional): Type of page (guide, api-reference, changelog, landing, sdk). Omit to get all page types plus the icon list.

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
Get the `syntext.json` schema with field descriptions.

**Parameters:**
- `example` (optional): `"full"` or `"minimal"` — return an example config instead of the schema

### `validate_mdx`
Validate MDX content for errors and warnings.

**Parameters:**
- `content`: The MDX content to validate

**Example response (markdown):**
```markdown
❌ **Invalid Syntext MDX**

### Errors

- Missing required frontmatter field: title (line 1)

### Warnings

- <CardGroup> found without any <Card> children (line 8)
```

### `create_page`
Generate a page template for a specific page type. Returns the template as text; nothing is saved.

**Parameters:**
- `pageType`: Type of page (guide, api-reference, quickstart, landing)
- `title`: Page title
- `description` (optional): Page description

`landing` is the docs home, `index.mdx`. On doc engine v2 the home is the page's own content, built from the home components with `layout: wide`; the template is the same starter a new Syntext project gets:

```mdx
---
title: Acme
description: Guides, API reference and answers, in one place.
layout: wide
---

<Hero title="Acme" description="Guides, API reference and answers, in one place.">
  <SearchBar mode="both" />

  [Get started](/quickstart) [API reference](/api-reference)
</Hero>

<SectionCards />

<LatestUpdates count={3} />
```

The `home` frontmatter key (the generated home) is deprecated and stops on 27 November 2026; `validate_mdx` warns about it. `home: false` opts an index in to rendering its own content.

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
| Home (doc engine v2) | `Hero` (with `title`), `SearchBar`, `SectionCards`, `QuickStart`, `ApiGroups`, `SdkList`, `CommandList`, `PopularPages`, `LatestUpdates`, `SupportCard` |
| Navigation | `SearchBar` |
| Code | `CodeGroup` |
| Callouts | `Note`, `Tip`, `Warning`, `Danger` |
| Interactive | `Tabs`, `Expandable` |
| API Reference | `ParamField`, `ResponseField` |
| Media | `Frame`, `Video` |
| Steps | `Steps`, `Step` |

## Development

```bash
npm install
npm run dev        # Run in development mode
npm test           # Run tests
npm run build      # Build for production
```

## Structure

```
src/
├── index.ts              # stdio entry point
├── server.ts             # MCP server factory (tools + resources)
└── schemas/
    ├── components.ts     # Component definitions
    ├── components-home.ts # Home components (doc engine v2)
    ├── starter-index.ts  # Starter index.mdx (create_page landing)
    ├── frontmatter.ts    # Page type schemas
    ├── config.ts         # syntext.json schema
    └── validator.ts      # MDX validation
```

## Troubleshooting

**MCP server not connecting:**
- Ensure `npx @syntext/mcp` runs without errors in your terminal
- Restart your editor after updating MCP config
- Check that Node.js 18+ is installed

**AI not using Syntext components:**
- Mention "Syntext" or "use Syntext components" in your prompt
- The AI should automatically query `get_components` for available options

**Validation errors:**
- Use the `validate_mdx` tool to check your content before saving
- Common issues: missing frontmatter title, unclosed components. Components with no children can be self-closing (`<SectionCards />`).

## License

MIT
