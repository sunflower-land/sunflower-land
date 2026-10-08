/**
 * Turn LLM-generated test scenarios into the sticky PR-preview comment.
 *
 * Run by .github/workflows/preview-deploy.yml on main's code:
 *
 *   NODE_PATH=./src NODE_ENV=metadata vite-node --project metadata/node.tsconfig.json \
 *     _scripts/preview/buildPreviewComment.ts \
 *     --scenarios .preview/scenarios.json \
 *     --base https://<bucket>.s3.<region>.amazonaws.com/pr-123/index.html \
 *     --pr 123 --head <sha> --out .preview/comment.md
 *
 * Every scenario is checked against the patch format and main's item lists.
 * Hard failures (bad shape, bad route, invalid time token, oversized patch,
 * patch that cannot be applied) drop the scenario; soft problems (unknown
 * item or wearable name, unknown top-level key — which a PR may legitimately
 * introduce) keep it with a warning. URLs are always built here, never taken
 * from the model. The script never exits non-zero: with no usable scenarios
 * the comment still carries the bare preview link.
 */
import { readFileSync, writeFileSync } from "fs";

// Relative imports: tsconfig path aliases only resolve inside src/.
import {
  applyPatch,
  buildPreviewLink,
  encodeJsonParam,
  isPlainObject,
  isTimeToken,
} from "../../src/features/game/lib/preview/previewLink";
import {
  PREVIEW_FIXTURES,
  PREVIEW_FIXTURE_NAMES,
} from "../../src/features/game/lib/preview/previewState";
import { KNOWN_IDS } from "../../src/features/game/types";
import { ITEM_IDS } from "../../src/features/game/types/bumpkin";

const MAX_SCENARIOS = 6;
const MAX_STEPS = 8;
const MAX_TITLE = 80;
const MAX_ENCODED_PATCH = 6000;
const ROUTE = /^\/[A-Za-z0-9_\-/]*$/;

type Scenario = {
  title: string;
  why: string;
  route: string;
  fixture: string;
  patch: Record<string, unknown>;
  localStorage?: Record<string, unknown>;
  steps: string[];
};

type Validated = {
  scenario: Scenario;
  url: string;
  warnings: string[];
};

type Rejected = { title: string; reason: string };

// --- CLI -------------------------------------------------------------------

function arg(name: string, fallback?: string): string {
  const index = process.argv.indexOf(`--${name}`);
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  if (value === undefined) {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing --${name}`);
  }
  return value;
}

const scenariosPath = arg("scenarios");
const base = arg("base");
const prNumber = arg("pr");
const headSha = arg("head", "");
const outPath = arg("out");

// --- validation --------------------------------------------------------------

const KNOWN_STATE_KEYS = new Set(
  Object.values(PREVIEW_FIXTURES).flatMap((factory) => Object.keys(factory())),
);

const str = (value: unknown, max: number): string | undefined =>
  typeof value === "string" && value.trim() && value.length <= max
    ? value.trim()
    : undefined;

/** Walk a patch: reject malformed `$` tokens, collect name warnings. */
function inspectPatch(
  value: unknown,
  path: string[],
  warnings: string[],
): string | undefined {
  if (typeof value === "string") {
    if (value.startsWith("$") && !isTimeToken(value)) {
      return `invalid time token "${value}" at ${path.join(".")}`;
    }
    if (
      path.length >= 2 &&
      path[path.length - 2] === "equipped" &&
      !(value in ITEM_IDS)
    ) {
      warnings.push(`unknown wearable "${value}" at ${path.join(".")}`);
    }
    return undefined;
  }

  if (Array.isArray(value)) {
    for (const [index, item] of value.entries()) {
      const error = inspectPatch(item, [...path, String(index)], warnings);
      if (error) return error;
    }
    return undefined;
  }

  if (!isPlainObject(value)) return undefined;

  const parent = path[path.length - 1];
  for (const [key, item] of Object.entries(value)) {
    if (
      (parent === "inventory" || parent === "previousInventory") &&
      !(key in KNOWN_IDS)
    ) {
      warnings.push(`unknown item "${key}" in ${path.join(".")}`);
    }
    if (parent === "wardrobe" && !(key in ITEM_IDS)) {
      warnings.push(`unknown wearable "${key}" in ${path.join(".")}`);
    }
    const error = inspectPatch(item, [...path, key], warnings);
    if (error) return error;
  }

  return undefined;
}

function validate(raw: unknown, index: number): Validated | Rejected {
  const label = `scenario ${index + 1}`;
  if (!isPlainObject(raw)) return { title: label, reason: "not an object" };

  const title = str(raw.title, MAX_TITLE) ?? label;
  const why = str(raw.why, 400);
  const route = typeof raw.route === "string" ? raw.route.trim() : "/";
  const fixture =
    typeof raw.fixture === "string" && raw.fixture ? raw.fixture : "default";
  const patch = raw.patch ?? {};
  const localStorage = raw.localStorage;
  const steps = Array.isArray(raw.steps)
    ? raw.steps.filter((s): s is string => typeof s === "string" && !!s.trim())
    : [];

  if (!why) return { title, reason: "missing `why`" };
  if (!ROUTE.test(route) || route.includes("//")) {
    return { title, reason: `invalid route "${route}"` };
  }
  if (!PREVIEW_FIXTURES[fixture]) {
    return {
      title,
      reason: `unknown fixture "${fixture}" (known: ${PREVIEW_FIXTURE_NAMES.join(", ")})`,
    };
  }
  if (!isPlainObject(patch))
    return { title, reason: "`patch` is not an object" };
  if (localStorage !== undefined && !isPlainObject(localStorage)) {
    return { title, reason: "`localStorage` is not an object" };
  }
  if (steps.length === 0) return { title, reason: "no steps" };

  const warnings: string[] = [];

  for (const key of Object.keys(patch)) {
    if (!KNOWN_STATE_KEYS.has(key)) {
      warnings.push(`unknown top-level state key "${key}" (new in this PR?)`);
    }
  }

  const tokenError =
    inspectPatch(patch, ["patch"], warnings) ??
    (localStorage
      ? inspectPatch(localStorage, ["localStorage"], [])
      : undefined);
  if (tokenError) return { title, reason: tokenError };

  const encoded = encodeJsonParam(patch);
  if (encoded.length > MAX_ENCODED_PATCH) {
    return {
      title,
      reason: `patch too large (${encoded.length} chars encoded, max ${MAX_ENCODED_PATCH})`,
    };
  }

  try {
    applyPatch(PREVIEW_FIXTURES[fixture](), patch, Date.now());
  } catch (error) {
    return {
      title,
      reason: `patch failed to apply: ${error instanceof Error ? error.message : String(error)}`,
    };
  }

  const url = buildPreviewLink({
    base,
    route,
    fixture: fixture === "default" ? undefined : fixture,
    patch,
    localStorage: localStorage as Record<string, unknown> | undefined,
  });

  return {
    scenario: {
      title,
      why,
      route,
      fixture,
      patch,
      localStorage: localStorage as Record<string, unknown> | undefined,
      steps: steps.slice(0, MAX_STEPS).map((s) => s.trim()),
    },
    url,
    warnings,
  };
}

// --- markdown ----------------------------------------------------------------

const escapeCell = (value: string) =>
  value.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");

function render({
  summary,
  valid,
  rejected,
  generatorNote,
}: {
  summary?: string;
  valid: Validated[];
  rejected: Rejected[];
  generatorNote?: string;
}): string {
  const short = headSha ? headSha.slice(0, 7) : "";
  const lines: string[] = [
    "### 🔍 PR preview",
    "",
    `**${base}** — UI-only build${short ? ` of ${short}` : ""} (no server, offline farm). ` +
      `Add \`?fixture=test\` or \`?patch=…\` to shape the state; run \`__sflPreview.link()\` in the console to share the state you are looking at.`,
    "",
  ];

  if (summary) lines.push(`> ${escapeCell(summary)}`, "");

  if (valid.length) {
    lines.push("#### Test scenarios", "");
    valid.forEach(({ scenario, url, warnings }, index) => {
      lines.push(
        `**${index + 1}. [${escapeCell(scenario.title)}](${url})** — ${escapeCell(scenario.why)}`,
      );
      scenario.steps.forEach((step, stepIndex) =>
        lines.push(`   ${stepIndex + 1}. ${escapeCell(step)}`),
      );
      if (warnings.length) {
        lines.push(`   ⚠️ ${warnings.map(escapeCell).join("; ")}`);
      }
      lines.push("");
    });
  } else {
    lines.push(
      generatorNote ?? "_No test scenarios were generated for this change._",
      "",
    );
  }

  if (rejected.length) {
    lines.push(
      "<details><summary>Dropped scenarios</summary>",
      "",
      ...rejected.map(
        (r) => `- **${escapeCell(r.title)}**: ${escapeCell(r.reason)}`,
      ),
      "",
      "</details>",
      "",
    );
  }

  lines.push(
    "<sub>Scenarios are drafted by an LLM from the diff and checked against main's item lists; the state loads client-side only. " +
      "Links die when the PR closes. See docs/PR_PREVIEWS.md.</sub>",
  );

  return lines.join("\n");
}

// --- main --------------------------------------------------------------------

function main() {
  let summary: string | undefined;
  let rawScenarios: unknown[] = [];
  let generatorNote: string | undefined;

  try {
    const parsed: unknown = JSON.parse(readFileSync(scenariosPath, "utf8"));
    if (isPlainObject(parsed)) {
      summary = str(parsed.summary, 600);
      rawScenarios = Array.isArray(parsed.scenarios) ? parsed.scenarios : [];
    } else {
      generatorNote =
        "_Scenario generator returned something that was not an object._";
    }
  } catch (error) {
    generatorNote = `_Scenario generation did not produce a result (${
      error instanceof Error ? error.message.split("\n")[0] : String(error)
    })._`;
  }

  const valid: Validated[] = [];
  const rejected: Rejected[] = [];

  rawScenarios.slice(0, MAX_SCENARIOS).forEach((raw, index) => {
    const result = validate(raw, index);
    if ("url" in result) valid.push(result);
    else rejected.push(result);
  });
  rawScenarios.slice(MAX_SCENARIOS).forEach((_, index) =>
    rejected.push({
      title: `scenario ${MAX_SCENARIOS + index + 1}`,
      reason: `over the limit of ${MAX_SCENARIOS} scenarios`,
    }),
  );

  const markdown = render({ summary, valid, rejected, generatorNote });
  writeFileSync(outPath, markdown);

  // eslint-disable-next-line no-console
  console.log(
    `PR #${prNumber}: ${valid.length} scenario(s) accepted, ${rejected.length} dropped → ${outPath}`,
  );
}

main();
