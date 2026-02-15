import { readFileSync, writeFileSync, existsSync } from "fs";
import { z } from "zod";
import { getArticlePath } from "../utils/zenn-path.js";
import { parseArticle, stringifyArticle } from "../utils/frontmatter.js";

export const updateArticleSchema = {
  slug: z.string().describe("記事のslug"),
  title: z.string().optional().describe("新しいタイトル"),
  emoji: z.string().optional().describe("新しい絵文字"),
  topics: z.array(z.string()).optional().describe("新しいトピック配列"),
  type: z.enum(["tech", "idea"]).optional().describe("記事タイプ"),
  published: z.boolean().optional().describe("公開状態"),
  body: z.string().optional().describe("新しい本文（全体を置換）"),
};

export async function updateArticle({
  slug,
  title,
  emoji,
  topics,
  type,
  published,
  body,
}: {
  slug: string;
  title?: string;
  emoji?: string;
  topics?: string[];
  type?: string;
  published?: boolean;
  body?: string;
}) {
  const filePath = getArticlePath(slug);

  if (!existsSync(filePath)) {
    return {
      content: [
        { type: "text" as const, text: `記事が見つかりません: ${slug}` },
      ],
      isError: true,
    };
  }

  const raw = readFileSync(filePath, "utf-8");
  const article = parseArticle(raw);

  // frontmatterの部分更新（指定されたフィールドだけ上書き）
  if (title !== undefined) article.frontmatter.title = title;
  if (emoji !== undefined) article.frontmatter.emoji = emoji;
  if (topics !== undefined) article.frontmatter.topics = topics;
  if (type !== undefined) article.frontmatter.type = type as "tech" | "idea";
  if (published !== undefined) article.frontmatter.published = published;

  // bodyが指定されていれば本文を置換
  if (body !== undefined) article.body = body;

  writeFileSync(filePath, stringifyArticle(article), "utf-8");

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          {
            slug,
            ...article.frontmatter,
            bodyLength: article.body.length,
          },
          null,
          2
        ),
      },
    ],
  };
}
