import { describe, it, expect } from 'bun:test'
import {
  getConfigSchema,
  getExampleConfig,
  getMinimalConfig,
} from '../src/schemas/config'

describe('Config Schema', () => {
  describe('getConfigSchema', () => {
    it('returns an array of config fields', () => {
      const schema = getConfigSchema()
      expect(Array.isArray(schema)).toBe(true)
      expect(schema.length).toBeGreaterThan(0)
    })

    it('each field has required properties', () => {
      const schema = getConfigSchema()
      for (const field of schema) {
        expect(field.name).toBeDefined()
        expect(typeof field.name).toBe('string')
        expect(field.type).toBeDefined()
        expect(typeof field.required).toBe('boolean')
        expect(field.description).toBeDefined()
      }
    })

    it('includes name as required', () => {
      const schema = getConfigSchema()
      const nameField = schema.find(f => f.name === 'name')
      
      expect(nameField).toBeDefined()
      expect(nameField?.required).toBe(true)
    })

    it('includes navigation as required', () => {
      const schema = getConfigSchema()
      const navField = schema.find(f => f.name === 'navigation')
      
      expect(navField).toBeDefined()
      expect(navField?.required).toBe(true)
    })

    it('colors field has children', () => {
      const schema = getConfigSchema()
      const colorsField = schema.find(f => f.name === 'colors')
      
      expect(colorsField).toBeDefined()
      expect(colorsField?.children).toBeDefined()
      expect(colorsField?.children?.length).toBeGreaterThan(0)
      
      const primaryChild = colorsField?.children?.find(c => c.name === 'primary')
      expect(primaryChild).toBeDefined()
    })

    it('social field has children', () => {
      const schema = getConfigSchema()
      const socialField = schema.find(f => f.name === 'social')
      
      expect(socialField).toBeDefined()
      expect(socialField?.children).toBeDefined()
      
      const githubChild = socialField?.children?.find(c => c.name === 'github')
      expect(githubChild).toBeDefined()
    })
  })

  describe('getExampleConfig', () => {
    it('returns a valid config object', () => {
      const config = getExampleConfig()
      
      expect(config.name).toBeDefined()
      expect(typeof config.name).toBe('string')
      expect(config.navigation).toBeDefined()
      expect(Array.isArray(config.navigation)).toBe(true)
    })

    it('has required fields', () => {
      const config = getExampleConfig()
      
      expect(config.name).toBe('Acme API')
      expect(config.navigation.length).toBeGreaterThan(0)
    })

    it('has optional fields for completeness', () => {
      const config = getExampleConfig()
      
      expect(config.logo).toBeDefined()
      expect(config.favicon).toBeDefined()
      expect(config.colors).toBeDefined()
      expect(config.tabs).toBeDefined()
      expect(config.social).toBeDefined()
    })

    it('navigation groups have pages', () => {
      const config = getExampleConfig()
      
      for (const group of config.navigation) {
        expect(group.group).toBeDefined()
        expect(group.pages).toBeDefined()
        expect(Array.isArray(group.pages)).toBe(true)
      }
    })

    it('tabs have name and url', () => {
      const config = getExampleConfig()
      
      if (config.tabs) {
        for (const tab of config.tabs) {
          expect(tab.name).toBeDefined()
          expect(tab.url).toBeDefined()
        }
      }
    })
  })

  describe('getMinimalConfig', () => {
    it('returns a minimal config object', () => {
      const config = getMinimalConfig()
      
      expect(config.name).toBeDefined()
      expect(config.navigation).toBeDefined()
    })

    it('has only required fields', () => {
      const config = getMinimalConfig()
      const keys = Object.keys(config)
      
      // Only name and navigation are required
      expect(keys.length).toBe(2)
      expect(keys).toContain('name')
      expect(keys).toContain('navigation')
    })

    it('navigation has at least one group', () => {
      const config = getMinimalConfig()
      expect(config.navigation.length).toBeGreaterThan(0)
    })
  })

  describe('Config JSON validity', () => {
    it('example config serializes to valid JSON', () => {
      const config = getExampleConfig()
      const json = JSON.stringify(config)
      const parsed = JSON.parse(json)
      
      expect(parsed.name).toBe(config.name)
    })

    it('minimal config serializes to valid JSON', () => {
      const config = getMinimalConfig()
      const json = JSON.stringify(config)
      const parsed = JSON.parse(json)
      
      expect(parsed.name).toBe(config.name)
    })
  })
})
