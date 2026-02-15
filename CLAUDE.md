# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MCP (Model Context Protocol) server that lets Claude Code create, manage, and publish Zenn CLI articles. It directly operates on markdown files in a Zenn project's `articles/` directory.

## Tech Stack

- TypeScript, Node.js 18+
- `@modelcontextprotocol/sdk` for MCP server
- `gray-matter` for frontmatter parsing
- `zenn-cli` (expected to be installed in the target Zenn project)

## Build & Run

```bash
npm install
npm run build          # tsc → dist/
npm run dev            # ts-node for development
```

## Architecture

**Entry point:** `src/index.ts` — Registers all MCP tools and starts the stdio transport server.

**Tools (`src/tools/`):** Each file exports a single MCP tool handler:
- `create-article.ts` — Runs `npx zenn new:article --slug xxx`, then writes frontmatter
- `list-articles.ts` — Globs `articles/*.md`, parses frontmatter from each
- `read-article.ts` — Returns full markdown content (frontmatter + body)
- `update-article.ts` — Patches frontmatter fields and/or replaces body
- `preview.ts` — Manages `npx zenn preview` as a background process
- `publish.ts` — Sets `published: true`, then runs git add/commit/push

**Utilities (`src/utils/`):**
- `frontmatter.ts` — Parse and serialize Zenn frontmatter using `gray-matter`
- `zenn-path.ts` — Resolves the Zenn project root from `ZENN_PROJECT_DIR` env var

## Key Convention

The Zenn project directory is configured via the `ZENN_PROJECT_DIR` environment variable, set in the MCP server config (`.claude/mcp.json`). All file operations are relative to this path.

## Zenn Article Format

```markdown
---
title: ""
emoji: ""
type: "tech"       # "tech" | "idea"
topics: []
published: false
---

Body content here
```
