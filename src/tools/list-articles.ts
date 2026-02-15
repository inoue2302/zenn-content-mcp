import { readFileSync, readdirSync } from "fs";
import { basename } from "path";
import { z } from "zod";
import { getArticlesDir } from "../utils/zenn-path.js";
import { parseArticle } from "../utils/frontmatter.js";

export const listArticlesSchema = {
  status: z
    .enum(["all", "draft", "published"])
    .default("all")
    .describe("フィルター: all / draft / published"),
};

export async function listArticles({ status }: { status: string }) {
  const articlesDir = getArticlesDir();

  let files: string[];
  try {
    files = readdirSync(articlesDir).filter((f) => f.endsWith(".md"));
  } catch {
    return {
      content: [
        {
          type: "text" as const,
          text: `articles ディレクトリが見つかりません: ${articlesDir}`,
        },
      ],
      isError: true,
    };
  }

  const articles = files.map((file) => {
    const raw = readFileSync(`${articlesDir}/${file}`, "utf-8");
    const { frontmatter } = parseArticle(raw);
    const slug = basename(file, ".md");
    return {
      slug,
      ...frontmatter,
      path: `articles/${file}`,
    };
  });

  const filtered = articles.filter((a) => {
    if (status === "draft") return !a.published;
    if (status === "published") return a.published;
    return true;
  });

  return {
    content: [
      { type: "text" as const, text: JSON.stringify(filtered, null, 2) },
    ],
  };
}
