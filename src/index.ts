import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({
  name: "zenn-content",
  version: "0.1.0",
});

// Tools will be registered here in subsequent issues

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("zenn-content-mcp server started");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
