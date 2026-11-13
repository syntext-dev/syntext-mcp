/**
 * Home components (doc engine v2). The docs home is the index.mdx page's own
 * content: these are the pieces of the old generated home as components any
 * page can use. Each is drawn in the preset's own home style. A block used with
 * no content of its own fills itself from the site; with no data either, it
 * draws nothing and the build warns. v1 sites do not render them.
 *
 * Mirrors syntext-backend src/modules/catalogue/components-home.ts.
 */

import type { ComponentDefinition, PropDefinition } from './components'

const V2_ONLY = 'Doc engine v2 only; v1 sites render nothing for it. Use it empty and self-closing (<Name />) to fill it from the site.'

const title = (fallback: string): PropDefinition => ({
  name: 'title',
  type: 'string',
  required: false,
  description: 'Heading of the block, where the preset draws one.',
  default: fallback,
})

const limit = (n: number, what: string): PropDefinition => ({
  name: 'limit',
  type: 'number',
  required: false,
  description: `Most ${what} shown.`,
  default: String(n),
})

export const HOME_COMPONENTS: ComponentDefinition[] = [
  {
    name: 'SectionCards',
    description: "Cards for the site's sections, in the preset's home style. With no children, one card per header section (one per sidebar group on a one-section site), listing its first pages. With <Card title href> children, those cards; a link list inside a card becomes its items.",
    props: [title('Documentation'), limit(8, 'cards')],
    syntax: '<SectionCards />',
    example: `<SectionCards title="Explore the docs">
  <Card title="Guides" href="/guides">
    - [Quickstart](/quickstart)
    - [Authentication](/authentication)
  </Card>
  <Card title="API reference" href="/api-reference" />
</SectionCards>`,
    notes: V2_ONLY,
  },
  {
    name: 'QuickStart',
    description: "Numbered first steps, in the preset's home style. With no children, the first guide pages of the first section. With <Step title href> children, those steps. Presets whose home has no quickstart draw it as Steps.",
    props: [title('Start here'), limit(3, 'steps')],
    syntax: '<QuickStart />',
    example: `<QuickStart>
  <Step title="Create an API key" href="/authentication" />
  <Step title="Install the SDK" href="/sdks/typescript" />
  <Step title="Make your first request" href="/quickstart" />
</QuickStart>`,
    notes: V2_ONLY,
  },
  {
    name: 'ApiGroups',
    description: "The API reference's endpoint groups as cards. With no children, one card per endpoint group of the API reference with its first endpoints. With <Card title href> children, those. Atlas draws product cards; the other presets their section cards.",
    props: [title('Browse by product'), limit(9, 'groups')],
    syntax: '<ApiGroups />',
    example: '<ApiGroups title="Browse the API" limit={6} />',
    notes: V2_ONLY,
  },
  {
    name: 'SdkList',
    description: "The site's SDKs as one section card. With no children, the pages of an \"SDKs\" section. With <Card title href> children or a link list, those.",
    props: [
      title('SDKs'),
      { name: 'href', type: 'string', required: false, description: 'Where the card title links. Default the first SDK.' },
      limit(6, 'SDKs'),
    ],
    syntax: '<SdkList />',
    example: `<SdkList href="/sdks">
  - [TypeScript](/sdks/typescript)
  - [Python](/sdks/python)
  - [Go](/sdks/go)
</SdkList>`,
    notes: V2_ONLY,
  },
  {
    name: 'CommandList',
    description: 'CLI commands with one-line descriptions. With no content, the pages of a "CLI" section. Otherwise a two-column table (command, description) or a list of `command` — description lines. Console draws its quick links; the other presets a table.',
    props: [title('quick links'), limit(6, 'commands')],
    syntax: '<CommandList />',
    example: `<CommandList>
  - \`acme login\` — Sign in to your account
  - \`acme deploy\` — Deploy the current project
</CommandList>`,
    notes: V2_ONLY,
  },
  {
    name: 'PopularPages',
    description: 'The most read pages. With no content, the most viewed pages of the last 30 days (page analytics), else the first page of each section. Otherwise a link list.',
    props: [title('Popular right now'), limit(5, 'pages')],
    syntax: '<PopularPages />',
    example: '<PopularPages limit={4} />',
    notes: V2_ONLY,
  },
  {
    name: 'LatestUpdates',
    description: 'The newest changelog entries: the latest <Update> entries of the changelog page (date, version, kind and title), each linking to its entry. Takes no children. With no changelog page it draws nothing and the build warns.',
    props: [
      { name: 'count', type: 'number', required: false, description: 'Entries shown (some presets show at most 3).', default: '4' },
      { name: 'href', type: 'string', required: false, description: 'Where the heading links. Default the changelog page.' },
      title('Changelog'),
    ],
    syntax: '<LatestUpdates count={3} />',
    example: '<LatestUpdates count={3} />',
    notes: 'Doc engine v2 only; v1 sites render nothing for it.',
  },
  {
    name: 'SupportCard',
    description: 'A "Need a hand?" panel with a contact button: a heading, a line of text and a call-to-action button, in the preset\'s home style (a card in presets whose home has no support panel).',
    props: [
      { name: 'title', type: 'string', required: false, description: 'Heading.', default: 'Need a hand?' },
      { name: 'cta', type: 'string', required: false, description: 'Button text.', default: 'Contact support' },
      { name: 'href', type: 'string', required: false, description: 'Where the button goes, e.g. mailto:support@acme.dev.' },
    ],
    syntax: '<SupportCard title="Need a hand?" cta="Contact support" href="mailto:support@example.com">\n  We reply within one working day.\n</SupportCard>',
    example: '<SupportCard title="Need a hand?" cta="Contact support" href="mailto:support@example.com">\n  We reply within one working day.\n</SupportCard>',
    notes: 'Doc engine v2 only; v1 sites render nothing for it.',
  },
]

export const HOME_COMPONENT_NAMES: string[] = HOME_COMPONENTS.map(c => c.name)
