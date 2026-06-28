#!/usr/bin/env node
/**
 * Syntext MCP Server
 * 
 * Model Context Protocol server that helps AI assistants generate valid Syntext documentation.
 * Provides tools for:
 * - Getting MDX component syntax and examples
 * - Getting frontmatter schema for different page types
 * - Getting syntext.config.json schema
 * - Validating MDX content
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

import {
  getAllComponents,
  getComponent,
  getComponentCategories,
  getAllPageTypes,
  getPageType,
  getFieldsForPageType,
  ICON_NAMES,
  getConfigSchema,
  getExampleConfig,
  getMinimalConfig,
  validateMdx,
  quickValidate,
} from './schemas/index.js'

const server = new McpServer({
  name: 'syntext',
  version: '0.1.0',
})

// ═══════════════════════════════════════════════════════════════════════════════
// TOOL: get_components
// ═══════════════════════════════════════════════════════════════════════════════

server.tool(
  'get_components',
  'Get Syntext MDX components with their props, syntax, and examples. Use this to learn how to write valid Syntext documentation.',
  {
    name: z.string().optional().describe('Specific component name (e.g., "Card", "CodeGroup"). Omit to get all components.'),
    category: z.enum(['layout', 'code', 'callouts', 'interactive', 'api', 'media', 'steps']).optional().describe('Filter by category'),
  },
  async ({ name, category }) => {
    if (name) {
      const component = getComponent(name)
      if (!component) {
        return {
          content: [{ type: 'text', text: `Component "${name}" not found. Available components:\n${getAllComponents().map(c => c.name).join(', ')}` }],
        }
      }
      return {
        content: [{
          type: 'text',
          text: formatComponent(component),
        }],
      }
    }

    const categories = getComponentCategories()
    let components = getAllComponents()

    if (category) {
      const categoryNames = categories[category] || []
      components = components.filter(c => categoryNames.includes(c.name))
    }

    const output = components.map(formatComponent).join('\n\n---\n\n')
    
    return {
      content: [{ type: 'text', text: output }],
    }
  }
)

function formatComponent(comp: ReturnType<typeof getComponent>): string {
  if (!comp) return ''
  
  let output = `## ${comp.name}\n\n${comp.description}\n\n`
  
  if (comp.props.length > 0) {
    output += '### Props\n\n'
    for (const prop of comp.props) {
      const required = prop.required ? ' (required)' : ''
      const defaultVal = prop.default ? ` [default: ${prop.default}]` : ''
      output += `- **${prop.name}**: \`${prop.type}\`${required}${defaultVal} — ${prop.description}\n`
    }
    output += '\n'
  }
  
  output += `### Syntax\n\n\`\`\`jsx\n${comp.syntax}\n\`\`\`\n\n`
  output += `### Example\n\n\`\`\`mdx\n${comp.example}\n\`\`\`\n`
  
  if (comp.notes) {
    output += `\n> **Note:** ${comp.notes}\n`
  }
  
  return output
}

// ═══════════════════════════════════════════════════════════════════════════════
// TOOL: get_frontmatter
// ═══════════════════════════════════════════════════════════════════════════════

server.tool(
  'get_frontmatter',
  'Get frontmatter schema for Syntext MDX pages. Every page needs frontmatter with at least a title.',
  {
    pageType: z.enum(['guide', 'api-reference', 'changelog', 'landing', 'sdk']).optional().describe('Page type to get specific fields for'),
  },
  async ({ pageType }) => {
    if (pageType) {
      const schema = getPageType(pageType)
      if (!schema) {
        return {
          content: [{ type: 'text', text: `Unknown page type: ${pageType}` }],
        }
      }
      
      const fields = getFieldsForPageType(pageType)
      let output = `## ${schema.type} Page Frontmatter\n\n${schema.description}\n\n### Fields\n\n`
      
      for (const field of fields) {
        const required = field.required ? ' (required)' : ''
        const values = field.values ? ` Values: ${field.values.join(', ')}` : ''
        output += `- **${field.name}**: \`${field.type}\`${required} — ${field.description}${values}\n`
      }
      
      output += `\n### Example\n\n\`\`\`yaml\n${schema.example}\n\`\`\`\n`
      
      return {
        content: [{ type: 'text', text: output }],
      }
    }

    // Return all page types
    const pageTypes = getAllPageTypes()
    let output = '# Syntext Frontmatter Reference\n\nEvery MDX page must start with frontmatter (YAML between --- delimiters).\n\n'
    
    for (const pt of pageTypes) {
      output += `## ${pt.type}\n\n${pt.description}\n\n\`\`\`yaml\n${pt.example}\n\`\`\`\n\n`
    }

    output += `\n## Available Icons\n\n${ICON_NAMES.join(', ')}\n`
    
    return {
      content: [{ type: 'text', text: output }],
    }
  }
)

// ═══════════════════════════════════════════════════════════════════════════════
// TOOL: get_config
// ═══════════════════════════════════════════════════════════════════════════════

server.tool(
  'get_config',
  'Get the syntext.config.json schema and examples. This file configures your documentation project.',
  {
    example: z.enum(['full', 'minimal']).optional().describe('Get an example config instead of schema'),
  },
  async ({ example }) => {
    if (example === 'full') {
      return {
        content: [{
          type: 'text',
          text: `# Full syntext.config.json Example\n\n\`\`\`json\n${JSON.stringify(getExampleConfig(), null, 2)}\n\`\`\``,
        }],
      }
    }
    
    if (example === 'minimal') {
      return {
        content: [{
          type: 'text',
          text: `# Minimal syntext.config.json\n\n\`\`\`json\n${JSON.stringify(getMinimalConfig(), null, 2)}\n\`\`\``,
        }],
      }
    }

    const schema = getConfigSchema()
    let output = '# syntext.config.json Schema\n\n'
    
    for (const field of schema) {
      const required = field.required ? ' (required)' : ''
      output += `## ${field.name}\n\n`
      output += `**Type:** \`${field.type}\`${required}\n\n`
      output += `${field.description}\n\n`
      
      if (field.example !== undefined) {
        output += `**Example:** \`${JSON.stringify(field.example)}\`\n\n`
      }
      
      if (field.children) {
        output += '**Properties:**\n\n'
        for (const child of field.children) {
          const childRequired = child.required ? ' (required)' : ''
          output += `- **${child.name}**: \`${child.type}\`${childRequired} — ${child.description}\n`
        }
        output += '\n'
      }
    }
    
    return {
      content: [{ type: 'text', text: output }],
    }
  }
)

// ═══════════════════════════════════════════════════════════════════════════════
// TOOL: validate_mdx
// ═══════════════════════════════════════════════════════════════════════════════

server.tool(
  'validate_mdx',
  'Validate Syntext MDX content for errors and warnings. Use this to check if your generated documentation is valid.',
  {
    content: z.string().describe('The MDX content to validate'),
  },
  async ({ content }) => {
    const result = validateMdx(content)
    
    let output = result.valid 
      ? '✅ **Valid Syntext MDX**\n\n'
      : '❌ **Invalid Syntext MDX**\n\n'
    
    if (result.errors.length > 0) {
      output += '### Errors\n\n'
      for (const error of result.errors) {
        const line = error.line ? ` (line ${error.line})` : ''
        output += `- ${error.message}${line}\n`
        if (error.suggestion) {
          output += `  → ${error.suggestion}\n`
        }
      }
      output += '\n'
    }
    
    if (result.warnings.length > 0) {
      output += '### Warnings\n\n'
      for (const warning of result.warnings) {
        const line = warning.line ? ` (line ${warning.line})` : ''
        output += `- ${warning.message}${line}\n`
        if (warning.suggestion) {
          output += `  → ${warning.suggestion}\n`
        }
      }
    }
    
    if (result.valid && result.warnings.length === 0) {
      output += 'No issues found. The content is ready to use.\n'
    }
    
    return {
      content: [{ type: 'text', text: output }],
    }
  }
)

// ═══════════════════════════════════════════════════════════════════════════════
// TOOL: create_page
// ═══════════════════════════════════════════════════════════════════════════════

server.tool(
  'create_page',
  'Generate a complete Syntext MDX page template with proper frontmatter and structure.',
  {
    pageType: z.enum(['guide', 'api-reference', 'quickstart', 'landing']).describe('Type of page to create'),
    title: z.string().describe('Page title'),
    description: z.string().optional().describe('Page description'),
  },
  async ({ pageType, title, description }) => {
    let content = ''
    
    switch (pageType) {
      case 'guide':
        content = `---
title: ${title}
description: ${description || 'Add a description here.'}
icon: book
---

# ${title}

${description || 'Introduction paragraph here.'}

## Overview

Explain the main concept here.

## Getting Started

<Steps>
  <Step title="Step 1">
    First step instructions.
  </Step>
  <Step title="Step 2">
    Second step instructions.
  </Step>
</Steps>

## Next Steps

<CardGroup cols={2}>
  <Card title="Related Guide" icon="book" href="/guides/related">
    Learn more about related topics.
  </Card>
  <Card title="API Reference" icon="code" href="/api-reference">
    Explore the API endpoints.
  </Card>
</CardGroup>
`
        break
        
      case 'api-reference':
        content = `---
title: ${title}
description: ${description || 'API endpoint description.'}
method: GET
endpoint: /v1/resource
auth: required
---

# ${title}

${description || 'Endpoint description here.'}

## Request

### Path Parameters

<ParamField name="id" type="string" required>
  The unique identifier for the resource.
</ParamField>

### Query Parameters

<ParamField name="limit" type="number" default="20">
  Maximum number of results to return.
</ParamField>

## Response

<ResponseField name="id" type="string">
  Unique identifier.
</ResponseField>

<ResponseField name="created_at" type="string">
  ISO 8601 timestamp.
</ResponseField>

## Example

<CodeGroup>
\`\`\`typescript title="TypeScript"
const response = await client.resource.get("id_123");
\`\`\`

\`\`\`curl title="cURL"
curl -X GET https://api.example.com/v1/resource/id_123 \\
  -H "Authorization: Bearer $API_KEY"
\`\`\`
</CodeGroup>
`
        break
        
      case 'quickstart':
        content = `---
title: ${title}
description: ${description || 'Get started quickly with our API.'}
icon: rocket
---

# ${title}

${description || 'Learn how to get started in under 5 minutes.'}

## Prerequisites

Before you begin, make sure you have:

- An API key from the dashboard
- Node.js 18+ installed

## Installation

<CodeGroup>
\`\`\`bash title="npm"
npm install @example/sdk
\`\`\`

\`\`\`bash title="yarn"
yarn add @example/sdk
\`\`\`

\`\`\`bash title="pnpm"
pnpm add @example/sdk
\`\`\`
</CodeGroup>

## Quick Start

<Steps>
  <Step title="Initialize the client">
    \`\`\`typescript
    import { Client } from '@example/sdk';
    
    const client = new Client({
      apiKey: process.env.API_KEY,
    });
    \`\`\`
  </Step>
  
  <Step title="Make your first request">
    \`\`\`typescript
    const result = await client.hello();
    console.log(result);
    \`\`\`
  </Step>
</Steps>

## Next Steps

<CardGroup cols={2}>
  <Card title="Authentication" icon="key" href="/authentication">
    Learn about API authentication options.
  </Card>
  <Card title="API Reference" icon="code" href="/api-reference">
    Explore all available endpoints.
  </Card>
</CardGroup>
`
        break
        
      case 'landing':
        content = `---
title: ${title}
description: ${description || 'Welcome to our documentation.'}
layout: centered
hideTitle: true
---

<Hero>
  # ${title}
  
  ${description || 'Build amazing things with our developer-friendly platform.'}
</Hero>

<CardGroup cols={3}>
  <Card title="Quick Start" icon="rocket" href="/quickstart">
    Get up and running in 5 minutes.
  </Card>
  <Card title="Guides" icon="book" href="/guides">
    Learn best practices and patterns.
  </Card>
  <Card title="API Reference" icon="code" href="/api-reference">
    Explore our REST API endpoints.
  </Card>
</CardGroup>

## Features

<CardGroup cols={2}>
  <Card title="Easy Integration" icon="zap">
    Simple SDKs for every major language.
  </Card>
  <Card title="Real-time Updates" icon="globe">
    Webhooks and streaming for live data.
  </Card>
  <Card title="Enterprise Ready" icon="shield">
    SOC 2 compliant with 99.9% uptime.
  </Card>
  <Card title="Great Support" icon="users">
    Dedicated support for all plans.
  </Card>
</CardGroup>
`
        break
    }
    
    // Validate the generated content
    const validation = validateMdx(content)
    
    let output = `# Generated ${pageType} Page\n\n`
    output += '```mdx\n' + content + '\n```\n\n'
    
    if (!validation.valid) {
      output += '⚠️ **Note:** Generated content has some issues. Please review.\n'
    }
    
    return {
      content: [{ type: 'text', text: output }],
    }
  }
)

// ═══════════════════════════════════════════════════════════════════════════════
// RESOURCES
// ═══════════════════════════════════════════════════════════════════════════════

// Component reference as a resource
server.resource(
  'syntext://components',
  'Syntext MDX Components Reference',
  async () => {
    const components = getAllComponents()
    const content = components.map(formatComponent).join('\n\n---\n\n')
    
    return {
      contents: [{
        uri: 'syntext://components',
        mimeType: 'text/markdown',
        text: `# Syntext MDX Components\n\n${content}`,
      }],
    }
  }
)

// Config reference as a resource
server.resource(
  'syntext://config',
  'syntext.config.json Reference',
  async () => {
    return {
      contents: [{
        uri: 'syntext://config',
        mimeType: 'application/json',
        text: JSON.stringify(getExampleConfig(), null, 2),
      }],
    }
  }
)

// ═══════════════════════════════════════════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch(console.error)
