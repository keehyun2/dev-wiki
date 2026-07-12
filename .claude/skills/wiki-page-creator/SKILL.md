---
name: wiki-page-creator
description: Create new wiki pages following the AGENTS.md schema. Use when the user wants to add a new summary, concept, or exploration page to the wiki, or when they mention creating wiki content, adding a new document summary, or creating cross-document synthesis pages.
---

# Wiki Page Creator

Create new wiki pages following the AGENTS.md schema for structured documentation.

## Page Types

Based on the wiki schema, there are four main page types:

### Summary Page (summaries/)
- **Purpose**: Key content summary of a single source document
- **Source**: `sources/` directory (`.md` for short docs, `.json` for long docs)
- **Content**: Extract the main points, key findings, and essential information
- **Format**: Standard markdown with wikilinks to related concepts

### Concept Page (concepts/)
- **Purpose**: Cross-document topic synthesis
- **Source**: Created when themes span multiple documents
- **Content**: Synthesize information from across sources, use `[[wikilinks]]` extensively
- **Format**: Use heading hierarchy, connect related concepts

### Exploration Page (explorations/)
- **Purpose**: Saved query results, analyses, and comparisons
- **Source**: User queries, research findings, comparative analyses
- **Content**: Results worth keeping - analyses, comparisons, syntheses
- **Format**: Document the question/analysis, findings, and conclusions

### Supporting Pages
- **index.md**: Catalog of all pages (update when adding new pages)
- **log.md**: Chronological record of operations (append new entries)

## Page Creation Workflow

### 1. Determine Page Type
Ask the user or infer from context:
- Summarizing a specific document? → Summary page
- Synthesizing across multiple sources? → Concept page
- Saving analysis/query results? → Exploration page

### 2. Gather Context
- Read relevant source documents from `sources/`
- Check existing pages to avoid duplication
- Identify related concepts for wikilinking

### 3. Create Page
- Use proper file naming: `kebab-case.md`
- Place in correct directory (`summaries/`, `concepts/`, `explorations/`)
- Write content following format guidelines
- Add wikilinks to related pages using `[[page-name]]` format

### 4. Update Supporting Files
- **index.md**: Add entry for the new page with one-line summary
- **log.md**: Append entry with timestamp and operation

## Format Guidelines

- **Wikilinks**: Use `[[path/to/page]]` to link other wiki pages
- **No YAML frontmatter**: Don't add `---` frontmatter to generated content
- **Heading hierarchy**: Use standard markdown (`#`, `##`, `###`)
- **Focus**: Keep each page on a single topic
- **Brevity**: One-liner summaries in index.md, detailed content in pages

## Examples

### Creating a Summary Page
```
User: "Summarize the userguide.json document"
→ Create: summaries/userguide.md
→ Content: Extract key points from sources/userguide.json
→ Update: index.md, log.md
```

### Creating a Concept Page
```
User: "Create a concept page about bond valuation that covers both documents"
→ Create: concepts/bond-valuation.md
→ Content: Synthesize from multiple sources, link to related concepts
→ Update: index.md, log.md
```

### Creating an Exploration Page
```
User: "Save this analysis of yield curve differences"
→ Create: explorations/yield-curve-comparison.md
→ Content: Document the analysis, findings, and data sources
→ Update: index.md, log.md
```

## Log Entry Format
When creating pages, append to log.md:
```markdown
## [YYYY-MM-DD HH:MM:SS] create | Created [page-type] page: [page-name]
```

## Index Entry Format
Add to index.md under appropriate category:
```markdown
- [[page-name]] — One-line description
```

## Always

1. Check for duplicate or similar existing pages before creating
2. Use proper kebab-case file naming
3. Add wikilinks to related content
4. Update index.md with a one-line summary
5. Append to log.md with timestamp and operation
