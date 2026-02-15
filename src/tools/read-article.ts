import { readFileSync, existsSync } from "fs";
import { z } from "zod";
import { getArticlePath } from "../utils/zenn-path.js";
import { parseArticle } from "../utils/frontmatter.js";

export const readArticleSchema = {
  slug: z.string().describe("記事のslug（ファイル名から拡張子を除いたもの）"),
};

export async function readArticle({ slug }: { slug: string }) {
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

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          {
            slug,
            ...article.frontmatter,
            body: article.body,
          },
          null,
          2
        ),
      },
    ],
  };
}
