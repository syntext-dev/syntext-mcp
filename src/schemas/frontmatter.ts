/**
 * Syntext frontmatter schema definitions.
 * Defines valid frontmatter fields for different page types.
 */

import { starterIndexMdx } from './starter-index'

export interface FrontmatterField {
  name: string
  type: string
  required: boolean
  description: string
  example?: string
  values?: string[]
  /** Set when the field is deprecated: what to use instead. */
  deprecated?: string
}

export interface PageTypeSchema {
  type: string
  description: string
  fields: FrontmatterField[]
  example: string
  /** The whole starter index.mdx (create_page landing), shown under the example. */
  starter?: string
}

export const PAGE_TYPES: PageTypeSchema[] = [
  {
    type: 'guide',
    description: 'Standard documentation page for guides, tutorials, and conceptual content.',
    fields: [
      { name: 'title', type: 'string', required: true, description: 'Page title displayed in header and navigation' },
      { name: 'description', type: 'string', required: false, description: 'Short description for SEO and page summaries' },
      { name: 'icon', type: 'string', required: false, description: 'Icon name for navigation (e.g., "book", "rocket", "code")' },
      { name: 'sidebarTitle', type: 'string', required: false, description: 'Shorter title for sidebar navigation (defaults to title)' },
    ],
    example: `---
title: Getting Started
description: Learn how to set up and configure Acme API in your project.
icon: rocket
---`,
  },
  {
    type: 'api-reference',
    description: 'API endpoint documentation page with method, path, and parameters.',
    fields: [
      { name: 'title', type: 'string', required: true, description: 'Endpoint name (e.g., "Create User")' },
      { name: 'description', type: 'string', required: false, description: 'Brief description of what the endpoint does' },
      { name: 'method', type: 'string', required: true, description: 'HTTP method', values: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] },
      { name: 'endpoint', type: 'string', required: true, description: 'API path (e.g., "/v1/users/:id")' },
      { name: 'auth', type: 'string', required: false, description: 'Authentication requirement', values: ['required', 'optional', 'none'] },
    ],
    example: `---
title: Create User
description: Create a new user in your organization.
method: POST
endpoint: /v1/users
auth: required
---`,
  },
  {
    type: 'changelog',
    description: 'Changelog entry page for documenting releases and updates.',
    fields: [
      { name: 'title', type: 'string', required: true, description: 'Version or release name' },
      { name: 'date', type: 'string', required: true, description: 'Release date in YYYY-MM-DD format' },
      { name: 'version', type: 'string', required: false, description: 'Semantic version number' },
      { name: 'type', type: 'string', required: false, description: 'Release type', values: ['major', 'minor', 'patch', 'breaking'] },
    ],
    example: `---
title: v2.0.0 - Major Release
date: 2024-03-15
version: 2.0.0
type: major
---`,
  },
  {
    type: 'landing',
    description: "The home page (index.mdx). On doc engine v2 the home is this page's own content, written with the home components (<Hero title>, <SearchBar>, <SectionCards>, <QuickStart>, <LatestUpdates>…), usually with layout: wide. The generated home (home frontmatter, or an index with no home components) is deprecated and stops on 1 December 2026.",
    fields: [
      { name: 'title', type: 'string', required: true, description: 'Page title (often brand name)' },
      { name: 'description', type: 'string', required: false, description: 'Hero subtitle or tagline' },
      { name: 'layout', type: 'string', required: false, description: 'Page layout. default: sidebar + content + on-this-page column. centered: no sidebars, centred content. full-width: single full-width column. landing: keeps the left sidebar, drops the on-this-page column and centres a wider content column — a homepage inside the docs navigation. wide (doc engine v2): the header, the body across the page, then the footer; no sidebar, TOC or pager. Home components run full-bleed, other content sits in a centred column. Use it for a home built from the home components; v1 treats it as default.', values: ['default', 'centered', 'full-width', 'landing', 'wide'] },
      { name: 'hideTitle', type: 'boolean', required: false, description: 'Hide the auto-generated title (use Hero instead). Not needed when the body opens with <Hero title>, which replaces the page head.' },
      { name: 'home', type: 'object | false', required: false, description: 'Deprecated: the generated docs home built from blocks ({ hero, blocks }); it stops on 1 December 2026. home: false opts the index in to rendering its own content (the default once the body uses a home component). Write the home with the home components in the page body instead, or convert it in the dashboard (Appearance › Convert home to content).', deprecated: 'the home components in the index page body' },
    ],
    example: `---
title: Acme API Documentation
description: Build powerful integrations with our developer-friendly API.
layout: wide
---`,
    starter: starterIndexMdx({ title: 'Acme API Documentation', description: 'Build powerful integrations with our developer-friendly API.' }),
  },
  {
    type: 'sdk',
    description: 'SDK documentation page for language-specific libraries.',
    fields: [
      { name: 'title', type: 'string', required: true, description: 'SDK name (e.g., "Python SDK")' },
      { name: 'description', type: 'string', required: false, description: 'SDK description' },
      { name: 'language', type: 'string', required: false, description: 'Programming language', values: ['typescript', 'javascript', 'python', 'go', 'ruby', 'java', 'csharp', 'php'] },
      { name: 'package', type: 'string', required: false, description: 'Package name (e.g., "acme-sdk" or "@acme/sdk")' },
    ],
    example: `---
title: Python SDK
description: Official Python client library for Acme API.
language: python
package: acme-sdk
---`,
  },
]

/**
 * Common frontmatter fields available on all page types
 */
export const COMMON_FIELDS: FrontmatterField[] = [
  { name: 'title', type: 'string', required: true, description: 'Page title' },
  { name: 'description', type: 'string', required: false, description: 'Page description for SEO' },
  { name: 'icon', type: 'string', required: false, description: 'Navigation icon' },
  { name: 'sidebarTitle', type: 'string', required: false, description: 'Shorter navigation title' },
  { name: 'hidden', type: 'boolean', required: false, description: 'Hide from navigation (still accessible via URL)' },
  { name: 'section', type: 'string', required: false, description: 'Section the page belongs to — which header tab it sits under, which sidebar it renders, and how far prev/next pagination can reach. Use a name from `tabs` verbatim. Resolution order: path prefix, then this field, then a tab whose URL prefix matches the slug, then navigation[].tab — so on a site with tabs a URL match can override this field.' },
  { name: 'category', type: 'string', required: false, description: 'Coarse alias for `section`, handy when migrating. api/reference give API Reference, sdk/client/library give SDKs, changelog/releases give Changelog, guide/tutorial give Guides. Any other value is ignored, and `section` wins when both are set.' },
]

/**
 * Available icon names
 */
export const ICON_NAMES = [
  'rocket', 'code', 'book', 'terminal', 'settings', 'key', 'lock', 'shield',
  'globe', 'database', 'layers', 'box', 'play', 'search', 'link', 'cpu',
  'monitor', 'cloud', 'fingerprint', 'eye', 'video', 'bot', 'wallet', 'send',
  'credit-card', 'arrow-right', 'check', 'star', 'users', 'zap',
]

/**
 * Get all page type schemas
 */
export function getAllPageTypes(): PageTypeSchema[] {
  return PAGE_TYPES
}

/**
 * Get a specific page type schema
 */
export function getPageType(type: string): PageTypeSchema | undefined {
  return PAGE_TYPES.find(p => p.type === type)
}

/**
 * Get frontmatter fields for a page type (including common fields)
 */
export function getFieldsForPageType(type: string): FrontmatterField[] {
  const pageType = getPageType(type)
  if (!pageType) return COMMON_FIELDS
  
  // Merge page-specific fields with common fields (page-specific take precedence)
  const fieldMap = new Map<string, FrontmatterField>()
  for (const field of COMMON_FIELDS) {
    fieldMap.set(field.name, field)
  }
  for (const field of pageType.fields) {
    fieldMap.set(field.name, field)
  }
  
  return Array.from(fieldMap.values())
}
