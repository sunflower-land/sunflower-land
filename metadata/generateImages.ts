import crypto from "crypto";
import fs from "fs";
import path from "path";
import https from "https";
import sharp from "sharp";

import { InventoryItemName } from "features/game/types/game";
import { KNOWN_IDS } from "features/game/types";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "lib/object";
import { OPEN_SEA_COLLECTIBLES } from "./metadata";

/**
 * Statically parse the keys of `COLLECTIBLE_BUFF_LABELS` instead of importing
 * the module. The runtime module pulls in browser-only analytics through its
 * dependency graph (`completeNPCChore` → `trackAnalytics` → `gameanalytics`),
 * which crashes under Node because `window` is not defined.
 */
function loadBoostedItemNames(): Set<string> {
  const SRC_PATH = "src/features/game/types/collectibleItemBuffs.ts";
  const src = fs.readFileSync(SRC_PATH, "utf8");
  const start = src.indexOf("COLLECTIBLE_BUFF_LABELS");
  if (start === -1)
    throw new Error(
      `Could not find COLLECTIBLE_BUFF_LABELS declaration in ${SRC_PATH} — ` +
        `the parser's assumptions no longer match the source file. Boost ` +
        `overlays would be dropped from every regenerated image.`,
    );
  // Skip over the type annotation to the `=` that terminates it, then the
  // first `{` after. A naive `indexOf("{")` hits the `{ skills, collectibles }`
  // destructuring inside the type annotation.
  const eqIdx = src.indexOf("> =", start);
  if (eqIdx === -1)
    throw new Error(
      `Could not find "> =" after COLLECTIBLE_BUFF_LABELS in ${SRC_PATH}. ` +
        `The type annotation shape likely changed; update the parser.`,
    );
  const braceOpen = src.indexOf("{", eqIdx);
  let depth = 0;
  let braceClose = -1;
  for (let i = braceOpen; i < src.length; i++) {
    const c = src[i];
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        braceClose = i;
        break;
      }
    }
  }
  if (braceClose === -1)
    throw new Error(
      `Unbalanced braces in COLLECTIBLE_BUFF_LABELS object literal.`,
    );
  const body = src.slice(braceOpen + 1, braceClose);

  const names = new Set<string>();
  let d = 0;
  const topLevel: string[] = [];
  let lineStart = 0;
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (c === "{" || c === "[" || c === "(") d++;
    else if (c === "}" || c === "]" || c === ")") d--;
    if (d === 0 && c === ",") {
      topLevel.push(body.slice(lineStart, i));
      lineStart = i + 1;
    }
  }
  topLevel.push(body.slice(lineStart));

  for (const entry of topLevel) {
    // Keys can be either quoted (`"Scary Mike":`) or bare identifiers
    // (`Blossombeard:`). Double- and single-quoted forms get their own
    // branches so that `"Fisher's Hourglass"` — a double-quoted key
    // containing an apostrophe — doesn't terminate at the `'` (which it
    // would if we used a single combined `[^"']+` class).
    const m = entry.match(
      /^\s*(?:\/\/[^\n]*\n|\/\*[\s\S]*?\*\/|\s)*(?:"([^"]+)"|'([^']+)'|([A-Za-z_$][\w$]*))\s*:/,
    );
    if (m) names.add(m[1] ?? m[2] ?? m[3]);
  }
  if (names.size === 0)
    throw new Error(
      `Parsed 0 entries from COLLECTIBLE_BUFF_LABELS in ${SRC_PATH}. ` +
        `This would silently drop every boost overlay — refusing to proceed.`,
    );
  return names;
}
const BOOSTED_ITEMS = loadBoostedItemNames();

const TARGET_SIZE = 1920;
// Items are fit into a centered square ≈1/6 of the total area (1/√6 ≈ 0.408
// linear). This normalizes visual size across items regardless of how much
// transparent padding their source sprites have.
const CONTENT_SIZE = 784;
const BG_PATH = "public/erc1155/images/3x3_bg.png";
const BOOST_PATH = "public/erc1155/images/boost.png";
const OUT_DIR = "public/erc1155/images";
const MANIFEST_PATH = path.join(OUT_DIR, ".manifest.json");

type ManifestItem = { sourceHash: string; boosted: boolean };
type Manifest = {
  // Fingerprint of anything that, if changed, requires regenerating every
  // image: the background, the boost overlay, and the two size constants.
  // When the pipeline fingerprint differs from disk, every item is treated
  // as stale — no need to track pipeline-level changes per-item.
  pipeline: string;
  items: Record<string, ManifestItem>;
};

const sha256 = (buf: Buffer | string): string =>
  crypto.createHash("sha256").update(buf).digest("hex");

// Bump the suffix when pipeline semantics change (output format, scaling
// model, etc.) — the manifest will invalidate and every image regenerates.
const PIPELINE_VERSION = "webp-v1";

function computePipelineFingerprint(): string {
  return sha256(
    Buffer.concat([
      fs.readFileSync(BG_PATH),
      fs.readFileSync(BOOST_PATH),
      Buffer.from(`${TARGET_SIZE}:${CONTENT_SIZE}:${PIPELINE_VERSION}`),
    ]),
  );
}

function loadManifest(currentPipeline: string): Manifest {
  if (!fs.existsSync(MANIFEST_PATH))
    return { pipeline: currentPipeline, items: {} };
  try {
    const raw = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")) as Manifest;
    // Stale pipeline → drop all per-item entries so every item is regenerated.
    if (raw.pipeline !== currentPipeline)
      return { pipeline: currentPipeline, items: {} };
    return raw;
  } catch {
    return { pipeline: currentPipeline, items: {} };
  }
}

const PIPELINE_FINGERPRINT = computePipelineFingerprint();
const MANIFEST = loadManifest(PIPELINE_FINGERPRINT);

type Outcome =
  | {
      name: InventoryItemName;
      ok: true;
      out: string;
      boosted: boolean;
    }
  | { name: InventoryItemName; ok: false; reason: string };

const fetchBuffer = (url: string): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`Failed to fetch ${url}: ${res.statusCode}`));
          return;
        }
        const chunks: Buffer[] = [];
        res.on("data", (c: Buffer) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });

async function loadSource(raw: unknown): Promise<Buffer | null> {
  if (typeof raw !== "string" || raw.length === 0) return null;
  if (raw.startsWith("http")) return fetchBuffer(raw);
  const p = raw.startsWith("/") ? raw.slice(1) : raw;
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p);
}

/**
 * Upscale the 48×48 background to 1920×1920 with nearest-neighbor.
 * Cached so we only pay the cost once per run.
 */
let cachedBg: Buffer | null = null;
async function getBackground(): Promise<Buffer> {
  if (cachedBg) return cachedBg;
  cachedBg = await sharp(BG_PATH)
    .resize(TARGET_SIZE, TARGET_SIZE, { kernel: sharp.kernel.nearest })
    .png()
    .toBuffer();
  return cachedBg;
}

/**
 * boost.png ships at 1920×1920 with the lightning bolt pre-positioned, so
 * we composite it directly without any resizing.
 */
let cachedBoost: Buffer | null = null;
function getBoost(): Buffer {
  if (cachedBoost) return cachedBoost;
  cachedBoost = fs.readFileSync(BOOST_PATH);
  return cachedBoost;
}

/**
 * Unified compose path for both static and animated sources. Relies on
 * sharp's native multi-page handling:
 *
 *   sharp(source, { animated: true })     - all frames loaded, pageHeight tracked
 *     .resize(newW, newH, { nearest })    - scales each page independently
 *     .extend({ ... })                    - pads each page to TARGET_SIZE
 *     .composite(<tiled bg + boost>)      - see below
 *     .webp()                             - emits animated WebP when pages > 1
 *
 * Tiling: sharp's composite places a static overlay at a single (top, left)
 * position in the internal tall buffer — which means a single bg overlay at
 * (0,0) only covers the FIRST frame on an animated pipeline. To cover every
 * frame we push one overlay per page at `top = i * TARGET_SIZE`. Same for
 * the boost overlay.
 *
 * Static sources also get `.trim()` applied first so items with built-in
 * padding end up the same visual size as items without. We skip trim for
 * animated sources because per-frame trim produces different extents per
 * page and breaks animation coherence.
 */
async function composeItem(
  source: Buffer,
  boosted: boolean,
  outPath: string,
): Promise<void> {
  const probe = await sharp(source, { animated: true }).metadata();
  const numFrames = probe.pages ?? 1;
  const isAnimated = numFrames > 1;

  const inputBuffer = isAnimated
    ? source
    : await sharp(source).trim().png().toBuffer();

  const meta = isAnimated ? probe : await sharp(inputBuffer).metadata();
  const srcW = meta.width ?? 1;
  const srcH = isAnimated
    ? (meta.pageHeight ?? meta.height ?? 1)
    : (meta.height ?? 1);
  const scale = Math.max(
    1,
    Math.floor(Math.min(CONTENT_SIZE / srcW, CONTENT_SIZE / srcH)),
  );
  const newW = srcW * scale;
  const newH = srcH * scale;
  const left = Math.floor((TARGET_SIZE - newW) / 2);
  const right = TARGET_SIZE - newW - left;
  const top = Math.floor((TARGET_SIZE - newH) / 2);
  const bottom = TARGET_SIZE - newH - top;

  const bg = await getBackground();
  const boost = boosted ? getBoost() : null;
  const overlays: sharp.OverlayOptions[] = [];
  for (let i = 0; i < numFrames; i++) {
    const yOffset = i * TARGET_SIZE;
    overlays.push({
      input: bg,
      top: yOffset,
      left: 0,
      blend: "dest-over",
    });
    if (boost) {
      overlays.push({
        input: boost,
        top: yOffset,
        left: 0,
        blend: "over",
      });
    }
  }

  await sharp(inputBuffer, isAnimated ? { animated: true } : {})
    .resize(newW, newH, { kernel: sharp.kernel.nearest })
    .extend({
      top,
      bottom,
      left,
      right,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .composite(overlays)
    .webp({ lossless: true, quality: 100, loop: 0 })
    .toFile(outPath);
}

async function generateImage(
  name: InventoryItemName,
  force: boolean,
): Promise<Outcome> {
  try {
    const id = KNOWN_IDS[name];
    if (id === undefined) return { name, ok: false, reason: "no KNOWN_ID" };

    const detail = (ITEM_DETAILS as Record<string, { image?: unknown }>)[name];
    const source = await loadSource(detail?.image);
    if (!source) return { name, ok: false, reason: "no source image" };

    const sourceHash = sha256(source);
    const boosted = BOOSTED_ITEMS.has(name);
    const outPath = path.join(OUT_DIR, `${id}.webp`);

    // Skip only when: output exists on disk AND the manifest entry matches
    // *both* the current source bytes and the current boost status. Either a
    // sprite edit OR flipping the item's entry in COLLECTIBLE_BUFF_LABELS
    // changes the fingerprint and forces a regen.
    const prior = MANIFEST.items[name];
    if (
      !force &&
      fs.existsSync(outPath) &&
      prior?.sourceHash === sourceHash &&
      prior?.boosted === boosted
    ) {
      return { name, ok: false, reason: "unchanged" };
    }

    await composeItem(source, boosted, outPath);

    MANIFEST.items[name] = { sourceHash, boosted };
    return { name, ok: true, out: outPath, boosted };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { name, ok: false, reason: `error: ${msg}` };
  }
}

export const generateImages = async () => {
  const allNames = getKeys(OPEN_SEA_COLLECTIBLES);
  const rawArgs = process.argv.slice(2);
  // --force / -f regenerates every image. By default we skip any item whose
  // output file already exists — this keeps CI runs fast when only a handful
  // of sprites changed.
  const force = rawArgs.includes("--force") || rawArgs.includes("-f");
  const nameArgs = rawArgs.filter((a) => !a.startsWith("-"));
  const targets =
    nameArgs.length > 0
      ? allNames.filter((n) => nameArgs.includes(n as string))
      : allNames;

  if (nameArgs.length > 0 && targets.length === 0) {
    // eslint-disable-next-line no-console
    console.log(`No matches for: ${nameArgs.join(", ")}`);
    return;
  }

  const outcomes: Outcome[] = [];
  const concurrency = 8;
  for (let i = 0; i < targets.length; i += concurrency) {
    const batch = targets.slice(i, i + concurrency);
    const results = await Promise.all(
      batch.map((n) => generateImage(n, force)),
    );
    outcomes.push(...results);
  }

  // Persist the updated manifest so the next run can short-circuit items that
  // haven't changed. Entries for non-target items are preserved as-is.
  // Single-line to match the compact format used for sibling JSON outputs.
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(MANIFEST) + "\n", "utf8");

  const ok = outcomes.filter((o): o is Extract<Outcome, { ok: true }> => o.ok);
  const skipped = outcomes.filter(
    (o): o is Extract<Outcome, { ok: false }> => !o.ok,
  );
  const boostedCount = ok.filter((o) => o.boosted).length;

  // eslint-disable-next-line no-console
  console.log(
    `Generated ${ok.length}/${outcomes.length} (${boostedCount} with boost overlay)`,
  );

  if (skipped.length > 0) {
    const byReason = new Map<string, string[]>();
    for (const s of skipped) {
      const list = byReason.get(s.reason) ?? [];
      list.push(s.name);
      byReason.set(s.reason, list);
    }
    // eslint-disable-next-line no-console
    console.log(`\nSkipped (${skipped.length}):`);
    for (const [reason, items] of byReason) {
      // eslint-disable-next-line no-console
      console.log(`  [${items.length}] ${reason}`);
      if (items.length <= 12) {
        // eslint-disable-next-line no-console
        console.log(`       ${items.join(", ")}`);
      }
    }
  }
};

generateImages().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
