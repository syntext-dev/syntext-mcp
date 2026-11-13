import { countOpeningTags, validateMdx } from '../src/schemas/validator'
import { getFieldsForPageType, getPageType } from '../src/schemas/frontmatter'

const page = (body: string, fm = 'title: Home\ndescription: The home') => `---\n${fm}\n---\n\n${body}\n`

describe('Validator: self-closing components', () => {
  it.each(['SectionCards', 'QuickStart', 'ApiGroups', 'SdkList', 'CommandList', 'PopularPages', 'LatestUpdates', 'SupportCard'])(
    'should accept a self-closing <%s />',
    (name) => {
      const result = validateMdx(page(`<${name} />`))
      expect(result.errors).toEqual([])
      expect(result.warnings).toEqual([])
    },
  )

  it('should accept self-closing tags with attributes and JSX expressions', () => {
    const result = validateMdx(page('<LatestUpdates count={3} title="News" />\n\n<SearchBar size="lg" suggestions={["API keys", "Deploy"]} />'))
    expect(result.valid).toBe(true)
  })

  it('should accept a self-closing tag spread over several lines', () => {
    const result = validateMdx(page('<SectionCards\n  title="Docs"\n  limit={4}\n/>'))
    expect(result.valid).toBe(true)
  })

  it('should accept a self-closing Step inside a QuickStart', () => {
    const result = validateMdx(page('<QuickStart>\n  <Step title="Install" href="/install" />\n  <Step title="Deploy" href="/deploy" />\n</QuickStart>'))
    expect(result.errors).toEqual([])
  })

  it('should still flag an opened block that is never closed', () => {
    const result = validateMdx(page('<SectionCards>\n  <Card title="Guides" href="/guides" />\n'))
    expect(result.valid).toBe(false)
    expect(result.errors.map(e => e.message).join('\n')).toContain('Unclosed <SectionCards>')
  })

  it('should not count a quoted > or / inside an attribute', () => {
    expect(countOpeningTags('<SupportCard title="a > b" href="/x/">', 'SupportCard')).toBe(1)
    expect(countOpeningTags('<SupportCard title="a > b" />', 'SupportCard')).toBe(0)
  })

  it('should not count Card when looking at CardGroup and the reverse', () => {
    expect(countOpeningTags('<CardGroup cols={2}>', 'Card')).toBe(0)
    expect(countOpeningTags('<Card title="x" />', 'Card')).toBe(0)
  })

  it('should accept the full Hero home form', () => {
    const result = validateMdx(page('<Hero title="Acme" description="Docs" install="npm i acme">\n  <SearchBar mode="both" suggestions="popular" />\n\n  [Start](/start) [API](/api)\n</Hero>'))
    expect(result.errors).toEqual([])
    expect(result.warnings).toEqual([])
  })
})

describe('Validator: home frontmatter', () => {
  it('should warn that home frontmatter is deprecated', () => {
    const result = validateMdx(page('# Home', 'title: Home\ndescription: x\nhome:\n  hero:\n    title: Acme'))
    expect(result.valid).toBe(true)
    const warning = result.warnings.find(w => w.message.includes('home frontmatter key is deprecated'))
    expect(warning?.message).toContain('27 November 2026')
    expect(warning?.line).toBe(4)
  })

  it('should not warn for home: false', () => {
    const result = validateMdx(page('<SectionCards />', 'title: Home\ndescription: x\nhome: false'))
    expect(result.warnings).toEqual([])
  })
})

describe('Frontmatter: landing page', () => {
  it('should offer layout: wide', () => {
    const layout = getFieldsForPageType('landing').find(f => f.name === 'layout')
    expect(layout?.values).toEqual(['default', 'centered', 'full-width', 'landing', 'wide'])
    expect(layout?.description).toContain('wide (doc engine v2)')
  })

  it('should mark home as deprecated and document home: false', () => {
    const home = getFieldsForPageType('landing').find(f => f.name === 'home')
    expect(home?.deprecated).toBeDefined()
    expect(home?.type).toBe('object | false')
    expect(home?.description).toContain('home: false')
  })

  it('should use layout: wide in the landing example', () => {
    expect(getPageType('landing')?.example).toContain('layout: wide')
  })
})
