import { getAllComponents, getComponent, getComponentCategories } from '../src/schemas/components'
import { HOME_COMPONENTS, HOME_COMPONENT_NAMES } from '../src/schemas/components-home'

const NEW_HOME = ['SectionCards', 'QuickStart', 'ApiGroups', 'SdkList', 'CommandList', 'PopularPages', 'LatestUpdates', 'SupportCard']

const propNames = (name: string) => getComponent(name)?.props.map(p => p.name) ?? []

describe('Home components', () => {
  it('should define all eight home blocks', () => {
    expect(HOME_COMPONENT_NAMES).toEqual(NEW_HOME)
  })

  it('should include the home blocks in getAllComponents', () => {
    const names = getAllComponents().map(c => c.name)
    for (const name of NEW_HOME) expect(names).toContain(name)
  })

  it('should keep component names unique', () => {
    const names = getAllComponents().map(c => c.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('should give every home block a v2-only note and a syntax using its tag', () => {
    for (const c of HOME_COMPONENTS) {
      expect(c.notes).toContain('Doc engine v2 only')
      expect(c.syntax).toContain(`<${c.name}`)
      expect(c.example).toContain(`<${c.name}`)
      for (const p of c.props) expect(p.required).toBe(false)
    }
  })

  it('should show self-closing syntax for the blocks that fill themselves', () => {
    for (const name of ['SectionCards', 'QuickStart', 'ApiGroups', 'SdkList', 'CommandList', 'PopularPages']) {
      expect(getComponent(name)?.syntax).toBe(`<${name} />`)
    }
  })

  it.each([
    ['SectionCards', ['title', 'limit']],
    ['QuickStart', ['title', 'limit']],
    ['ApiGroups', ['title', 'limit']],
    ['SdkList', ['title', 'href', 'limit']],
    ['CommandList', ['title', 'limit']],
    ['PopularPages', ['title', 'limit']],
    ['LatestUpdates', ['count', 'href', 'title']],
    ['SupportCard', ['title', 'cta', 'href']],
  ])('should give %s the props %j', (name, props) => {
    expect(propNames(name)).toEqual(props)
  })

  it('should carry the backend defaults', () => {
    const def = (c: string, p: string) => getComponent(c)?.props.find(x => x.name === p)?.default
    expect(def('SectionCards', 'limit')).toBe('8')
    expect(def('SectionCards', 'title')).toBe('Documentation')
    expect(def('QuickStart', 'limit')).toBe('3')
    expect(def('ApiGroups', 'limit')).toBe('9')
    expect(def('LatestUpdates', 'count')).toBe('4')
    expect(def('SupportCard', 'cta')).toBe('Contact support')
  })

  it('should give Hero the home props when used with title', () => {
    expect(propNames('Hero')).toEqual(expect.arrayContaining(['title', 'description', 'install', 'eyebrow', 'variant']))
    expect(getComponent('Hero')?.description).toContain('<SearchBar>')
  })

  it('should define SearchBar with size, mode and suggestions', () => {
    const sb = getComponent('SearchBar')
    expect(sb).toBeDefined()
    expect(propNames('SearchBar')).toEqual(['placeholder', 'kbd', 'size', 'mode', 'suggestions'])
    expect(sb?.props.find(p => p.name === 'mode')?.type).toBe('"search" | "ask" | "both"')
    expect(sb?.props.find(p => p.name === 'mode')?.default).toBe('search')
    expect(sb?.props.find(p => p.name === 'suggestions')?.description).toContain('popular')
  })

  it('should let a Step link to a page inside QuickStart', () => {
    expect(propNames('Step')).toContain('href')
  })

  it('should list the home components under the home category', () => {
    const categories = getComponentCategories()
    expect(categories.home).toEqual(['Hero', 'SearchBar', ...NEW_HOME])
    expect(categories.navigation).toContain('SearchBar')
    for (const name of categories.home) expect(getComponent(name)).toBeDefined()
  })
})
