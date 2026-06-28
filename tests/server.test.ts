
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

/**
 * Tests for MCP server tools and resources.
 * These tests verify the schema exports and tool functionality indirectly.
 */

describe('MCP Server', () => {
  describe('Tool schemas', () => {
    it('get_components tool returns valid schema', async () => {
      const { getAllComponents } = await import('../src/schemas/components')
      const components = getAllComponents()
      
      expect(components.length).toBeGreaterThan(0)
      expect(components[0]).toHaveProperty('name')
      expect(components[0]).toHaveProperty('description')
      expect(components[0]).toHaveProperty('props')
      expect(components[0]).toHaveProperty('syntax')
      expect(components[0]).toHaveProperty('example')
    })

    it('get_frontmatter tool returns valid schema', async () => {
      const { getAllPageTypes, getFieldsForPageType } = await import('../src/schemas/frontmatter')
      
      const pageTypes = getAllPageTypes()
      expect(pageTypes.length).toBeGreaterThan(0)
      
      const guideFields = getFieldsForPageType('guide')
      expect(guideFields.length).toBeGreaterThan(0)
      expect(guideFields.some(f => f.name === 'title')).toBe(true)
    })

    it('get_config tool returns valid schema', async () => {
      const { getConfigSchema, getExampleConfig } = await import('../src/schemas/config')
      
      const schema = getConfigSchema()
      expect(schema.length).toBeGreaterThan(0)
      
      const example = getExampleConfig()
      expect(example.name).toBeDefined()
      expect(example.navigation).toBeDefined()
    })

    it('validate_mdx tool validates content correctly', async () => {
      const { validateMdx } = await import('../src/schemas/validator')
      
      const validContent = `---
title: Test
---

Content here.`

      const result = validateMdx(validContent)
      expect(result.valid).toBe(true)
      expect(result.errors.length).toBe(0)
    })
  })

  describe('create_page tool', () => {
    it('generates guide page', async () => {
      const { getAllPageTypes, getFieldsForPageType } = await import('../src/schemas/frontmatter')
      
      const guideType = getAllPageTypes().find(pt => pt.type === 'guide')
      expect(guideType).toBeDefined()
      expect(guideType?.example).toContain('title:')
    })

    it('generates api-reference page', async () => {
      const { getPageType } = await import('../src/schemas/frontmatter')
      
      const apiType = getPageType('api-reference')
      expect(apiType).toBeDefined()
      expect(apiType?.example).toContain('method:')
      expect(apiType?.example).toContain('endpoint:')
    })
  })

  describe('Resource schemas', () => {
    it('syntext://components resource contains all components', async () => {
      const { getAllComponents, getComponentCategories } = await import('../src/schemas/components')
      
      const components = getAllComponents()
      const categories = getComponentCategories()
      
      // Resource should contain both
      expect(components.length).toBeGreaterThan(10)
      expect(Object.keys(categories).length).toBeGreaterThan(5)
    })

    it('syntext://config resource contains schema and examples', async () => {
      const { getConfigSchema, getExampleConfig, getMinimalConfig } = await import('../src/schemas/config')
      
      const schema = getConfigSchema()
      const example = getExampleConfig()
      const minimal = getMinimalConfig()
      
      expect(schema.length).toBeGreaterThan(0)
      expect(example.name).toBeDefined()
      expect(minimal.name).toBeDefined()
    })
  })

  describe('Integration', () => {
    it('all schema modules can be imported together', async () => {
      const [components, frontmatter, config, validator] = await Promise.all([
        import('../src/schemas/components'),
        import('../src/schemas/frontmatter'),
        import('../src/schemas/config'),
        import('../src/schemas/validator'),
      ])
      
      expect(components.getAllComponents).toBeDefined()
      expect(frontmatter.getAllPageTypes).toBeDefined()
      expect(config.getConfigSchema).toBeDefined()
      expect(validator.validateMdx).toBeDefined()
    })

    it('validator uses component definitions', async () => {
      const { validateMdx } = await import('../src/schemas/validator')
      const { getComponent } = await import('../src/schemas/components')
      
      // Card component exists in schema
      const card = getComponent('Card')
      expect(card).toBeDefined()
      
      // Validator should recognize Card
      const result = validateMdx(`---
title: Test
---

<Card title="Test">Content</Card>`)
      
      expect(result.valid).toBe(true)
    })
  })
})
