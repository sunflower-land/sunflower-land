// Regression cases for check-pr-template.mjs. No dependencies; run with:
//   node --test .github/scripts/check-pr-template.cases.mjs
// (Not named *.test.mjs so the app's jest run doesn't pick it up.)
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  checkPrTemplate,
  getScreenshotGaps,
  isUiChange,
} from "./check-pr-template.mjs";

const TEMPLATE = readFileSync(
  new URL("../../docs/PULL_REQUEST_TEMPLATE.md", import.meta.url),
  "utf8",
);

const img = (n) => `![s](https://github.com/user-attachments/assets/img-${n})`;

const table = ({ db = img(1), da = img(2), mb = img(3), ma = img(4) } = {}) =>
  `| | Before | After |\n| --- | --- | --- |\n| Desktop | ${db} | ${da} |\n| Mobile | ${mb} | ${ma} |`;

const filled = (overrides = {}) => {
  let body = TEMPLATE.replace(
    "## Summary\n\n",
    "## Summary\n\nHides the base Bale row when Double Bale already shows it.\n\n",
  )
    .replace(
      "## Context / motivation\n\n",
      "## Context / motivation\n\nPlayers reported the same boost twice in the modal.\n\n",
    )
    .replace("1.\n2.\n", "1. Open a cow with Double Bale\n2. See one row\n");
  if (overrides.reason) {
    body = body.replace(
      "### Why this UI change is needed\n\n",
      "### Why this UI change is needed\n\nSeveral players asked for this in #feedback: https://discord.com/channels/1/2 and #7001.\n\n",
    );
  }
  if (overrides.table !== undefined) {
    body = body.replace(
      /\| {9}\| Before \| After \|\n\| -+ \| -+ \| -+ \|\n\| Desktop \|.*\|\n\| Mobile {2}\|.*\|/,
      overrides.table,
    );
  }
  if (overrides.noUi) {
    body = body.replace(
      "- [ ] This PR does not change the UI",
      "- [x] This PR does not change the UI",
    );
  }
  return body;
};

const UI = [{ filename: "src/components/ui/Label.tsx" }];
const LOGIC = [{ filename: "src/features/game/lib/animals.ts" }];
const check = (body, files = UI, title = "[FIX] Something") =>
  checkPrTemplate({ title, body, files });

test("untouched template fails on the required sections", () => {
  const { ok, errors } = check(TEMPLATE, LOGIC);
  assert.equal(ok, false);
  assert.ok(errors.some((e) => e.includes("Summary")));
});

test("filled-in template with no UI files passes", () => {
  assert.equal(check(filled(), LOGIC).ok, true);
});

test("title without a prefix fails", () => {
  assert.equal(check(filled(), LOGIC, "fix something").ok, false);
});

test("deleting the Checklist fails", () => {
  assert.equal(check(filled().split("## Checklist")[0], LOGIC).ok, false);
});

test("UI change with the no-UI box ticked passes", () => {
  assert.equal(check(filled({ noUi: true })).ok, true);
});

test("UI change with reason and all four cells filled passes", () => {
  assert.equal(check(filled({ reason: true, table: table() })).ok, true);
});

test("UI change without a reason fails", () => {
  assert.equal(check(filled({ table: table() })).ok, false);
});

test("images in each Before cell but empty After cells fail", () => {
  const gaps = getScreenshotGaps(
    table({ db: img(1) + img(2), da: "", mb: img(3) + img(4), ma: "" }),
  );
  assert.deepEqual(gaps, [
    "add the Desktop after image",
    "add the Mobile after image",
  ]);
});

test("four desktop images with an empty Mobile row fail", () => {
  const gaps = getScreenshotGaps(
    table({ db: img(1) + img(2), da: img(3) + img(4), mb: "", ma: "" }),
  );
  assert.deepEqual(gaps, [
    "add the Mobile before image",
    "add the Mobile after image",
  ]);
});

test("a free-form layout without the table fails", () => {
  const gaps = getScreenshotGaps(
    `Desktop: ${img(1)} ${img(2)}\nMobile: ${img(3)} ${img(4)}`,
  );
  assert.equal(gaps.length, 1);
  assert.match(gaps[0], /template's table/);
});

test("images outside Before / after don't count", () => {
  const body = filled({ reason: true }).replace(
    "## Related issues\n",
    `## Related issues\n\n${img(1)}${img(2)}${img(3)}${img(4)}\n`,
  );
  assert.equal(check(body).ok, false);
});

test("UI file detection", () => {
  const cases = [
    [{ filename: "src/features/world/scenes/PlazaScene.ts" }, true],
    [{ filename: "src/features/world/scenes/foo.test.ts" }, false],
    [
      {
        filename: "src/features/game/types/buffs.ts",
        patch: "-    icon: SUNNYSIDE.icons.lightning,",
      },
      true,
    ],
    [
      {
        filename: "src/features/game/types/items.ts",
        patch: '+  image: ITEM_DETAILS["Sunflower"].image,',
      },
      true,
    ],
    [
      {
        filename: "src/features/game/lib/animals.ts",
        patch: "+const a = 2;",
      },
      false,
    ],
  ];
  for (const [file, expected] of cases) {
    assert.equal(isUiChange(file), expected, file.filename);
  }
});
