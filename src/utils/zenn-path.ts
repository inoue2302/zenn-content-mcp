import { existsSync } from "fs";
import { resolve } from "path";

export function getZennProjectDir(): string {
  const dir = process.env.ZENN_PROJECT_DIR;
  if (!dir) {
    throw new Error(
      "ZENN_PROJECT_DIR environment variable is not set. " +
        "Set it to the root of your Zenn project."
    );
  }

  const resolved = resolve(dir);
  if (!existsSync(resolved)) {
    throw new Error(`ZENN_PROJECT_DIR does not exist: ${resolved}`);
  }

  return resolved;
}

export function getArticlesDir(): string {
  return resolve(getZennProjectDir(), "articles");
}

export function getArticlePath(slug: string): string {
  return resolve(getArticlesDir(), `${slug}.md`);
}
