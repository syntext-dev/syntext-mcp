import { starterIndexMdx } from '../src/schemas/starter-index'
import { validateMdx } from '../src/schemas/validator'

describe('starterIndexMdx', () => {
  it('should match the backend starter for a plain title', () => {
    expect(starterIndexMdx({ title: 'Acme', description: 'Docs for Acme.' })).toBe(`---
title: Acme
description: Docs for Acme.
layout: wide
---

<Hero title="Acme" description="Docs for Acme.">
  <SearchBar mode="both" />

  [Get started](/quickstart) [Ask](/ask)
</Hero>

<SectionCards />

<LatestUpdates count={3} />
`)
  })

  it('should use the default description when none is given', () => {
    expect(starterIndexMdx({ title: 'Acme', description: '   ' })).toContain('description: Guides and answers, in one place.')
  })

  it('should quote YAML and escape attributes when the title needs it', () => {
    const mdx = starterIndexMdx({ title: 'Acme: "Pro"' })
    expect(mdx).toContain('title: "Acme: \\"Pro\\""')
    expect(mdx).toContain('<Hero title="Acme: &quot;Pro&quot;"')
  })

  it('should validate without errors or warnings', () => {
    const result = validateMdx(starterIndexMdx({ title: 'Acme' }))
    expect(result.errors).toEqual([])
    expect(result.warnings).toEqual([])
  })
})
