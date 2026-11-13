import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8')) as { description: string }
const readme = readFileSync(join(process.cwd(), 'README.md'), 'utf-8')

describe('package metadata', () => {
  it('should describe the server for any AI assistant, not only coding tools', () => {
    expect(pkg.description).toBe('MCP server for Syntext docs: lets AI assistants write, check and publish valid Syntext pages.')
  })

  it('should open the README with the same line and name more than one kind of MCP client', () => {
    expect(readme).toContain('lets AI assistants write, check and publish valid Syntext pages')
    expect(readme).toContain('Use it from Claude, Cursor, Copilot or any MCP client.')
    expect(readme).not.toContain('AI coding assistant')
  })
})
