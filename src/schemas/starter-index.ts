/**
 * The starter index.mdx (the docs home) for doc engine v2: a short home
 * written with the home components, so the home is content its author can
 * edit, not a generated page.
 *
 * Copy of syntext-backend src/services/v2/starter-index.ts `starterIndexMdx`
 * (the CLI's `stx init` writes the same page); keep the three in step.
 */

const yamlString = (s: string): string =>
  /^[\w .,!?'()-]*$/.test(s) && !/^[\s'-]/.test(s) ? s : JSON.stringify(s)

const attr = (s: string): string => s.replace(/"/g, '&quot;')

export function starterIndexMdx(o: { title: string; description?: string }): string {
  const description = o.description?.trim() || 'Guides and answers, in one place.'
  return `---
title: ${yamlString(o.title)}
description: ${yamlString(description)}
layout: wide
---

<Hero title="${attr(o.title)}" description="${attr(description)}">
  <SearchBar mode="both" />

  [Get started](/quickstart) [Ask](/ask)
</Hero>

<SectionCards />

<LatestUpdates count={3} />
`
}
