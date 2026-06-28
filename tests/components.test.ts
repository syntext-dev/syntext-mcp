import { describe, it, expect } from 'bun:test'
import {
  getAllComponents,
  getComponent,
  getComponentCategories,
  type ComponentDefinition,
} from '../src/schemas/components'

describe('Components Schema', () => {
  describe('getAllComponents', () => {
    it('returns an array of components', () => {
      const components = getAllComponents()
      expect(Array.isArray(components)).toBe(true)
      expect(components.length).toBeGreaterThan(0)
    })

    it('each component has required fields', () => {
      const components = getAllComponents()
      for (const comp of components) {
        expect(comp.name).toBeDefined()
        expect(typeof comp.name).toBe('string')
        expect(comp.description).toBeDefined()
        expect(typeof comp.description).toBe('string')
        expect(Array.isArray(comp.props)).toBe(true)
        expect(comp.syntax).toBeDefined()
        expect(comp.example).toBeDefined()
      }
    })

    it('includes essential components', () => {
      const components = getAllComponents()
      const names = components.map(c => c.name)
      
      expect(names).toContain('Card')
      expect(names).toContain('CardGroup')
      expect(names).toContain('CodeGroup')
      expect(names).toContain('Note')
      expect(names).toContain('Tip')
      expect(names).toContain('Warning')
      expect(names).toContain('ParamField')
      expect(names).toContain('Steps')
    })
  })

  describe('getComponent', () => {
    it('returns component by name', () => {
      const card = getComponent('Card')
      expect(card).toBeDefined()
      expect(card?.name).toBe('Card')
    })

    it('is case-insensitive', () => {
      const card1 = getComponent('Card')
      const card2 = getComponent('card')
      const card3 = getComponent('CARD')
      
      expect(card1).toBeDefined()
      expect(card2).toBeDefined()
      expect(card3).toBeDefined()
      expect(card1?.name).toBe(card2?.name)
      expect(card2?.name).toBe(card3?.name)
    })

    it('returns undefined for unknown component', () => {
      const unknown = getComponent('UnknownComponent')
      expect(unknown).toBeUndefined()
    })
  })

  describe('getComponentCategories', () => {
    it('returns categories with component names', () => {
      const categories = getComponentCategories()
      
      expect(categories.layout).toBeDefined()
      expect(categories.code).toBeDefined()
      expect(categories.callouts).toBeDefined()
      expect(categories.interactive).toBeDefined()
      expect(categories.api).toBeDefined()
      expect(categories.media).toBeDefined()
      expect(categories.steps).toBeDefined()
    })

    it('layout category includes Card and CardGroup', () => {
      const categories = getComponentCategories()
      expect(categories.layout).toContain('Card')
      expect(categories.layout).toContain('CardGroup')
    })

    it('callouts category includes all callout types', () => {
      const categories = getComponentCategories()
      expect(categories.callouts).toContain('Note')
      expect(categories.callouts).toContain('Tip')
      expect(categories.callouts).toContain('Warning')
      expect(categories.callouts).toContain('Danger')
    })
  })

  describe('Component props', () => {
    it('Card has title prop marked as required', () => {
      const card = getComponent('Card')
      const titleProp = card?.props.find(p => p.name === 'title')
      
      expect(titleProp).toBeDefined()
      expect(titleProp?.required).toBe(true)
    })

    it('Card has href prop marked as optional', () => {
      const card = getComponent('Card')
      const hrefProp = card?.props.find(p => p.name === 'href')
      
      expect(hrefProp).toBeDefined()
      expect(hrefProp?.required).toBe(false)
    })

    it('ParamField has all necessary props', () => {
      const pf = getComponent('ParamField')
      const propNames = pf?.props.map(p => p.name)
      
      expect(propNames).toContain('name')
      expect(propNames).toContain('type')
      expect(propNames).toContain('required')
      expect(propNames).toContain('default')
    })
  })

  describe('Component examples', () => {
    it('Card example contains valid JSX', () => {
      const card = getComponent('Card')
      expect(card?.example).toContain('<Card')
      expect(card?.example).toContain('</Card>')
    })

    it('CodeGroup example contains multiple code blocks', () => {
      const cg = getComponent('CodeGroup')
      const codeBlockCount = (cg?.example.match(/```/g) || []).length
      expect(codeBlockCount).toBeGreaterThanOrEqual(4) // At least 2 code blocks (open + close each)
    })
  })
})
