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
    name: 'theme',
    type: 'string',
    required: false,
    description:
      'Theme preset name. A theme is data: the preset supplies the full token set (colors, typography, fonts, radii) for both light and dark mode. Unknown names fall back to "default" with a build warning.',
    example: 'default',
  },
  {
    name: 'themeOverrides',
    type: 'object',
    required: false,
    description:
      'Per-token overrides applied on top of the preset. Change one value without restating the theme. Unknown token names are reported as build warnings and ignored.',
    children: [
      {
        name: 'fonts',
        type: 'object',
        required: false,
        description: 'Font family per role. A bare string is shorthand for the family name.',
        example: { display: 'Bricolage Grotesque', body: 'Geist Mono', mono: 'Geist Mono' },
      },
      {
        name: 'colors',
        type: 'object',
        required: false,
        description:
          'Per-token colors, split by mode. Token names are semantic — e.g. accent, bg-page, content-primary, border, bg-code, syntax-keyword, method-post.',
        example: { light: { accent: '#077155' }, dark: { accent: '#15a07b' } },
      },
      {
        name: 'typography',
        type: 'object',
        required: false,
        description:
          'Per-style type overrides, all values in px. Style names: display-h1, heading-h2..h4, body-lg/md/sm, label-md/sm, strong-sm, code-md/sm, caption, eyebrow, nav-item, nav-section, mono-label.',
        example: { 'display-h1': { size: 34, lineHeight: 42, letterSpacing: -1.5 } },
      },
      {
        name: 'apiTypography',
        type: 'object',
        required: false,
        description:
          'Overrides for the denser scale API reference pages run, scoped to that surface only. Same text-style names as typography; a partial patch inherits the rest from the base scale.',
        example: { 'display-h1': { size: 32, lineHeight: 38 } },
      },
      {
        name: 'radius',
        type: 'object',
        required: false,
        description: 'Corner radii in px (sm, md, lg, xl, full)',
        example: { sm: 8, md: 12 },
      },
    ],
  },
  {
    name: 'colors',
    type: 'object',
    required: false,
    description:
      'Legacy color shorthand. Still honoured, and applied after themeOverrides so an existing site never changes appearance because a preset was introduced. Prefer themeOverrides.colors for new configs.',
    children: [
      { name: 'primary', type: 'string', required: false, description: 'Primary brand color (hex). Drives the whole accent ramp.', example: '#6366f1' },
      { name: 'accent', type: 'string', required: false, description: 'Maps to the accent-strong token', example: '#8b5cf6' },
      { name: 'background', type: 'string', required: false, description: 'Maps to the bg-page token' },
    ],
  },
  {
    name: 'topbarCta',
    type: 'object',
    required: false,
    description:
      'Call-to-action button in the top bar, at the trailing edge beside the theme toggle. Omit it and no button renders.',
    example: { label: 'Get API keys', url: 'https://dashboard.example.com/keys' },
    children: [
      { name: 'label', type: 'string', required: true, description: 'Button text.', example: 'Get API keys' },
      { name: 'url', type: 'string', required: true, description: 'Destination URL.', example: 'https://dashboard.example.com/keys' },
    ],
  },
  {
    name: 'features',
    type: 'object',
    required: false,
    description:
      'Structural feature flags — what the site CONTAINS, as opposed to how it is painted. A design that omits a control cannot be expressed with theme colors alone. Every default reproduces the behaviour that shipped before these flags existed, so a site is unaffected until it opts out. Unknown flags and wrong value types are reported as build warnings and ignored.',
    children: [
      { name: 'playground', type: 'boolean', required: false, description: 'The "Try it" request playground on API reference pages. Default true.', example: true },
      { name: 'copyPageActions', type: 'boolean | { guides?: boolean; api?: boolean }', required: false, description: 'The "Copy page" control and its open-in-AI menu. Independent of aiAssistant — you can drop this menu and keep the assistant. Accepts a boolean for both surfaces, or an object to differ between guide pages and API reference pages. Default true.', example: { guides: true, api: false } },
      { name: 'sidebarMethodBadges', type: 'boolean', required: false, description: 'HTTP method chips (GET/POST/...) beside API nav items in the sidebar. Default true.', example: true },
      { name: 'codeLanguageSelector', type: '"dropdown" | "tabs"', required: false, description: 'How the request panel offers its languages (cURL / Node / Python / Go) — a compact dropdown or a horizontal tab row. Default "dropdown".', example: 'dropdown' },
      { name: 'codeLanguageTabs', type: 'boolean', required: false, description: 'DEPRECATED and a no-op — it never controlled anything, because the request panel only ever had a dropdown. Use codeLanguageSelector instead.', example: true },
      { name: 'aiAssistant', type: 'boolean', required: false, description: 'Assistant entry points — "Ask Assistant" and agent mode. Default true.', example: true },
      { name: 'parameterStyle', type: '"table" | "rows"', required: false, description: 'How API parameters are laid out: a status/description table, or stacked rows. Default "table".', example: 'table' },
      { name: 'endpointBarAction', type: '"tryIt" | "copy" | "none"', required: false, description: 'Trailing control in the endpoint bar beside the method and path. Setting playground false implicitly drops a "tryIt" action, since the button would have nothing to open. Default "tryIt".', example: 'tryIt' },
      { name: 'codeBlockStyle', type: '"pill" | "panel"', required: false, description: 'Code block chrome: "pill" floats a rounded header over the block, "panel" joins a bordered header rail to it. Default "pill".', example: 'pill' },
      { name: 'navStyle', type: '"split" | "single"', required: false, description: 'Top bar rows: "split" keeps the brand and actions on one line with the section tabs on a second, "single" pulls the tabs up beside the brand so the whole header is one row. Default "split".', example: 'split' },
      { name: 'sidebarStyle', type: '"collapsible" | "flat"', required: false, description: 'API sidebar groups: "collapsible" gives each group a disclosure toggle, "flat" shows every item permanently under a plain label. Default "collapsible".', example: 'collapsible' },
      { name: 'panelLabels', type: '"inline" | "above"', required: false, description: 'Where the request/response captions sit: "inline" keeps them in the panel header beside the language selector, "above" lifts them out as a caption over the panel. Default "inline".', example: 'inline' },
      { name: 'copyControlStyle', type: '"icon" | "label"', required: false, description: 'The panel copy action: "icon" is a square glyph button, "label" is the word "Copy" (becoming "Copied" on success). Default "icon".', example: 'icon' },
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
  theme: 'default',
  themeOverrides: {
    fonts: { display: 'Bricolage Grotesque', body: 'Inter', mono: 'JetBrains Mono' },
    colors: {
      light: { accent: '#6366f1' },
      dark: { accent: '#818cf8' },
    },
    radius: { sm: 6, md: 10 },
  },
  features: {
    playground: true,
    parameterStyle: 'table',
    endpointBarAction: 'tryIt',
    codeLanguageSelector: 'dropdown',
    codeBlockStyle: 'pill',
    sidebarStyle: 'collapsible',
    navStyle: 'split',
    panelLabels: 'inline',
    copyControlStyle: 'icon',
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
