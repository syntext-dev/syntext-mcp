/**
 * Syntext frontmatter schema definitions.
 * Defines valid frontmatter fields for different page types.
 */

export interface FrontmatterField {
  name: string
  type: string
  required: boolean
  description: string
  example?: string
  values?: string[]
}

export interface PageTypeSchema {
  type: string
  description: string
  fields: FrontmatterField[]
  example: string
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
    description: 'Landing/index page with hero section and feature cards.',
    fields: [
      { name: 'title', type: 'string', required: true, description: 'Page title (often brand name)' },
      { name: 'description', type: 'string', required: false, description: 'Hero subtitle or tagline' },
      { name: 'layout', type: 'string', required: false, description: 'Page layout', values: ['default', 'centered', 'full-width'] },
      { name: 'hideTitle', type: 'boolean', required: false, description: 'Hide the auto-generated title (use Hero instead)' },
    ],
    example: `---
title: Acme API Documentation
description: Build powerful integrations with our developer-friendly API.
layout: centered
hideTitle: true
---`,
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
