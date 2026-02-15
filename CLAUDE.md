# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

Claude CodeからZenn CLIの記事を作成・管理・公開できるMCPサーバー。Zennプロジェクトの `articles/` ディレクトリのmarkdownファイルを直接操作する。

## 技術スタック

- TypeScript, Node.js 18+
- `@modelcontextprotocol/sdk` (MCP Server SDK)
- `gray-matter` (frontmatterパース)
- `zenn-cli` (対象のZennプロジェクトにインストール済み前提)

## ビルド・実行

```bash
npm install
npm run build          # tsc → dist/
npm run dev            # tsx による開発実行
```

## アーキテクチャ

**エントリーポイント:** `src/index.ts` — MCPツールを登録し、stdio transportでサーバーを起動する。

**ツール (`src/tools/`):** 各ファイルが1つのMCPツールハンドラをエクスポートする:
- `create-article.ts` — `npx zenn new:article --slug xxx` を実行し、frontmatterを書き込む
- `list-articles.ts` — `articles/*.md` をglobし、各ファイルのfrontmatterをパースして一覧返却
- `read-article.ts` — 記事の全文(frontmatter + 本文)を返す
- `update-article.ts` — frontmatterの部分更新・本文の置換
- `preview.ts` — `npx zenn preview` をバックグラウンドで起動・停止
- `publish.ts` — `published: true` に変更し、git add/commit/push

**ユーティリティ (`src/utils/`):**
- `frontmatter.ts` — `gray-matter` によるfrontmatterのパース・シリアライズ
- `zenn-path.ts` — `ZENN_PROJECT_DIR` 環境変数からZennプロジェクトのパスを解決

## 重要な規約

Zennプロジェクトのディレクトリは環境変数 `ZENN_PROJECT_DIR` で指定する（`.claude/mcp.json` で設定）。すべてのファイル操作はこのパスを基準に行う。

## Zenn記事のフォーマット

```markdown
---
title: ""
emoji: ""
type: "tech"       # "tech" | "idea"
topics: []
published: false
---

本文
```
