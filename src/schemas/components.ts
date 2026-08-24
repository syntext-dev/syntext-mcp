/**
 * Syntext MDX component definitions with syntax and examples.
 * This is the core knowledge that helps AI assistants generate valid Syntext docs.
 */

export interface ComponentDefinition {
  name: string
  description: string
  props: PropDefinition[]
  syntax: string
  example: string
  notes?: string
}

export interface PropDefinition {
  name: string
  type: string
  required: boolean
  description: string
  default?: string
}

export const COMPONENTS: ComponentDefinition[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // LAYOUT COMPONENTS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Card',
    description: 'A clickable card with optional icon, title, and description. Used for navigation or feature highlights.',
    props: [
      { name: 'title', type: 'string', required: true, description: 'Card heading text' },
      { name: 'icon', type: 'string', required: false, description: 'Icon name (e.g., "rocket", "code", "book") or emoji' },
      { name: 'href', type: 'string', required: false, description: 'Link destination. Makes entire card clickable' },
      { name: 'cta', type: 'string', required: false, description: 'Call-to-action text with a trailing arrow, pinned to the bottom of the card so every card in a row aligns.' },
      { name: 'methods', type: 'string', required: false, description: 'Comma-separated HTTP methods rendered as coloured chips at the foot of the card, e.g. "POST,GET". Use on API resource listings.' },
    ],
    syntax: '<Card title="Title" icon="rocket" href="/path">\n  Description text here\n</Card>',
    example: `<Card title="Getting Started" icon="rocket" href="/quickstart">
  Learn how to set up Syntext in under 5 minutes.
</Card>`,
  },
  {
    name: 'CardGroup',
    description: 'Grid container for Card components. Automatically arranges cards in responsive columns.',
    props: [
      { name: 'cols', type: '2 | 3 | 4', required: false, description: 'Number of columns', default: '2' },
    ],
    syntax: '<CardGroup cols={2}>\n  <Card ... />\n  <Card ... />\n</CardGroup>',
    example: `<CardGroup cols={3}>
  <Card title="Quick Start" icon="rocket" href="/quickstart">
    Get up and running in 5 minutes.
  </Card>
  <Card title="API Reference" icon="code" href="/api-reference">
    Explore our REST API endpoints.
  </Card>
  <Card title="SDKs" icon="box" href="/sdks">
    Official client libraries for your language.
  </Card>
</CardGroup>`,
  },
  {
    name: 'Playground',
    description:
      'An interactive API console the reader can send real requests from. Requests go directly from the browser to the target API — nothing is proxied — so the API must allow CORS from the doc site origin. A Playground with neither servers nor base-url has nothing to call and renders nothing.',
    props: [
      { name: 'method', type: 'string', required: false, description: 'HTTP method, also selecting the method pill colour. Default GET.' },
      { name: 'path', type: 'string', required: false, description: 'Request path, shown in an editable field. Default /.' },
      { name: 'servers', type: 'string', required: false, description: 'JSON array of { name, url } environments, rendered as the environment toggle.' },
      { name: 'base-url', type: 'string', required: false, description: 'Shorthand for a single unnamed environment. Ignored when servers is set.' },
      { name: 'auth-label', type: 'string', required: false, description: 'Placeholder for the credential field. Default Authorization.' },
      { name: 'key-label', type: 'string', required: false, description: 'Text of the chip beside the credential field, e.g. "Sandbox key".' },
      { name: 'body', type: 'string', required: false, description: 'Initial request body. Only rendered for methods that take one; the body tab then opens by default.' },
    ],
    syntax: '<Playground method="POST" path="/v1/transfers" servers=\'[{"name":"Sandbox","url":"https://sandbox.api.example.com"}]\' />',
    example: `<Playground
  method="POST"
  path="/v1/transfers"
  servers='[{"name":"Sandbox","url":"https://sandbox.api.example.com"},
            {"name":"Production","url":"https://api.example.com"}]'
  key-label="Sandbox key"
  body='{"amount": "100.00", "currency": "USDC"}'
/>`,
  },
  {
    name: 'Hero',
    description: 'Large hero section for landing pages. Typically used at the top of index.mdx.',
    props: [
      { name: 'title', type: 'string', required: false, description: 'Hero heading (or use h1 inside)' },
      { name: 'description', type: 'string', required: false, description: 'Subtitle text' },
      { name: 'variant', type: '"banner" | "card"', required: false, description: 'Layout. "banner" (default) is full-width; "card" is an inset panel with the copy on the left and a code fence beside it.' },
      { name: 'eyebrow', type: 'string', required: false, description: 'Small uppercase label above the heading.' },
    ],
    syntax: '<Hero>\n  # Main Heading\n  Subtitle description here\n</Hero>',
    example: `<Hero>
  # Welcome to Acme API
  Build powerful integrations with our developer-friendly API.
</Hero>`,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CODE COMPONENTS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'CodeGroup',
    description: 'Tabbed code blocks for showing the same example in multiple languages.',
    props: [],
    syntax: '<CodeGroup>\n```lang title="Label"\ncode\n```\n```lang title="Label"\ncode\n```\n</CodeGroup>',
    example: `<CodeGroup>
\`\`\`typescript title="TypeScript"
const client = new Acme({ apiKey: process.env.ACME_API_KEY });
const user = await client.users.get("user_123");
\`\`\`

\`\`\`python title="Python"
client = Acme(api_key=os.environ["ACME_API_KEY"])
user = client.users.get("user_123")
\`\`\`

\`\`\`curl title="cURL"
curl -X GET https://api.acme.com/v1/users/user_123 \\
  -H "Authorization: Bearer $ACME_API_KEY"
\`\`\`
</CodeGroup>`,
    notes: 'Each code block inside CodeGroup becomes a tab. Use the title attribute to label tabs.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CALLOUT COMPONENTS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Note',
    description: 'Informational callout box. Neutral blue styling.',
    props: [],
    syntax: '<Note>\n  Content here\n</Note>',
    example: `<Note>
  This endpoint requires authentication. Include your API key in the Authorization header.
</Note>`,
  },
  {
    name: 'Tip',
    description: 'Helpful tip callout. Green styling for positive suggestions.',
    props: [],
    syntax: '<Tip>\n  Content here\n</Tip>',
    example: `<Tip>
  Use batch endpoints when processing more than 100 items to improve performance.
</Tip>`,
  },
  {
    name: 'Warning',
    description: 'Warning callout. Yellow/amber styling for important cautions.',
    props: [],
    syntax: '<Warning>\n  Content here\n</Warning>',
    example: `<Warning>
  Rate limits apply to all API endpoints. Exceeding limits will result in 429 errors.
</Warning>`,
  },
  {
    name: 'Danger',
    description: 'Danger/error callout. Red styling for critical warnings.',
    props: [],
    syntax: '<Danger>\n  Content here\n</Danger>',
    example: `<Danger>
  This action is irreversible. Deleted data cannot be recovered.
</Danger>`,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // INTERACTIVE COMPONENTS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Tabs',
    description: 'Generic tabbed content container for any content type.',
    props: [
      { name: 'items', type: 'string[]', required: true, description: 'Array of tab labels' },
    ],
    syntax: '<Tabs items={["Tab 1", "Tab 2"]}>\n  <Tab>Content 1</Tab>\n  <Tab>Content 2</Tab>\n</Tabs>',
    example: `<Tabs items={["Node.js", "Python", "Go"]}>
  <Tab>
    Install with npm:
    \`\`\`bash
    npm install @acme/sdk
    \`\`\`
  </Tab>
  <Tab>
    Install with pip:
    \`\`\`bash
    pip install acme-sdk
    \`\`\`
  </Tab>
  <Tab>
    Install with go get:
    \`\`\`bash
    go get github.com/acme/acme-go
    \`\`\`
  </Tab>
</Tabs>`,
  },
  {
    name: 'Expandable',
    description: 'Collapsible content section. Click to expand/collapse.',
    props: [
      { name: 'title', type: 'string', required: true, description: 'Header text shown when collapsed' },
      { name: 'defaultOpen', type: 'boolean', required: false, description: 'Start expanded', default: 'false' },
    ],
    syntax: '<Expandable title="Click to expand">\n  Hidden content here\n</Expandable>',
    example: `<Expandable title="View full response schema">
  \`\`\`json
  {
    "id": "user_123",
    "email": "user@example.com",
    "created_at": "2024-01-15T10:30:00Z",
    "metadata": {}
  }
  \`\`\`
</Expandable>`,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // API REFERENCE COMPONENTS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'ParamField',
    description: 'Document an API parameter with name, type, and description.',
    props: [
      { name: 'name', type: 'string', required: true, description: 'Parameter name' },
      { name: 'type', type: 'string', required: true, description: 'Data type (e.g., "string", "number", "boolean")' },
      { name: 'required', type: 'boolean', required: false, description: 'Mark as required', default: 'false' },
      { name: 'default', type: 'string', required: false, description: 'Default value if any' },
    ],
    syntax: '<ParamField name="param" type="string" required>\n  Description\n</ParamField>',
    example: `<ParamField name="user_id" type="string" required>
  The unique identifier for the user. Starts with \`user_\`.
</ParamField>

<ParamField name="limit" type="number" default="20">
  Maximum number of results to return. Range: 1-100.
</ParamField>`,
  },
  {
    name: 'ResponseField',
    description: 'Document a response field in API reference pages.',
    props: [
      { name: 'name', type: 'string', required: true, description: 'Field name' },
      { name: 'type', type: 'string', required: true, description: 'Data type' },
    ],
    syntax: '<ResponseField name="field" type="string">\n  Description\n</ResponseField>',
    example: `<ResponseField name="id" type="string">
  Unique identifier for the created resource.
</ResponseField>

<ResponseField name="created_at" type="string">
  ISO 8601 timestamp of when the resource was created.
</ResponseField>`,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MEDIA COMPONENTS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Frame',
    description: 'Styled container for images, videos, or iframes with optional caption.',
    props: [
      { name: 'caption', type: 'string', required: false, description: 'Caption text below the content' },
    ],
    syntax: '<Frame caption="Caption text">\n  ![Alt text](image-url)\n</Frame>',
    example: `<Frame caption="Dashboard overview showing key metrics">
  ![Dashboard Screenshot](/images/dashboard.png)
</Frame>`,
  },
  {
    name: 'Video',
    description: 'Embed a video from YouTube, Vimeo, or direct URL.',
    props: [
      { name: 'src', type: 'string', required: true, description: 'Video URL (YouTube, Vimeo, or direct .mp4)' },
      { name: 'title', type: 'string', required: false, description: 'Accessible title for the video' },
    ],
    syntax: '<Video src="https://youtube.com/watch?v=..." title="Tutorial" />',
    example: `<Video 
  src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
  title="Getting Started Tutorial" 
/>`,
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // STEP COMPONENTS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    name: 'Steps',
    description: 'Numbered step-by-step instructions container.',
    props: [],
    syntax: '<Steps>\n  <Step title="Step 1">\n    Content\n  </Step>\n  <Step title="Step 2">\n    Content\n  </Step>\n</Steps>',
    example: `<Steps>
  <Step title="Install the SDK">
    \`\`\`bash
    npm install @acme/sdk
    \`\`\`
  </Step>
  <Step title="Initialize the client">
    \`\`\`typescript
    import { Acme } from '@acme/sdk';
    const client = new Acme({ apiKey: process.env.ACME_API_KEY });
    \`\`\`
  </Step>
  <Step title="Make your first request">
    \`\`\`typescript
    const users = await client.users.list();
    console.log(users);
    \`\`\`
  </Step>
</Steps>`,
  },
  {
    name: 'Step',
    description: 'Individual step within a Steps container.',
    props: [
      { name: 'title', type: 'string', required: true, description: 'Step heading' },
    ],
    syntax: '<Step title="Step title">\n  Step content\n</Step>',
    example: `<Step title="Configure authentication">
  Add your API key to your environment variables:
  \`\`\`bash
  export ACME_API_KEY="your-api-key"
  \`\`\`
</Step>`,
  },
]

/**
 * Get all component definitions
 */
export function getAllComponents(): ComponentDefinition[] {
  return COMPONENTS
}

/**
 * Get a specific component by name
 */
export function getComponent(name: string): ComponentDefinition | undefined {
  return COMPONENTS.find(c => c.name.toLowerCase() === name.toLowerCase())
}

/**
 * Get component names grouped by category
 */
export function getComponentCategories(): Record<string, string[]> {
  return {
    layout: ['Card', 'CardGroup', 'Hero'],
    code: ['CodeGroup'],
    callouts: ['Note', 'Tip', 'Warning', 'Danger'],
    interactive: ['Tabs', 'Expandable'],
    api: ['ParamField', 'ResponseField'],
    media: ['Frame', 'Video'],
    steps: ['Steps', 'Step'],
  }
}
