# zenn-content-mcp

Claude Code から Zenn の記事を作成・管理・公開できる MCP サーバーです。

Zenn プロジェクトの `articles/` ディレクトリにある Markdown ファイルを直接操作し、プレビューや git push による公開まで Claude Code 上で完結できます。

## 提供ツール

| ツール名 | 説明 |
| --- | --- |
| `zenn_create_article` | 新しい記事を作成（`npx zenn new:article` を実行し frontmatter を設定） |
| `zenn_list_articles` | 記事一覧を取得（all / draft / published でフィルター可能） |
| `zenn_read_article` | 指定した記事の frontmatter と本文を返す |
| `zenn_update_article` | 記事の frontmatter や本文を部分更新 |
| `zenn_preview` | プレビューサーバーの起動・停止・状態確認 |
| `zenn_publish` | `published: true` に変更し git add → commit → push で公開 |

## 前提条件

- Node.js 18+
- 操作対象の Zenn プロジェクトに `zenn-cli` がインストール済みであること
- 公開（`zenn_publish`）を使う場合、Zenn プロジェクトが GitHub リポジトリと連携済みであること

## セットアップ

### 1. ビルド

```bash
git clone https://github.com/inoue2302/zenn-content-mcp.git
cd zenn-content-mcp
npm install
npm run build
```

### 2. Claude Code に MCP サーバーとして登録

`.claude/mcp.json` に以下を追加します。

```json
{
  "mcpServers": {
    "zenn-content": {
      "command": "node",
      "args": ["/path/to/zenn-content-mcp/dist/index.js"],
      "env": {
        "ZENN_PROJECT_DIR": "/path/to/your-zenn-project"
      }
    }
  }
}
```

`ZENN_PROJECT_DIR` には `npx zenn init` 済みの Zenn プロジェクトのルートパスを指定してください。

## 使い方

Claude Code 上で自然言語で指示するだけで各ツールが呼び出されます。

```
「Zennの記事一覧を見せて」
「TypeScriptの入門記事を新規作成して」
「slug-name の記事のタイトルを変更して」
「プレビューを起動して」
「この記事を公開して」
```

## 開発

```bash
npm run dev    # tsx による開発実行（stdio transport）
npm run build  # tsc → dist/
```

## ライセンス

MIT
