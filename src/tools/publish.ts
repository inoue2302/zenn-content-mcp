import { readFileSync, writeFileSync, existsSync } from "fs";
import { execFileSync } from "child_process";
import { z } from "zod";
import { getZennProjectDir, getArticlePath } from "../utils/zenn-path.js";
import { parseArticle, stringifyArticle } from "../utils/frontmatter.js";

export const publishSchema = {
  slug: z.string().describe("公開する記事のslug"),
  commit_message: z
    .string()
    .optional()
    .describe("コミットメッセージ（省略時は自動生成）"),
};

export async function publish({
  slug,
  commit_message,
}: {
  slug: string;
  commit_message?: string;
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

  const projectDir = getZennProjectDir();

  // published: true に変更
  const raw = readFileSync(filePath, "utf-8");
  const article = parseArticle(raw);
  article.frontmatter.published = true;
  writeFileSync(filePath, stringifyArticle(article), "utf-8");

  const message =
    commit_message || `publish: ${article.frontmatter.title || slug}`;

  try {
    // git add → commit → push
    execFileSync("git", ["add", `articles/${slug}.md`], { cwd: projectDir });
    execFileSync("git", ["commit", "-m", message], { cwd: projectDir });
    execFileSync("git", ["push", "origin", "main"], { cwd: projectDir });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "不明なエラーが発生しました";
    return {
      content: [
        {
          type: "text" as const,
          text: `記事を published: true に変更しましたが、git操作に失敗しました: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(
          {
            slug,
            title: article.frontmatter.title,
            published: true,
            commitMessage: message,
            status: "公開完了（git push済み）",
          },
          null,
          2
        ),
      },
    ],
  };
}
