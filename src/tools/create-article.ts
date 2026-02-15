import { execFileSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { z } from "zod";
import { getZennProjectDir, getArticlePath } from "../utils/zenn-path.js";
import { parseArticle, stringifyArticle } from "../utils/frontmatter.js";

export const createArticleSchema = {
  slug: z.string().optional().describe("記事のslug（省略時はランダム生成）"),
  title: z.string().describe("記事タイトル"),
  emoji: z.string().describe("アイキャッチ絵文字"),
  type: z.enum(["tech", "idea"]).default("tech").describe("記事タイプ"),
  topics: z.array(z.string()).describe("トピック（タグ）の配列"),
  published: z.boolean().default(false).describe("公開するかどうか"),
};

export async function createArticle({
  slug,
  title,
  emoji,
  type,
  topics,
  published,
}: {
  slug?: string;
  title: string;
  emoji: string;
  type: string;
  topics: string[];
  published: boolean;
}) {
  const projectDir = getZennProjectDir();

  // npx zenn new:article でファイルを生成
  const args = ["zenn", "new:article"];
  if (slug) {
    args.push("--slug", slug);
  }

  const result = execFileSync("npx", args, {
    cwd: projectDir,
    encoding: "utf-8",
    timeout: 30000,
  });

  // 出力からslugを取得（例: "created: articles/my-article.md"）
  const match = result.match(/articles\/(.+)\.md/);
  if (!match) {
    return {
      content: [
        {
          type: "text" as const,
          text: `記事の作成に失敗しました: ${result}`,
        },
      ],
      isError: true,
    };
  }

  const actualSlug = match[1];
  const filePath = getArticlePath(actualSlug);

  // 生成されたファイルを読み込み、frontmatterを更新
  const raw = readFileSync(filePath, "utf-8");
  const article = parseArticle(raw);

  article.frontmatter.title = title;
  article.frontmatter.emoji = emoji;
  article.frontmatter.type = type as "tech" | "idea";
  article.frontmatter.topics = topics;
  article.frontmatter.published = published;

  writeFileSync(filePath, stringifyArticle(article), "utf-8");

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          {
            slug: actualSlug,
            path: `articles/${actualSlug}.md`,
            ...article.frontmatter,
          },
          null,
          2
        ),
      },
    ],
  };
}
