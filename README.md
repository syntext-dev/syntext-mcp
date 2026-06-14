# Syntext MCP Server

Model Context Protocol server that exposes Syntext documentation to AI coding assistants (VS Code Copilot, Cursor, etc.). Self-contained — uses the SDK internally.

## Development

```bash
bun install
bun dev
```

## Structure

```
src/
├── index.ts            # MCP server entry point
├── tools/
│   ├── search-docs.ts  # Search project documentation
│   ├── get-page.ts     # Get specific doc page content
│   ├── ask-ai.ts       # Ask the AI assistant a question
│   └── list-apis.ts    # List API endpoints from spec
├── resources/
│   ├── docs.ts         # Documentation content as resources
│   └── changelog.ts    # Changelog entries
└── lib/
    └── client.ts       # API client (self-contained HTTP)
```

## Key Responsibilities
- Expose doc search as MCP tool (AI agents can search docs)
- Expose page content as MCP resources
- Provide AI Q&A tool for coding assistants
- Auth via Syntext API key in MCP config
