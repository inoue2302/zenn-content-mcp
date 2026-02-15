import matter from "gray-matter";

export interface ZennFrontmatter {
  title: string;
  emoji: string;
  type: "tech" | "idea";
  topics: string[];
  published: boolean;
}

export interface ZennArticle {
  frontmatter: ZennFrontmatter;
  body: string;
}

export function parseArticle(content: string): ZennArticle {
  const { data, content: body } = matter(content);
  return {
    frontmatter: data as ZennFrontmatter,
    body: body.trimStart(),
  };
}

export function stringifyArticle(article: ZennArticle): string {
  return matter.stringify("\n" + article.body, article.frontmatter);
}
