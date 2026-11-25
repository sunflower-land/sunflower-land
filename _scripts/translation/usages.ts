import * as fs from "fs";
import * as path from "path";

export type SourceFile = { path: string; text: string };

/** A few lines of game code around a place that uses a translation key. */
export type CodeSnippet = { file: string; code: string };

// Removes the indentation every non-blank line shares.
function dedent(lines: string[]): string[] {
  const indents = lines
    .filter((line) => line.trim())
    .map((line) => (/^ */.exec(line) as RegExpExecArray)[0].length);
  const shared = Math.min(...indents);
  return lines.map((line) => line.slice(shared));
}

/**
 * Finds where the code uses a translation key, written out in full in quotes
 * or backticks, and returns the lines around each place: one snippet per file,
 * from the first files that use it. A key built in code, such as
 * `chore.${name}`, isn't found.
 */
export function findKeyUsages(
  key: string,
  files: SourceFile[],
  { linesAround = 3, maxSnippets = 2, maxChars = 500 } = {},
): CodeSnippet[] {
  const quoted = [`"${key}"`, `'${key}'`, `\`${key}\``];
  const snippets: CodeSnippet[] = [];

  for (const file of files) {
    if (snippets.length >= maxSnippets) break;
    if (!quoted.some((literal) => file.text.includes(literal))) continue;

    const lines = file.text.split("\n");
    const index = lines.findIndex((line) =>
      quoted.some((literal) => line.includes(literal)),
    );
    if (index === -1) continue;

    const start = Math.max(0, index - linesAround);
    const around = dedent(lines.slice(start, index + linesAround + 1));
    let code = around.join("\n").trim();
    if (code.length > maxChars) {
      code = lines[index].trim().slice(0, maxChars);
    }

    snippets.push({ file: file.path, code });
  }

  return snippets;
}

/**
 * The game's TypeScript source, without tests, for findKeyUsages. Paths are
 * relative to the repo root.
 */
export function readSourceFiles(root: string): SourceFile[] {
  const src = path.join(root, "src");
  return (fs.readdirSync(src, { recursive: true }) as string[])
    .filter((file) => /\.tsx?$/.test(file) && !/\.test\.tsx?$/.test(file))
    .sort()
    .map((file) => ({
      path: path.join("src", file),
      text: fs.readFileSync(path.join(src, file), "utf-8"),
    }));
}
