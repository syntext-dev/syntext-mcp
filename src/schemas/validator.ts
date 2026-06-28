/**
 * MDX validation for Syntext docs.
 * Checks frontmatter, component usage, and common mistakes.
 */

import { COMPONENTS } from './components'

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

export interface ValidationError {
  line?: number
  message: string
  suggestion?: string
}

export interface ValidationWarning {
  line?: number
  message: string
  suggestion?: string
}

const VALID_COMPONENT_NAMES = new Set(COMPONENTS.map(c => c.name))

const SELF_CLOSING_COMPONENTS = new Set(['Video', 'ParamField', 'ResponseField'])

/**
 * Validate Syntext MDX content
 */
export function validateMdx(content: string): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []
  const lines = content.split('\n')

  // Check frontmatter
  const frontmatterResult = validateFrontmatter(content)
  errors.push(...frontmatterResult.errors)
  warnings.push(...frontmatterResult.warnings)

  // Check component usage
  const componentResult = validateComponents(content, lines)
  errors.push(...componentResult.errors)
  warnings.push(...componentResult.warnings)

  // Check code blocks
  const codeBlockResult = validateCodeBlocks(content, lines)
  errors.push(...codeBlockResult.errors)
  warnings.push(...codeBlockResult.warnings)

  // Check common mistakes
  const mistakesResult = checkCommonMistakes(content, lines)
  errors.push(...mistakesResult.errors)
  warnings.push(...mistakesResult.warnings)

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

function validateFrontmatter(content: string): { errors: ValidationError[], warnings: ValidationWarning[] } {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []

  // Check if frontmatter exists
  if (!content.startsWith('---')) {
    errors.push({
      line: 1,
      message: 'Missing frontmatter. Every page must start with frontmatter.',
      suggestion: 'Add frontmatter at the top:\n---\ntitle: Page Title\n---',
    })
    return { errors, warnings }
  }

  // Find frontmatter end
  const endIndex = content.indexOf('---', 3)
  if (endIndex === -1) {
    errors.push({
      line: 1,
      message: 'Frontmatter not closed. Missing closing ---',
      suggestion: 'Add closing --- after frontmatter fields',
    })
    return { errors, warnings }
  }

  const frontmatter = content.slice(3, endIndex).trim()
  const frontmatterLines = frontmatter.split('\n')
  const startLine = 2 // Line 1 is the opening ---

  // Check for title
  const hasTitle = frontmatterLines.some(line => line.trim().startsWith('title:'))
  if (!hasTitle) {
    errors.push({
      line: startLine,
      message: 'Missing required field: title',
      suggestion: 'Add title: "Your Page Title" to frontmatter',
    })
  }

  // Check for common YAML mistakes
  for (let i = 0; i < frontmatterLines.length; i++) {
    const line = frontmatterLines[i]
    const lineNum = startLine + i

    // Check for tabs (should use spaces in YAML)
    if (line.includes('\t')) {
      errors.push({
        line: lineNum,
        message: 'Tabs are not allowed in YAML frontmatter',
        suggestion: 'Use spaces instead of tabs for indentation',
      })
    }

    // Check for missing space after colon
    if (line.match(/^\s*\w+:[^\s]/)) {
      const field = line.match(/^\s*(\w+):/)?.[1]
      errors.push({
        line: lineNum,
        message: `Missing space after colon in "${field}"`,
        suggestion: `Change to: ${field}: value`,
      })
    }
  }

  // Warn about missing description
  const hasDescription = frontmatterLines.some(line => line.trim().startsWith('description:'))
  if (!hasDescription) {
    warnings.push({
      line: startLine,
      message: 'Missing description field (recommended for SEO)',
      suggestion: 'Add description: "Brief description of this page"',
    })
  }

  return { errors, warnings }
}

function validateComponents(content: string, lines: string[]): { errors: ValidationError[], warnings: ValidationWarning[] } {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []

  // Find all component usages
  const componentRegex = /<([A-Z][a-zA-Z]*)/g
  let match

  while ((match = componentRegex.exec(content)) !== null) {
    const componentName = match[1]
    const position = match.index
    const lineNum = content.slice(0, position).split('\n').length

    // Check if it's a valid Syntext component
    if (!VALID_COMPONENT_NAMES.has(componentName)) {
      // Could be a custom component - just warn
      warnings.push({
        line: lineNum,
        message: `Unknown component: <${componentName}>`,
        suggestion: `Valid components: ${Array.from(VALID_COMPONENT_NAMES).join(', ')}`,
      })
    }
  }

  // Check for unclosed components
  for (const comp of COMPONENTS) {
    if (SELF_CLOSING_COMPONENTS.has(comp.name)) continue

    // Use word boundary to avoid matching CardGroup when looking for Card
    const openRegex = new RegExp(`<${comp.name}(?![a-zA-Z])[^>]*>`, 'g')
    const closeRegex = new RegExp(`</${comp.name}>`, 'g')
    
    const openCount = (content.match(openRegex) || []).length
    const closeCount = (content.match(closeRegex) || []).length

    if (openCount > closeCount) {
      errors.push({
        message: `Unclosed <${comp.name}> component. Found ${openCount} opening tags but only ${closeCount} closing tags.`,
        suggestion: `Add </${comp.name}> to close the component`,
      })
    }
  }

  // Check for common component mistakes
  // CardGroup without Cards
  const hasCardGroup = /<CardGroup/.test(content)
  const hasCard = /<Card(?![a-zA-Z])/.test(content)
  if (hasCardGroup && !hasCard) {
    warnings.push({
      message: '<CardGroup> found without any <Card> children',
      suggestion: 'Add <Card> components inside <CardGroup>',
    })
  }

  // Steps without Step
  const hasSteps = /<Steps/.test(content)
  const hasStep = /<Step(?![a-zA-Z])/.test(content)
  if (hasSteps && !hasStep) {
    warnings.push({
      message: '<Steps> found without any <Step> children',
      suggestion: 'Add <Step> components inside <Steps>',
    })
  }

  // Tabs without Tab
  const hasTabs = /<Tabs/.test(content)
  const hasTab = /<Tab(?![a-zA-Z])/.test(content)
  if (hasTabs && !hasTab) {
    warnings.push({
      message: '<Tabs> found without any <Tab> children',
      suggestion: 'Add <Tab> components inside <Tabs>',
    })
  }

  return { errors, warnings }
}

function validateCodeBlocks(content: string, lines: string[]): { errors: ValidationError[], warnings: ValidationWarning[] } {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []

  // Count code block delimiters
  const codeBlockStarts = (content.match(/```/g) || []).length

  if (codeBlockStarts % 2 !== 0) {
    errors.push({
      message: 'Unclosed code block. Code blocks must have matching ``` delimiters.',
      suggestion: 'Check that every ``` has a matching closing ```',
    })
  }

  // Check for code blocks inside CodeGroup
  if (content.includes('<CodeGroup>')) {
    const codeGroupMatch = content.match(/<CodeGroup>([\s\S]*?)<\/CodeGroup>/g)
    if (codeGroupMatch) {
      for (const group of codeGroupMatch) {
        const codeBlocksInGroup = (group.match(/```/g) || []).length / 2
        if (codeBlocksInGroup < 2) {
          warnings.push({
            message: '<CodeGroup> should contain at least 2 code blocks for tab switching',
            suggestion: 'Add multiple code blocks with different languages inside CodeGroup',
          })
        }
      }
    }
  }

  return { errors, warnings }
}

function checkCommonMistakes(content: string, lines: string[]): { errors: ValidationError[], warnings: ValidationWarning[] } {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []

  // Check for JSX expressions without braces
  const jsxAttributeRegex = /(\w+)=([^"{][^\s>]*)/g
  let jsxMatch
  while ((jsxMatch = jsxAttributeRegex.exec(content)) !== null) {
    const [full, attr, value] = jsxMatch
    // Skip if it's a valid attribute like href="/path" or class="name"
    if (value.startsWith('"') || value.startsWith("'") || value.startsWith('{')) continue
    // Skip if it's just a boolean attribute
    if (!value || value === '/' || value === '>') continue
    
    const position = jsxMatch.index
    const lineNum = content.slice(0, position).split('\n').length
    
    // Only flag if it looks like it should be a JSX expression
    if (value.match(/^\[.*\]$/) || value.match(/^[0-9]+$/)) {
      warnings.push({
        line: lineNum,
        message: `Attribute ${attr}=${value} may need braces for JSX expression`,
        suggestion: `Try: ${attr}={${value}}`,
      })
    }
  }

  // Check for HTML comments (should use {/* */} in MDX)
  if (content.includes('<!--')) {
    const position = content.indexOf('<!--')
    const lineNum = content.slice(0, position).split('\n').length
    warnings.push({
      line: lineNum,
      message: 'HTML comments (<!-- -->) may not work in MDX',
      suggestion: 'Use JSX comments: {/* comment */}',
    })
  }

  // Check for raw HTML that might cause issues
  const rawHtmlTags = ['<div', '<span', '<section', '<article', '<header', '<footer']
  for (const tag of rawHtmlTags) {
    if (content.includes(tag)) {
      warnings.push({
        message: `Raw HTML ${tag}> detected. Consider using Syntext components instead.`,
        suggestion: 'Use Card, CardGroup, or other Syntext components for better styling',
      })
      break // Only warn once
    }
  }

  return { errors, warnings }
}

/**
 * Quick validation - just check if content is likely valid
 */
export function quickValidate(content: string): boolean {
  // Must have frontmatter
  if (!content.startsWith('---')) return false
  if (content.indexOf('---', 3) === -1) return false
  
  // Must have title
  if (!content.includes('title:')) return false

  // Code blocks must be balanced
  const codeBlocks = (content.match(/```/g) || []).length
  if (codeBlocks % 2 !== 0) return false

  return true
}
