/**
 * Syntext configuration schema (syntext.config.json).
 * Defines all configuration options for a Syntext documentation project.
 */

export interface ConfigField {
  name: string
  type: string
  required: boolean
  description: string
  example?: unknown
  children?: ConfigField[]
}

export const CONFIG_SCHEMA: ConfigField[] = [
  {
    name: 'name',
    type: 'string',
    required: true,
    description: 'Project name displayed in the header and browser title',
    example: 'Acme API',
  },
  {
    name: 'logo',
    type: 'string',
    required: false,
    description: 'Path to logo image (relative to docs folder or URL)',
    example: '/logo.svg',
  },
  {
    name: 'favicon',
    type: 'string',
    required: false,
    description: 'Path to favicon (relative to docs folder or URL)',
    example: '/favicon.ico',
  },
  {
    name: 'colors',
    type: 'object',
    required: false,
    description: 'Theme color configuration',
    children: [
      { name: 'primary', type: 'string', required: false, description: 'Primary brand color (hex)', example: '#6366f1' },
      { name: 'accent', type: 'string', required: false, description: 'Accent color for highlights', example: '#8b5cf6' },
    ],
  },
  {
    name: 'navigation',
    type: 'NavigationItem[]',
    required: true,
    description: 'Sidebar navigation structure. Array of groups with pages.',
    example: [
      {
        group: 'Getting Started',
        pages: ['index', 'quickstart', 'authentication'],
      },
      {
        group: 'API Reference',
        pages: ['api-reference/overview', 'api-reference/users', 'api-reference/billing'],
      },
    ],
  },
  {
    name: 'tabs',
    type: 'Tab[]',
    required: false,
    description: 'Top-level navigation tabs (e.g., Docs, API Reference, SDKs)',
    example: [
      { name: 'Docs', url: '/', icon: 'book' },
      { name: 'API Reference', url: '/api-reference', icon: 'code' },
      { name: 'SDKs', url: '/sdks', icon: 'box' },
    ],
  },
  {
    name: 'topbarLinks',
    type: 'Link[]',
    required: false,
    description: 'Links in the header (right side)',
    example: [
      { label: 'Dashboard', url: 'https://dashboard.acme.com' },
    ],
  },
  {
    name: 'social',
    type: 'object',
    required: false,
    description: 'Social media links',
    children: [
      { name: 'github', type: 'string', required: false, description: 'GitHub repository URL' },
      { name: 'twitter', type: 'string', required: false, description: 'Twitter/X profile URL' },
      { name: 'discord', type: 'string', required: false, description: 'Discord server invite URL' },
      { name: 'linkedin', type: 'string', required: false, description: 'LinkedIn page URL' },
    ],
  },
  {
    name: 'api',
    type: 'object',
    required: false,
    description: 'API reference configuration',
    children: [
      { name: 'baseUrl', type: 'string', required: false, description: 'Base URL for API endpoints', example: 'https://api.acme.com' },
      { name: 'auth', type: 'object', required: false, description: 'Authentication configuration' },
    ],
  },
  {
    name: 'openapi',
    type: 'string | string[]',
    required: false,
    description: 'Path to OpenAPI spec file(s) for auto-generating API reference',
    example: './openapi.json',
  },
  {
    name: 'feedback',
    type: 'object',
    required: false,
    description: 'Enable page feedback widget',
    children: [
      { name: 'enabled', type: 'boolean', required: false, description: 'Show thumbs up/down on pages' },
    ],
  },
  {
    name: 'analytics',
    type: 'object',
    required: false,
    description: 'Analytics configuration',
    children: [
      { name: 'gtm', type: 'string', required: false, description: 'Google Tag Manager ID' },
      { name: 'plausible', type: 'string', required: false, description: 'Plausible domain' },
    ],
  },
  {
    name: 'seo',
    type: 'object',
    required: false,
    description: 'SEO configuration',
    children: [
      { name: 'indexing', type: 'boolean', required: false, description: 'Allow search engine indexing' },
      { name: 'sitemap', type: 'boolean', required: false, description: 'Generate sitemap.xml' },
    ],
  },
]

/**
 * Full example config
 */
export const EXAMPLE_CONFIG = {
  name: 'Acme API',
  logo: '/logo.svg',
  favicon: '/favicon.ico',
  colors: {
    primary: '#6366f1',
  },
  navigation: [
    {
      group: 'Getting Started',
      pages: ['index', 'quickstart', 'authentication'],
    },
    {
      group: 'Guides',
      pages: ['guides/webhooks', 'guides/pagination', 'guides/errors'],
    },
    {
      group: 'API Reference',
      pages: [
        'api-reference/overview',
        {
          group: 'Users',
          pages: [
            'api-reference/users/list',
            'api-reference/users/create',
            'api-reference/users/get',
            'api-reference/users/update',
            'api-reference/users/delete',
          ],
        },
      ],
    },
  ],
  tabs: [
    { name: 'Docs', url: '/', icon: 'book' },
    { name: 'API Reference', url: '/api-reference', icon: 'code' },
  ],
  social: {
    github: 'https://github.com/acme/acme-api',
    twitter: 'https://twitter.com/acme',
  },
  openapi: './openapi.json',
}

/**
 * Minimal config for new projects
 */
export const MINIMAL_CONFIG = {
  name: 'My Docs',
  navigation: [
    {
      group: 'Getting Started',
      pages: ['index', 'quickstart'],
    },
  ],
}

/**
 * Get all config fields
 */
export function getConfigSchema(): ConfigField[] {
  return CONFIG_SCHEMA
}

/**
 * Get example config
 */
export function getExampleConfig(): typeof EXAMPLE_CONFIG {
  return EXAMPLE_CONFIG
}

/**
 * Get minimal config
 */
export function getMinimalConfig(): typeof MINIMAL_CONFIG {
  return MINIMAL_CONFIG
}
