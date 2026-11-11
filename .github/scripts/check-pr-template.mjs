// Checks that a PR follows docs/PULL_REQUEST_TEMPLATE.md:
// - the title starts with an allowed prefix;
// - Summary, Context / motivation and How to test are filled in;
// - the Checklist is still there;
// - if UI files changed (see docs/DESIGN_SYSTEM.md, rule R9), either "This PR
//   does not change the UI" is ticked, or "Why this UI change is needed" is
//   filled in and there are before/after screenshots.
//
// Run by .github/workflows/pr-template-check.yml. Regression cases:
//   node --test .github/scripts/check-pr-template.cases.mjs
// Against a real PR:
//   gh api --paginate repos/sunflower-land/sunflower-land/pulls/123/files \
//     --jq '.[] | {filename, patch}' | jq -s . > /tmp/files.json
//   PR_TITLE="$(gh pr view 123 --json title -q .title)" \
//   PR_BODY="$(gh pr view 123 --json body -q .body)" \
//   CHANGED_FILES_JSON_PATH=/tmp/files.json node .github/scripts/check-pr-template.mjs
import { appendFileSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const TITLE_PREFIXES = ["FEAT", "FIX", "CHORE", "BALANCE"];

const REQUIRED_SECTIONS = [
  { name: "Summary", heading: /Summary/, minChars: 20 },
  {
    name: "Context / motivation",
    heading: /Context(?:\s*\/\s*motivation)?/,
    minChars: 20,
  },
  { name: "How to test", heading: /How to test/, minChars: 10 },
];

export const MIN_REASON_CHARS = 40;

const UI_FILE_PATTERNS = [
  /^src\/.*\.(tsx|css)$/,
  /^src\/assets\//,
  /^public\/.*\.(png|jpe?g|gif|webp|svg)$/i,
  /^src\/lib\/i18n\/dictionaries\/dictionary\.json$/,
  /^src\/features\/game\/lib\/style\.ts$/,
  // Phaser scenes, containers and shaders draw the world directly.
  /^src\/features\/.*\/(?:scenes|containers|shaders)\/.*\.ts$/,
  /^tailwind\.config\.js$/,
  /^index\.html$/,
];

// Icons are often wired up in plain .ts data files (buff definitions, item
// details), so adding, changing or removing a line that references art also
// counts as UI.
const ART_REFERENCE =
  /SUNNYSIDE\.|ITEM_DETAILS\b|from ["'](?:assets|public)\/|\.(?:png|webp|gif|jpe?g)["'`]|\b(?:icon|image)\s*:/;

const isTestFile = (file) => /\.test\.tsx?$/.test(file);

const touchesArtReference = (patch) =>
  (patch ?? "")
    .split("\n")
    .some((line) => /^[+-]/.test(line) && ART_REFERENCE.test(line));

/** @param {{ filename: string, patch?: string }} file */
export const isUiChange = ({ filename, patch }) => {
  if (isTestFile(filename)) return false;
  if (UI_FILE_PATTERNS.some((re) => re.test(filename))) return true;
  if (!/^src\/.*\.ts$/.test(filename)) return false;
  // GitHub omits the patch for very large diffs. Without it we can't rule out
  // an art change, so treat the file as UI and let the author declare it.
  if (patch === undefined) return true;
  return touchesArtReference(patch);
};

const NO_UI_CHECKBOX = /^\s*[-*]\s*\[[xX]\]\s*This PR does not change the UI/m;

const MEDIA_PATTERNS = [
  /!\[[^\]]*\]\(\s*<?([^)\s>]+)/g, // ![alt](url)
  /<(?:img|video|source)\b[^>]*\bsrc=["']([^"']+)["']/gi,
  /(https:\/\/github\.com\/user-attachments\/assets\/[\w-]+)/g,
  /(https:\/\/(?:private-)?user-images\.githubusercontent\.com\/[^\s)"'<>]+)/g,
  /(https?:\/\/[^\s)"'<>]+\.(?:png|jpe?g|gif|webp|mp4|mov|webm))/gi,
];

const stripComments = (text) => text.replace(/<!--[\s\S]*?-->/g, "");

export const countMedia = (text) => {
  const urls = new Set();
  for (const re of MEDIA_PATTERNS) {
    for (const match of text.matchAll(re)) urls.add(match[1]);
  }
  return urls.size;
};

/**
 * The text under the first heading whose title matches `title`, up to the next
 * heading of the same or a higher level. Returns null if there is no such
 * heading. Bare list markers left over from the template ("1.", "-") don't count.
 */
export const getSection = (text, title) => {
  const heading = new RegExp(
    `^(#{1,6})[ \\t]*${title.source}[ \\t]*:?[ \\t]*$`,
    "im",
  ).exec(text);
  if (!heading) return null;

  const level = heading[1].length;
  const rest = text.slice(heading.index + heading[0].length);
  const next = new RegExp(`^#{1,${level}}\\s`, "m").exec(rest);

  return (next ? rest.slice(0, next.index) : rest)
    .split("\n")
    .filter((line) => !/^\s*(?:\d+[.)]|[-*])?\s*$/.test(line))
    .join("\n")
    .trim();
};

/**
 * What's missing from the "Before / after" section. It must use the template's
 * table, and each of its four cells (Desktop/Mobile x Before/After) needs at
 * least one image or recording.
 * @param {string} section
 * @returns {string[]}
 */
export const getScreenshotGaps = (section) => {
  const rows = ["Desktop", "Mobile"].map((name) => ({
    name,
    line: section
      .split("\n")
      .find((l) => new RegExp(`^\\s*\\|\\s*${name}\\s*\\|`, "i").test(l)),
  }));

  if (rows.some((r) => r.line === undefined)) {
    return [
      "use the template's table, with a before and an after image in both the Desktop and Mobile rows",
    ];
  }

  const gaps = [];
  for (const { name, line } of rows) {
    // "| Desktop | <before> | <after> |" -> ["Desktop", "<before>", "<after>"]
    const cells = line
      .split("|")
      .slice(1)
      .map((c) => c.trim());
    [
      ["before", cells[1] ?? ""],
      ["after", cells[2] ?? ""],
    ].forEach(([when, cell]) => {
      if (countMedia(cell) === 0) gaps.push(`add the ${name} ${when} image`);
    });
  }
  return gaps;
};

/**
 * @param {{
 *   title: string | null | undefined,
 *   body: string | null | undefined,
 *   files: { filename: string, patch?: string }[],
 * }} pr
 * @returns {{ ok: boolean, uiFiles: string[], errors: string[], notes: string[] }}
 */
export const checkPrTemplate = ({ title, body, files }) => {
  const errors = [];
  const notes = [];
  const text = stripComments(body ?? "");

  const prefix = new RegExp(`^\\[(?:${TITLE_PREFIXES.join("|")})\\]\\s+\\S`);
  if (!prefix.test(title ?? "")) {
    errors.push(
      `Start the title with ${TITLE_PREFIXES.map((p) => `[${p}]`).join(", ")} followed by a description.`,
    );
  }

  for (const { name, heading, minChars } of REQUIRED_SECTIONS) {
    const section = getSection(text, heading);
    if (section === null) {
      errors.push(`Add the "## ${name}" section from the template.`);
    } else if (section.length < minChars) {
      errors.push(`Fill in "${name}".`);
    }
  }

  if (getSection(text, /Checklist/) === null) {
    errors.push(`Keep the "## Checklist" section from the template.`);
  }

  const uiFiles = files.filter(isUiChange).map((f) => f.filename);

  if (uiFiles.length === 0) {
    notes.push("No UI files changed.");
  } else if (NO_UI_CHECKBOX.test(text)) {
    notes.push(
      `"This PR does not change the UI" is ticked although ${uiFiles.length} UI file(s) changed. Reviewers: confirm it.`,
    );
  } else {
    const reason = getSection(text, /Why this UI change is needed/) ?? "";
    if (reason.length < MIN_REASON_CHARS) {
      errors.push(
        `UI files changed: tick "This PR does not change the UI", or fill in "Why this UI change is needed" with the problem players have and links to where several of them raised it.`,
      );
    }

    // Only screenshots in the "Before / after" section count, so unrelated
    // images elsewhere in the body can't stand in for them.
    const evidence = getScreenshotGaps(
      getSection(text, /Before\s*\/\s*after/) ?? "",
    );
    if (evidence.length > 0) {
      errors.push(
        `UI files changed: under "Before / after", ${evidence.join("; ")}. Or tick "This PR does not change the UI".`,
      );
    }
  }

  return { ok: errors.length === 0, uiFiles, errors, notes };
};

// CHANGED_FILES_JSON_PATH: a JSON array of { filename, patch } (the PR files
// API). CHANGED_FILES: newline-separated paths, for local runs without patches.
const readFiles = () => {
  if (process.env.CHANGED_FILES_JSON_PATH) {
    return JSON.parse(
      readFileSync(process.env.CHANGED_FILES_JSON_PATH, "utf8"),
    );
  }
  return (process.env.CHANGED_FILES ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((filename) => ({ filename }));
};

const main = () => {
  const result = checkPrTemplate({
    title: process.env.PR_TITLE,
    body: process.env.PR_BODY,
    files: readFiles(),
  });

  const lines = [
    "## PR template",
    "",
    result.ok
      ? "Passed."
      : "**Failed.** Edit the PR title or description and this check re-runs.",
    ...result.errors.map((e) => `- ${e}`),
    ...result.notes.map((n) => `- ${n}`),
    "",
    "See docs/PULL_REQUEST_TEMPLATE.md and docs/DESIGN_SYSTEM.md.",
  ];
  if (result.uiFiles.length > 0) {
    lines.push("", "<details><summary>UI files changed</summary>", "");
    lines.push(...result.uiFiles.map((f) => `- \`${f}\``), "", "</details>");
  }

  console.log(lines.join("\n"));
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join("\n") + "\n");
  }
  for (const error of result.errors) console.log(`::error::${error}`);
  for (const note of result.notes) console.log(`::notice::${note}`);

  process.exit(result.ok ? 0 : 1);
};

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) main();
