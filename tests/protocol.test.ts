/**
 * Protocol-level tests: connect a real MCP client to the server over an
 * in-memory transport and exercise tools/list, tools/call, resources/list,
 * and resources/read exactly as an AI agent would.
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import { readFileSync } from 'node:fs'
import { createServer, SERVER_VERSION } from '../src/server'

type TextContent = { type: 'text'; text: string }

function firstText(result: { content?: unknown }): string {
  const content = result.content as TextContent[] | undefined
  if (!content || content.length === 0 || content[0].type !== 'text') {
    throw new Error('Expected text content')
  }
  return content[0].text
}

describe('MCP protocol (in-memory transport)', () => {
  let client: Client

  beforeEach(async () => {
    const server = createServer()
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
    client = new Client({ name: 'test-client', version: '1.0.0' })
    await Promise.all([
      server.connect(serverTransport),
      client.connect(clientTransport),
    ])
  })

  afterEach(async () => {
    await client.close()
  })

  it('advertises all five tools', async () => {
    const { tools } = await client.listTools()
    const names = tools.map(t => t.name).sort()
    expect(names).toEqual([
      'create_page',
      'get_components',
      'get_config',
      'get_frontmatter',
      'validate_mdx',
    ])
  })

  it('annotates every tool as read-only with a title and explicit hints', async () => {
    const { tools } = await client.listTools()
    for (const tool of tools) {
      expect(tool.annotations?.title).toEqual(expect.any(String))
      expect(tool.annotations?.title?.length).toBeGreaterThan(0)
      expect(tool.annotations?.readOnlyHint).toBe(true)
      expect(tool.annotations?.destructiveHint).toBe(false)
      expect(tool.annotations?.openWorldHint).toBe(false)
      expect(tool.name.length).toBeLessThanOrEqual(64)
    }
    const createPage = tools.find(t => t.name === 'create_page')
    expect(createPage?.annotations?.title).toBe('Generate page template')
    expect(createPage?.description).toContain('does not create or save a file')
  })

  it('get_components returns a specific component', async () => {
    const result = await client.callTool({ name: 'get_components', arguments: { name: 'Card' } })
    const text = firstText(result)
    expect(text).toContain('## Card')
    expect(text).toContain('### Props')
  })

  it('get_frontmatter returns schema for a page type', async () => {
    const result = await client.callTool({ name: 'get_frontmatter', arguments: { pageType: 'guide' } })
    const text = firstText(result)
    expect(text).toContain('title')
    expect(text).toContain('```yaml')
  })

  it('get_config returns the full example', async () => {
    const result = await client.callTool({ name: 'get_config', arguments: { example: 'full' } })
    const text = firstText(result)
    expect(text).toContain('syntext.json')
    expect(text).toContain('```json')
  })

  it('validate_mdx flags missing frontmatter', async () => {
    const result = await client.callTool({ name: 'validate_mdx', arguments: { content: '# No frontmatter' } })
    const text = firstText(result)
    expect(text).toContain('Invalid')
  })

  it('create_page generates a valid guide page', async () => {
    const result = await client.callTool({
      name: 'create_page',
      arguments: { pageType: 'guide', title: 'Test Guide' },
    })
    const text = firstText(result)
    expect(text).toContain('title: Test Guide')
    expect(text).not.toContain('⚠️')
  })

  it('lists resources with valid syntext:// URIs', async () => {
    const { resources } = await client.listResources()
    const uris = resources.map(r => r.uri).sort()
    expect(uris).toEqual(['syntext://components', 'syntext://config'])
  })

  it('reads the syntext://components resource', async () => {
    const result = await client.readResource({ uri: 'syntext://components' })
    expect(result.contents.length).toBe(1)
    expect(result.contents[0].uri).toBe('syntext://components')
    expect(String(result.contents[0].text)).toContain('# Syntext MDX Components')
  })

  it('reads the syntext://config resource as JSON', async () => {
    const result = await client.readResource({ uri: 'syntext://config' })
    expect(result.contents[0].mimeType).toBe('application/json')
    const parsed = JSON.parse(String(result.contents[0].text)) as { name?: string }
    expect(parsed.name).toBeDefined()
  })

  it('reports the package version', () => {
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as { version: string }
    expect(SERVER_VERSION).toBe(pkg.version)
    expect(client.getServerVersion()?.version).toBe(pkg.version)
  })

  it('create_page landing returns the home starter built from components', async () => {
    const result = await client.callTool({
      name: 'create_page',
      arguments: { pageType: 'landing', title: 'Acme', description: 'Docs for Acme.' },
    })
    const text = firstText(result)
    expect(text).toContain('layout: wide')
    expect(text).toContain('<Hero title="Acme" description="Docs for Acme.">')
    expect(text).toContain('<SectionCards />')
    expect(text).toContain('<LatestUpdates count={3} />')
    expect(text).not.toContain('Generated content has some issues')
  })

  it('get_components lists the home category', async () => {
    const result = await client.callTool({ name: 'get_components', arguments: { category: 'home' } })
    const text = firstText(result)
    for (const name of ['Hero', 'SearchBar', 'SectionCards', 'LatestUpdates', 'SupportCard']) {
      expect(text).toContain(`## ${name}`)
    }
    expect(text).not.toContain('## CodeGroup')
  })

  it('describes the home as index.mdx built from components', async () => {
    const { tools } = await client.listTools()
    const byName = Object.fromEntries(tools.map(t => [t.name, t.description ?? '']))
    expect(byName.get_components).toContain('index.mdx built from components')
    expect(byName.create_page).toContain('index.mdx')
    expect(byName.get_frontmatter).toContain('layout: wide')
  })

  it('get_frontmatter landing marks home as deprecated', async () => {
    const result = await client.callTool({ name: 'get_frontmatter', arguments: { pageType: 'landing' } })
    const text = firstText(result)
    expect(text).toMatch(/\*\*home\*\*.*\*\*Deprecated:\*\*/)
    expect(text).toContain('wide')
  })
})
