import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readArticleSchema, readArticle } from "./tools/read-article.js";
import { listArticlesSchema, listArticles } from "./tools/list-articles.js";
import { createArticleSchema, createArticle } from "./tools/create-article.js";
import { updateArticleSchema, updateArticle } from "./tools/update-article.js";
import { previewSchema, preview } from "./tools/preview.js";
import { publishSchema, publish } from "./tools/publish.js";

const server = new McpServer({
  name: "zenn-content",
  version: "0.1.0",
});

server.tool("zenn_read_article", "指定した記事の全内容を返す", readArticleSchema, readArticle);
server.tool("zenn_list_articles", "記事一覧を取得する", listArticlesSchema, listArticles);
server.tool("zenn_create_article", "新しい記事を作成する", createArticleSchema, createArticle);
server.tool("zenn_update_article", "記事のfrontmatterや本文を更新する", updateArticleSchema, updateArticle);
server.tool("zenn_preview", "プレビューサーバーの起動・停止・状態確認", previewSchema, preview);
server.tool("zenn_publish", "記事を公開する（published: true + git push）", publishSchema, publish);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("zenn-content-mcp server started");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
