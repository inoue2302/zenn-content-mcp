import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readArticleSchema, readArticle } from "./tools/read-article.js";
import { listArticlesSchema, listArticles } from "./tools/list-articles.js";

const server = new McpServer({
  name: "zenn-content",
  version: "0.1.0",
});

server.tool("zenn_read_article", "指定した記事の全内容を返す", readArticleSchema, readArticle);
server.tool("zenn_list_articles", "記事一覧を取得する", listArticlesSchema, listArticles);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("zenn-content-mcp server started");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
