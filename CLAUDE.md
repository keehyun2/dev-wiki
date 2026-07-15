# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Quartz-based wiki/digital garden** that publishes markdown content as a static website. Content is organized using a specific wiki schema with summaries, concepts, and explorations.

**Technology Stack:**
- **Quartz 4** - Static site generator for transforming markdown content into HTML
- **TypeScript** - Configuration and plugin system
- **Node.js 22+** - Runtime environment
- **Volar/Quartz components** - React-like component system for UI

## Essential Commands

### Development
```bash
npm install              # Install dependencies
npm run build            # Build site to public/ (npx quartz build)
npm run serve            # Build and serve on http://localhost:8080 with hot reload
npm run check            # Type check and format check (tsc --noEmit && prettier . --check)
npm run format           # Format code with prettier
npm run test             # Run tests (tsx --test)
```

### Deployment
```bash
# Automatic: Push to master branch → GitHub Actions builds and deploys to keehyun2.github.io
# Manual: npx quartz build
```

The deployment workflow uses:
- GitHub Actions (`.github/workflows/deploy.yml`)
- Builds with `npm ci` → `npm run build`
- Publishes `public/` to external repository `keehyun2.github.io`

## Wiki Content Architecture

This wiki follows a **structured content schema** defined in `content/AGENTS.md`:

### Directory Structure
```
content/
├── sources/          # Original documents (.md for short, .json for long). DO NOT modify directly.
├── summaries/       # One summary per source document
├── concepts/        # Cross-document synthesis pages (when themes span multiple sources)
├── explorations/    # Saved query results, analyses, comparisons
├── index.md         # Catalog of all pages with one-line summaries
└── log.md           # Chronological operation log (ingest/query/lint entries)
```

### Page Types
1. **Summary Page** (`summaries/`): Key content extracted from a single source document
2. **Concept Page** (`concepts/`): Cross-document topic synthesis using `[[wikilinks]]`
3. **Exploration Page** (`explorations/`): Saved research/analysis/comparison results

### Wiki Linking
- Use `[[page-name]]` or `[[path/to/page]]` format for internal links
- Links work across all content directories
- Quartz automatically resolves these to proper HTML paths

### Content Guidelines
- **No YAML frontmatter** in generated content (managed by code)
- Standard markdown heading hierarchy
- Keep each page focused on a single topic
- Update `index.md` when adding new pages (one-line entry)
- Append to `log.md` with timestamp for operations

## Quartz Configuration

Configuration in `quartz.config.ts`:

**Key Settings:**
- `pageTitle`: "Dev Wiki"
- `locale`: "ko-KR" (Korean)
- `ignorePatterns`: ["private", "templates", ".obsidian", "log.md", "AGENTS.md", "test-sync.md"]
- `enableSPA`: true (single-page app navigation)
- `enablePopovers`: true (link preview popovers)

**Transformers** (process markdown → HTML):
- FrontMatter, CreatedModifiedDate, SyntaxHighlighting, ObsidianFlavoredMarkdown, GitHubFlavoredMarkdown, TableOfContents, CrawlLinks, Description, Latex

**Filters**: RemoveDrafts

**Emitters** (generate output files):
- ContentPage, FolderPage, TagPage, ContentIndex, Assets, Static, Favicon, CustomOgImages

### Markdown Features Supported
- Obsidian-style `[[wikilinks]]`
- GitHub Flavored Markdown (tables, strikethrough, task lists)
- LaTeX/Katex math
- Syntax highlighting with Shiki
- Callouts, checkboxes, mermaid diagrams

## Architecture

### Build Pipeline
```
content/*.md → Quartz Parser → Transformers → Filters → Emitters → public/*.html
```

1. **Parse**: Markdown files processed by remark/rehype plugins
2. **Transform**: Apply syntax highlighting, link resolution, TOC generation
3. **Filter**: Remove drafts based on `publish: false` frontmatter
4. **Emit**: Generate HTML pages, assets, sitemap, RSS

### Plugin System
Quartz uses a plugin architecture defined in `quartz/plugins/`:
- `transformers/`: Content transformation plugins
- `filters/`: Content filtering plugins  
- `emitters/`: Output generation plugins
- `processors/`: Build pipeline orchestration

### Component System
Quartz components in `quartz/components/` are React-like but use **Preact**:
- `pages/`: Page templates (Content, FolderContent, TagContent, 404)
- `scripts/`: Inline scripts for interactivity (search, graph, darkmode, SPA)
- `styles/`: SCSS stylesheets

## Custom Skills

This repository includes a custom skill for wiki page creation:
- **wiki-page-creator**: Create wiki pages following the AGENTS.md schema
  - Summary pages from source documents
  - Concept pages for cross-document synthesis
  - Exploration pages for research/analysis results

Invoke via `/wiki-page-creator` or when user mentions creating wiki content, summaries, or concept pages.

## Development Workflow

1. **Edit Content**: Add/edit markdown files in `content/`
2. **Local Preview**: Run `npm run serve` to see changes with hot reload
3. **Check**: Run `npm run check` before committing
4. **Push**: Commit to master → auto-deploy via GitHub Actions

### Adding New Wiki Pages
When creating content:
1. Choose page type (summary/concept/exploration)
2. Create file in appropriate directory with kebab-case naming
3. Add wikilinks using `[[page-name]]` format
4. Update `content/index.md` with one-line entry
5. Append to `content/log.md` with timestamp

## File Relationships

- `quartz.layout.ts`: Defines page layout structure
- `quartz/cfg.ts`: Core configuration types
- `quartz/build.ts`: Build orchestration
- `content/`: All wiki content (source of truth for site)
- `public/`: Generated static site (DO NOT edit directly)
