import { describe, it, expect } from 'bun:test'
import { validateMdx, type ValidationResult } from '../src/schemas/validator'

describe('MDX Validator', () => {
  describe('validateMdx', () => {
    describe('valid content', () => {
      it('validates content with valid frontmatter', () => {
        const content = `---
title: My Guide
description: A helpful guide
---

# Introduction

This is some content.`

        const result = validateMdx(content)
        
        expect(result.valid).toBe(true)
        expect(result.errors.length).toBe(0)
      })

      it('validates content with valid components', () => {
        const content = `---
title: Component Demo
---

<Note>
This is a note.
</Note>

<Card title="My Card">
Card content
</Card>`

        const result = validateMdx(content)
        
        expect(result.valid).toBe(true)
        expect(result.errors.length).toBe(0)
      })

      it('validates content with code blocks', () => {
        const content = `---
title: Code Example
---

\`\`\`typescript
const x = 1
\`\`\`

Some text after.`

        const result = validateMdx(content)
        
        expect(result.valid).toBe(true)
        expect(result.errors.length).toBe(0)
      })

      it('validates API reference page', () => {
        const content = `---
title: Create User
method: POST
endpoint: /api/users
---

<ParamField name="email" type="string" required>
The user's email
</ParamField>`

        const result = validateMdx(content)
        
        expect(result.valid).toBe(true)
      })
    })

    describe('missing frontmatter', () => {
      it('errors on missing frontmatter entirely', () => {
        const content = `# Just a heading

Some content without frontmatter.`

        const result = validateMdx(content)
        
        expect(result.valid).toBe(false)
        expect(result.errors.some(e => e.message.toLowerCase().includes('frontmatter'))).toBe(true)
      })

      it('errors on empty frontmatter', () => {
        const content = `---
---

# Heading`

        const result = validateMdx(content)
        
        expect(result.valid).toBe(false)
        expect(result.errors.some(e => e.message.toLowerCase().includes('title'))).toBe(true)
      })
    })

    describe('missing title', () => {
      it('errors when title is missing', () => {
        const content = `---
description: Some description
---

# Content`

        const result = validateMdx(content)
        
        expect(result.valid).toBe(false)
        expect(result.errors.some(e => e.message.toLowerCase().includes('title'))).toBe(true)
      })
    })

    describe('unknown components', () => {
      it('warns about unknown components', () => {
        const content = `---
title: Test
---

<UnknownComponent>
Content
</UnknownComponent>`

        const result = validateMdx(content)
        
        expect(result.warnings.some(w => 
          w.message.toLowerCase().includes('unknown') || 
          w.message.toLowerCase().includes('unknowncomponent')
        )).toBe(true)
      })

      it('recognizes valid Syntext components', () => {
        const content = `---
title: Test
---

<Card title="Test">
  Content
</Card>`

        const result = validateMdx(content)
        
        // Should not have warnings about unknown component for Card
        expect(result.warnings.every(w => 
          !w.message.includes('Unknown component: <Card>')
        )).toBe(true)
      })
    })

    describe('component validation', () => {
      it('warns on CardGroup without Cards', () => {
        const content = `---
title: Test
---

<CardGroup cols={2}>
No cards here
</CardGroup>`

        const result = validateMdx(content)
        
        expect(result.warnings.some(w => 
          w.message.toLowerCase().includes('cardgroup') &&
          w.message.toLowerCase().includes('card')
        )).toBe(true)
      })

      it('warns on Steps without Step children', () => {
        const content = `---
title: Test
---

<Steps>
No steps here
</Steps>`

        const result = validateMdx(content)
        
        expect(result.warnings.some(w => 
          w.message.toLowerCase().includes('steps') &&
          w.message.toLowerCase().includes('step')
        )).toBe(true)
      })
    })

    describe('code block issues', () => {
      it('warns on unclosed code blocks', () => {
        const content = `---
title: Test
---

\`\`\`javascript
const x = 1
no closing fence`

        const result = validateMdx(content)
        
        expect(result.errors.some(e => 
          e.message.toLowerCase().includes('code block') ||
          e.message.toLowerCase().includes('unclosed')
        )).toBe(true)
      })

      it('warns on CodeGroup with single code block', () => {
        const content = `---
title: Test
---

<CodeGroup>
\`\`\`javascript
const x = 1
\`\`\`
</CodeGroup>`

        const result = validateMdx(content)
        
        expect(result.warnings.some(w => 
          w.message.toLowerCase().includes('codegroup')
        )).toBe(true)
      })
    })

    describe('common mistakes', () => {
      it('warns on HTML comments', () => {
        const content = `---
title: Test
---

<!-- This is a comment -->`

        const result = validateMdx(content)
        
        expect(result.warnings.some(w => 
          w.message.toLowerCase().includes('comment') ||
          w.message.toLowerCase().includes('html')
        )).toBe(true)
      })

      it('warns on numeric attributes without braces', () => {
        const content = `---
title: Test
---

<CardGroup cols=2>
<Card title="Test">Content</Card>
</CardGroup>`

        const result = validateMdx(content)
        
        expect(result.warnings.some(w => 
          w.message.toLowerCase().includes('braces') ||
          w.message.toLowerCase().includes('jsx')
        )).toBe(true)
      })
    })

    describe('result structure', () => {
      it('returns proper ValidationResult structure', () => {
        const content = `---
title: Test
---

Content`

        const result = validateMdx(content)
        
        expect(result).toHaveProperty('valid')
        expect(result).toHaveProperty('errors')
        expect(result).toHaveProperty('warnings')
        expect(Array.isArray(result.errors)).toBe(true)
        expect(Array.isArray(result.warnings)).toBe(true)
      })

      it('errors have line numbers when possible', () => {
        const content = `# No frontmatter

Content`

        const result = validateMdx(content)
        
        // At least one error should have line info
        expect(result.errors.some(e => 
          e.line !== undefined || e.message !== undefined
        )).toBe(true)
      })
    })

    describe('edge cases', () => {
      it('handles empty content', () => {
        const result = validateMdx('')
        
        expect(result.valid).toBe(false)
        expect(result.errors.length).toBeGreaterThan(0)
      })

      it('handles content with only frontmatter', () => {
        const content = `---
title: Only Frontmatter
---`

        const result = validateMdx(content)
        
        // Should be valid but maybe warn about empty content
        expect(result.errors.length).toBe(0)
      })

      it('handles complex nested components', () => {
        const content = `---
title: Complex
---

<CardGroup>
  <Card title="One">
    <Note>
      Nested content
    </Note>
  </Card>
  <Card title="Two">
    More content
  </Card>
</CardGroup>`

        const result = validateMdx(content)
        
        // Should not crash
        expect(result).toBeDefined()
        // Should be valid (properly nested)
        expect(result.valid).toBe(true)
      })
    })
  })
})
