
import {
  getAllPageTypes,
  getPageType,
  getFieldsForPageType,
  COMMON_FIELDS,
  ICON_NAMES,
} from '../src/schemas/frontmatter'

describe('Frontmatter Schema', () => {
  describe('getAllPageTypes', () => {
    it('returns an array of page types', () => {
      const pageTypes = getAllPageTypes()
      expect(Array.isArray(pageTypes)).toBe(true)
      expect(pageTypes.length).toBeGreaterThan(0)
    })

    it('each page type has required fields', () => {
      const pageTypes = getAllPageTypes()
      for (const pt of pageTypes) {
        expect(pt.type).toBeDefined()
        expect(typeof pt.type).toBe('string')
        expect(pt.description).toBeDefined()
        expect(Array.isArray(pt.fields)).toBe(true)
        expect(pt.example).toBeDefined()
      }
    })

    it('includes essential page types', () => {
      const pageTypes = getAllPageTypes()
      const types = pageTypes.map(pt => pt.type)
      
      expect(types).toContain('guide')
      expect(types).toContain('api-reference')
      expect(types).toContain('changelog')
      expect(types).toContain('landing')
      expect(types).toContain('sdk')
    })
  })

  describe('getPageType', () => {
    it('returns page type by name', () => {
      const guide = getPageType('guide')
      expect(guide).toBeDefined()
      expect(guide?.type).toBe('guide')
    })

    it('returns undefined for unknown type', () => {
      const unknown = getPageType('unknown-type')
      expect(unknown).toBeUndefined()
    })
  })

  describe('getFieldsForPageType', () => {
    it('returns fields for guide page type', () => {
      const fields = getFieldsForPageType('guide')
      const fieldNames = fields.map(f => f.name)
      
      expect(fieldNames).toContain('title')
      expect(fieldNames).toContain('description')
      expect(fieldNames).toContain('icon')
    })

    it('api-reference includes method and endpoint fields', () => {
      const fields = getFieldsForPageType('api-reference')
      const fieldNames = fields.map(f => f.name)
      
      expect(fieldNames).toContain('method')
      expect(fieldNames).toContain('endpoint')
      expect(fieldNames).toContain('auth')
    })

    it('returns common fields for unknown type', () => {
      const fields = getFieldsForPageType('unknown')
      const fieldNames = fields.map(f => f.name)
      
      expect(fieldNames).toContain('title')
      expect(fieldNames).toContain('description')
    })

    it('merges common fields with page-specific fields', () => {
      const fields = getFieldsForPageType('api-reference')
      const fieldNames = fields.map(f => f.name)
      
      // Should have common fields
      expect(fieldNames).toContain('title')
      expect(fieldNames).toContain('description')
      
      // Should have page-specific fields
      expect(fieldNames).toContain('method')
      expect(fieldNames).toContain('endpoint')
    })
  })

  describe('COMMON_FIELDS', () => {
    it('includes title as required', () => {
      const titleField = COMMON_FIELDS.find(f => f.name === 'title')
      expect(titleField).toBeDefined()
      expect(titleField?.required).toBe(true)
    })

    it('includes description as optional', () => {
      const descField = COMMON_FIELDS.find(f => f.name === 'description')
      expect(descField).toBeDefined()
      expect(descField?.required).toBe(false)
    })
  })

  describe('ICON_NAMES', () => {
    it('is an array of strings', () => {
      expect(Array.isArray(ICON_NAMES)).toBe(true)
      expect(ICON_NAMES.length).toBeGreaterThan(0)
      for (const icon of ICON_NAMES) {
        expect(typeof icon).toBe('string')
      }
    })

    it('includes common icons', () => {
      expect(ICON_NAMES).toContain('rocket')
      expect(ICON_NAMES).toContain('code')
      expect(ICON_NAMES).toContain('book')
      expect(ICON_NAMES).toContain('settings')
    })
  })

  describe('Page type examples', () => {
    it('guide example has valid YAML frontmatter', () => {
      const guide = getPageType('guide')
      expect(guide?.example).toContain('---')
      expect(guide?.example).toContain('title:')
    })

    it('api-reference example includes method and endpoint', () => {
      const api = getPageType('api-reference')
      expect(api?.example).toContain('method:')
      expect(api?.example).toContain('endpoint:')
    })

    it('changelog example includes date', () => {
      const changelog = getPageType('changelog')
      expect(changelog?.example).toContain('date:')
    })
  })
})
