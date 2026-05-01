import crypto from "crypto";
import fs from "fs";
import path from "path";
import https from "https";
import sharp from "sharp";

import { InventoryItemName } from "features/game/types/game";
import { KNOWN_IDS } from "features/game/types";
import { ITEM_DETAILS } from "features/game/types/images";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { getKeys } from "lib/object";
import { OPEN_SEA_COLLECTIBLES, OPEN_SEA_WEARABLES } from "./metadata";

/**
 * Statically parse the keys of a buff-label object instead of importing the
 * runtime module. The runtime modules pull in browser-only analytics through
 * their dependency graph (`completeNPCChore` → `trackAnalytics` →
 * `gameanalytics`), which crashes under Node because `window` is not defined.
 */
function parseBuffLabelKeys(srcPath: string, constName: string): Set<string> {
  const src = fs.readFileSync(srcPath, "utf8");
  const start = src.indexOf(constName);
  if (start === -1)
    throw new Error(
      `Could not find ${constName} declaration in ${srcPath} — ` +
        `the parser's assumptions no longer match the source file. Boost ` +
        `overlays would be dropped from every regenerated image.`,
    );
  // Skip over the type annotation to the `=` that terminates it, then the
  // first `{` after. A naive `indexOf("{")` hits the `{ skills, collectibles }`
  // destructuring inside the type annotation.
  const eqIdx = src.indexOf("> =", start);
  if (eqIdx === -1)
    throw new Error(
      `Could not find "> =" after ${constName} in ${srcPath}. ` +
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
    throw new Error(`Unbalanced braces in ${constName} object literal.`);
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
  return names;
}

function loadBoostedItemNames(): Set<string> {
  const SRC_PATH = "src/features/game/types/collectibleItemBuffs.ts";
  const names = parseBuffLabelKeys(SRC_PATH, "COLLECTIBLE_BUFF_LABELS");
  if (names.size === 0)
    throw new Error(
      `Parsed 0 entries from COLLECTIBLE_BUFF_LABELS in ${SRC_PATH}. ` +
        `This would silently drop every boost overlay — refusing to proceed.`,
    );
  return names;
}

function loadBoostedWearableNames(): Set<string> {
  // Wearable buffs live in two top-level objects in the same file:
  //   SPECIAL_ITEM_LABELS — a few hand-coded items (Halo, Gift Giver, …)
  //   BUMPKIN_ITEM_BUFF_LABELS — the main set, which spreads in
  //     SPECIAL_ITEM_LABELS plus a Date.now()-gated chapter-ticket spread.
  // Parse both objects and union their top-level keys; the chapter-ticket
  // spread is intentionally ignored because it's time-bound and would flip
  // boost status on every chapter boundary, churning every wearable image.
  const SRC_PATH = "src/features/game/types/bumpkinItemBuffs.ts";
  const main = parseBuffLabelKeys(SRC_PATH, "BUMPKIN_ITEM_BUFF_LABELS");
  const special = parseBuffLabelKeys(SRC_PATH, "SPECIAL_ITEM_LABELS");
  const names = new Set<string>([...main, ...special]);
  if (names.size === 0)
    throw new Error(
      `Parsed 0 entries from BUMPKIN_ITEM_BUFF_LABELS / SPECIAL_ITEM_LABELS ` +
        `in ${SRC_PATH}. This would silently drop every boost overlay — ` +
        `refusing to proceed.`,
    );
  return names;
}

const BOOSTED_ITEMS = loadBoostedItemNames();
const BOOSTED_WEARABLES = loadBoostedWearableNames();

const TARGET_SIZE = 1920;
// Items are fit into a centered square ≈1/6 of the total area (1/√6 ≈ 0.408
// linear). This normalizes visual size across items regardless of how much
// transparent padding their source sprites have.
const CONTENT_SIZE = 784;
const BG_PATH = "public/erc1155/images/3x3_bg.png";
const BOOST_PATH = "public/erc1155/images/boost.png";
const OUT_DIR = "public/erc1155/images";
const MANIFEST_PATH = path.join(OUT_DIR, ".manifest.json");

// Wearable pipeline — see `processWearables` below. We don't regenerate
// wearable images from source; the team uploads them directly. We only
// stamp / unstamp the boost icon when buff status changes.
const WEARABLES_DIR = "public/wearables/images";
const WEARABLES_BOOST_PATH = "public/wearables/images/boost_1024x.png";
const WEARABLES_MANIFEST_PATH = path.join(WEARABLES_DIR, ".manifest.json");
// Pre-stamp backups of team-uploaded wearable images. Lives outside
// `public/` so it's not served, but git-tracked so a future run on a fresh
// checkout can still restore the clean original when a buff is removed.
const WEARABLE_ORIGINALS_DIR = "metadata/wearable-originals";

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

function loadManifest(manifestPath: string, currentPipeline: string): Manifest {
  if (!fs.existsSync(manifestPath))
    return { pipeline: currentPipeline, items: {} };
  try {
    const raw = JSON.parse(fs.readFileSync(manifestPath, "utf8")) as Manifest;
    // Stale pipeline → drop all per-item entries so every item is regenerated.
    if (raw.pipeline !== currentPipeline)
      return { pipeline: currentPipeline, items: {} };
    return raw;
  } catch {
    return { pipeline: currentPipeline, items: {} };
  }
}

const PIPELINE_FINGERPRINT = computePipelineFingerprint();
const MANIFEST = loadManifest(MANIFEST_PATH, PIPELINE_FINGERPRINT);

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

// ---------------------------------------------------------------------------
// Wearable boost stamping
//
// Unlike collectibles, wearable images are uploaded directly by the art team
// to public/wearables/images/{id}.{png,webp}. We don't regenerate them from a
// source sprite — we just stamp the pre-positioned boost icon onto a copy of
// the team's upload when the wearable's buff status flips on, and re-stamp
// fresh whenever they re-upload a clean version.
//
// Quality preservation: the stamp pipeline reads the existing image, runs a
// single lossless re-encode in sharp (PNG is lossless by default; WebP is
// re-encoded with `lossless: true`), and writes back to the same path.
// Adding the boost icon never touches the wearable's underlying pixels —
// only the alpha-composite of the pre-positioned overlay is applied on top.
//
// State tracking: the manifest stores the hash of the *last clean upload*
// per wearable, plus whether the on-disk file currently has the boost
// stamp. On each run we hash the on-disk file:
//   - if it matches `cleanHash` → it's a clean upload; stamp if boosted
//   - if it matches `stampedHash` → no change since last run; skip
//   - otherwise → treat as a fresh clean upload
//
// Buff removal: before stamping we copy the team's clean upload to
// `metadata/wearable-originals/{id}.{ext}`. When a buff is later removed,
// we restore that backup back to `public/wearables/images/` and delete it.
// The backup directory is committed alongside the manifest so a fresh CI
// checkout still has the clean originals available.
// ---------------------------------------------------------------------------

type WearableManifestItem = {
  // Hash of the team's clean (un-stamped) upload — used to skip when an
  // unboosted item is unchanged, and is the source bytes restored from the
  // originals/ backup on buff removal. Absent when the on-disk file the
  // team uploaded already had the icon baked in (see "already-stamped"
  // detection in processWearable) — in that case we have a stampedHash but
  // no clean bytes to fall back to.
  cleanHash?: string;
  stampedHash?: string;
  boosted: boolean;
};
type WearableManifest = {
  pipeline: string;
  items: Record<string, WearableManifestItem>;
};

type WearableOutcome =
  | {
      name: BumpkinItem;
      ok: true;
      out: string;
      boosted: boolean;
      action:
        | "stamped"
        | "already-stamped"
        | "restored"
        | "left-unboosted"
        | "skipped";
    }
  | { name: BumpkinItem; ok: false; reason: string };

const WEARABLE_PIPELINE_VERSION = "wearable-stamp-v1";

function computeWearablePipelineFingerprint(): string {
  return sha256(
    Buffer.concat([
      fs.readFileSync(WEARABLES_BOOST_PATH),
      Buffer.from(WEARABLE_PIPELINE_VERSION),
    ]),
  );
}

function loadWearableManifest(currentPipeline: string): WearableManifest {
  if (!fs.existsSync(WEARABLES_MANIFEST_PATH))
    return { pipeline: currentPipeline, items: {} };
  try {
    const raw = JSON.parse(
      fs.readFileSync(WEARABLES_MANIFEST_PATH, "utf8"),
    ) as WearableManifest;
    if (raw.pipeline !== currentPipeline)
      return { pipeline: currentPipeline, items: {} };
    return raw;
  } catch {
    return { pipeline: currentPipeline, items: {} };
  }
}

function findWearableFile(
  id: number,
): { path: string; ext: "png" | "webp" } | null {
  // Prefer png — it's the format the team has been uploading historically.
  // Match `generateMetadata.ts`'s `wearableExt` lookup so the URL it emits
  // points at the same file we're stamping.
  for (const ext of ["png", "webp"] as const) {
    const p = path.join(WEARABLES_DIR, `${id}.${ext}`);
    if (fs.existsSync(p)) return { path: p, ext };
  }
  return null;
}

let cachedWearableBoost: Buffer | null = null;
function getWearableBoost(): Buffer {
  if (cachedWearableBoost) return cachedWearableBoost;
  cachedWearableBoost = fs.readFileSync(WEARABLES_BOOST_PATH);
  return cachedWearableBoost;
}

// Signature pixels of the boost overlay — sparse grid of fully-opaque
// (alpha=255) RGB samples plus the overlay's dimensions. Used to detect
// when a wearable image already has the icon baked in (the team has
// historically stamped wearables manually before uploading).
type OverlaySignature = {
  width: number;
  height: number;
  samples: ReadonlyArray<readonly [number, number, number, number, number]>;
};
let cachedOverlaySignature: OverlaySignature | null = null;
async function getOverlaySignature(): Promise<OverlaySignature> {
  if (cachedOverlaySignature) return cachedOverlaySignature;
  const overlay = getWearableBoost();
  const { data, info } = await sharp(overlay)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const samples: Array<readonly [number, number, number, number, number]> = [];
  // 8px grid is dense enough to land dozens of points inside the icon
  // bounding box and cheap enough to compute once per run.
  for (let y = 0; y < info.height; y += 8) {
    for (let x = 0; x < info.width; x += 8) {
      const idx = (y * info.width + x) * info.channels;
      if (data[idx + 3] === 255) {
        samples.push([x, y, data[idx], data[idx + 1], data[idx + 2]]);
      }
    }
  }
  cachedOverlaySignature = {
    width: info.width,
    height: info.height,
    samples,
  };
  return cachedOverlaySignature;
}

/**
 * Detect whether `source` already has the boost icon stamped in. We sample
 * fully-opaque pixels of the overlay and compare against the same (x,y)
 * positions in the wearable: an actually-stamped image will match every
 * sample exactly because PNG is lossless and stamping replaces those
 * pixels outright. A 95% threshold absorbs the rare WebP-lossy upload
 * without admitting natural artwork as a false positive.
 */
async function detectAlreadyStamped(source: Buffer): Promise<boolean> {
  const sig = await getOverlaySignature();
  if (sig.samples.length === 0) return false;

  const meta = await sharp(source).metadata();
  const baseW = meta.width ?? 0;
  const baseH = meta.height ?? 0;

  // Sharp can't sample positions outside the canvas, and the icon lives in
  // the top-right of a 1024×1024 grid. Pad the base up to overlay size if
  // needed (same approach the stamp pipeline uses for legacy 1016×1016
  // uploads) so signature coordinates land in-bounds.
  let buf = source;
  if (baseW < sig.width || baseH < sig.height) {
    buf = await sharp(source)
      .ensureAlpha()
      .extend({
        top: 0,
        left: 0,
        bottom: Math.max(0, sig.height - baseH),
        right: Math.max(0, sig.width - baseW),
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();
  }

  const { data, info } = await sharp(buf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let matches = 0;
  for (const [x, y, r, g, b] of sig.samples) {
    const idx = (y * info.width + x) * info.channels;
    if (data[idx] === r && data[idx + 1] === g && data[idx + 2] === b) {
      matches++;
    }
  }
  return matches / sig.samples.length >= 0.95;
}

/**
 * Composite the pre-positioned wearable boost icon onto `source` and return
 * the encoded bytes. Both branches are lossless so re-stamping doesn't
 * degrade the underlying wearable art across runs.
 *
 * Some legacy wearable uploads are 1016×1016 instead of 1024×1024. The
 * overlay is anchored to a 1024×1024 canvas with the icon in the top-right
 * corner, and sharp refuses to composite an overlay that's larger than the
 * base. We `extend` the base up to the overlay's dimensions when needed —
 * adding transparent border pixels at the right/bottom keeps the icon
 * aligned to the same corner without touching the wearable art itself.
 */
async function stampWearable(
  source: Buffer,
  ext: "png" | "webp",
): Promise<Buffer> {
  const overlay = getWearableBoost();
  const overlayMeta = await sharp(overlay).metadata();
  const overlayW = overlayMeta.width ?? 1024;
  const overlayH = overlayMeta.height ?? 1024;

  const baseMeta = await sharp(source).metadata();
  const baseW = baseMeta.width ?? overlayW;
  const baseH = baseMeta.height ?? overlayH;

  let base = sharp(source);
  if (baseW < overlayW || baseH < overlayH) {
    base = base.extend({
      top: 0,
      left: 0,
      bottom: Math.max(0, overlayH - baseH),
      right: Math.max(0, overlayW - baseW),
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    });
  }

  const pipe = base.composite([
    { input: overlay, top: 0, left: 0, blend: "over" },
  ]);
  return ext === "webp"
    ? pipe.webp({ lossless: true, quality: 100 }).toBuffer()
    : pipe.png().toBuffer();
}

function backupPathFor(id: number, ext: "png" | "webp"): string {
  return path.join(WEARABLE_ORIGINALS_DIR, `${id}.${ext}`);
}

async function processWearable(
  manifest: WearableManifest,
  name: BumpkinItem,
  force: boolean,
): Promise<WearableOutcome> {
  try {
    const id = ITEM_IDS[name];
    if (id === undefined) return { name, ok: false, reason: "no ITEM_ID" };

    const file = findWearableFile(id);
    if (!file) return { name, ok: false, reason: "no image on disk" };

    const onDisk = fs.readFileSync(file.path);
    const onDiskHash = sha256(onDisk);
    const boosted = BOOSTED_WEARABLES.has(name);
    const prior = manifest.items[name];
    const backupPath = backupPathFor(id, file.ext);

    // Already in the desired state — same boost flag and the on-disk hash
    // matches whichever we last wrote (stamped if boosted, clean if not).
    if (!force && prior && prior.boosted === boosted) {
      const expected = boosted ? prior.stampedHash : prior.cleanHash;
      if (expected === onDiskHash) {
        return { name, ok: true, out: file.path, boosted, action: "skipped" };
      }
    }

    // Buff-removal path. The on-disk file matches the stamped hash we wrote
    // last run — restore the clean original from backup so the icon comes
    // off cleanly. If the backup is missing (manifest/backup out of sync)
    // surface that so the team can re-upload a clean version.
    if (
      prior?.boosted === true &&
      !boosted &&
      prior.stampedHash === onDiskHash
    ) {
      if (!fs.existsSync(backupPath)) {
        return {
          name,
          ok: false,
          reason: "buff removed but original backup missing; re-upload needed",
        };
      }
      const restored = fs.readFileSync(backupPath);
      fs.writeFileSync(file.path, restored);
      fs.rmSync(backupPath);
      manifest.items[name] = {
        cleanHash: sha256(restored),
        boosted: false,
      };
      return { name, ok: true, out: file.path, boosted, action: "restored" };
    }

    // Anything else is treated as the team's clean upload — either a brand
    // new wearable, a re-upload of an existing one, or an unboosted item
    // whose hash drifted (rare, but harmless to re-record).
    if (boosted) {
      // Some wearables were stamped manually by the team before this
      // pipeline existed and uploaded with the icon already baked in. Skip
      // them so we don't double-stamp. We can't write a backup either —
      // the on-disk bytes aren't a clean original — so a future buff
      // removal will fall through to the "backup missing" warning and the
      // team will need to re-upload then.
      if (await detectAlreadyStamped(onDisk)) {
        manifest.items[name] = { stampedHash: onDiskHash, boosted: true };
        return {
          name,
          ok: true,
          out: file.path,
          boosted,
          action: "already-stamped",
        };
      }

      // Stash a copy of the clean bytes before stamping so a future buff
      // removal can restore the unstamped image without team intervention.
      fs.mkdirSync(WEARABLE_ORIGINALS_DIR, { recursive: true });
      fs.writeFileSync(backupPath, onDisk);

      const stamped = await stampWearable(onDisk, file.ext);
      fs.writeFileSync(file.path, stamped);
      manifest.items[name] = {
        cleanHash: onDiskHash,
        stampedHash: sha256(stamped),
        boosted: true,
      };
      return { name, ok: true, out: file.path, boosted, action: "stamped" };
    }

    // Not boosted — record state and clean up any stale backup that may
    // still be sitting around from a previous boosted run.
    if (fs.existsSync(backupPath)) fs.rmSync(backupPath);
    manifest.items[name] = { cleanHash: onDiskHash, boosted: false };
    return {
      name,
      ok: true,
      out: file.path,
      boosted,
      action: "left-unboosted",
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { name, ok: false, reason: `error: ${msg}` };
  }
}

async function processWearables(
  force: boolean,
  nameArgs: string[],
): Promise<void> {
  const fingerprint = computeWearablePipelineFingerprint();
  const manifest = loadWearableManifest(fingerprint);

  const allNames = getKeys(OPEN_SEA_WEARABLES);
  const targets =
    nameArgs.length > 0
      ? allNames.filter((n) => nameArgs.includes(n as string))
      : allNames;

  const outcomes: WearableOutcome[] = [];
  const concurrency = 8;
  for (let i = 0; i < targets.length; i += concurrency) {
    const batch = targets.slice(i, i + concurrency);
    const results = await Promise.all(
      batch.map((n) => processWearable(manifest, n, force)),
    );
    outcomes.push(...results);
  }

  fs.writeFileSync(
    WEARABLES_MANIFEST_PATH,
    JSON.stringify(manifest) + "\n",
    "utf8",
  );

  const ok = outcomes.filter(
    (o): o is Extract<WearableOutcome, { ok: true }> => o.ok,
  );
  const failed = outcomes.filter(
    (o): o is Extract<WearableOutcome, { ok: false }> => !o.ok,
  );
  const stamped = ok.filter((o) => o.action === "stamped").length;
  const alreadyStamped = ok.filter(
    (o) => o.action === "already-stamped",
  ).length;
  const restored = ok.filter((o) => o.action === "restored").length;

  // eslint-disable-next-line no-console
  console.log(
    `[wearables] ${ok.length}/${outcomes.length} processed ` +
      `(${stamped} stamped, ${alreadyStamped} already-stamped, ${restored} restored)`,
  );

  if (failed.length > 0) {
    const byReason = new Map<string, string[]>();
    for (const f of failed) {
      const list = byReason.get(f.reason) ?? [];
      list.push(f.name);
      byReason.set(f.reason, list);
    }
    // eslint-disable-next-line no-console
    console.log(`[wearables] Issues (${failed.length}):`);
    for (const [reason, items] of byReason) {
      // eslint-disable-next-line no-console
      console.log(`  [${items.length}] ${reason}`);
      if (items.length <= 12) {
        // eslint-disable-next-line no-console
        console.log(`       ${items.join(", ")}`);
      }
    }
  }
}

export const generateImages = async () => {
  const allNames = getKeys(OPEN_SEA_COLLECTIBLES);
  const rawArgs = process.argv.slice(2);
  // --force / -f regenerates every image. By default we skip any item whose
  // output file already exists — this keeps CI runs fast when only a handful
  // of sprites changed.
  const force = rawArgs.includes("--force") || rawArgs.includes("-f");
  // --skip-collectibles / --skip-wearables let local runs target one half of
  // the pipeline. CI always runs both.
  const skipCollectibles = rawArgs.includes("--skip-collectibles");
  const skipWearables = rawArgs.includes("--skip-wearables");
  const nameArgs = rawArgs.filter((a) => !a.startsWith("-"));

  if (!skipCollectibles) {
    const targets =
      nameArgs.length > 0
        ? allNames.filter((n) => nameArgs.includes(n as string))
        : allNames;

    if (nameArgs.length > 0 && targets.length === 0 && skipWearables) {
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

    const ok = outcomes.filter(
      (o): o is Extract<Outcome, { ok: true }> => o.ok,
    );
    const skipped = outcomes.filter(
      (o): o is Extract<Outcome, { ok: false }> => !o.ok,
    );
    const boostedCount = ok.filter((o) => o.boosted).length;

    // eslint-disable-next-line no-console
    console.log(
      `[collectibles] Generated ${ok.length}/${outcomes.length} (${boostedCount} with boost overlay)`,
    );

    if (skipped.length > 0) {
      const byReason = new Map<string, string[]>();
      for (const s of skipped) {
        const list = byReason.get(s.reason) ?? [];
        list.push(s.name);
        byReason.set(s.reason, list);
      }
      // eslint-disable-next-line no-console
      console.log(`[collectibles] Skipped (${skipped.length}):`);
      for (const [reason, items] of byReason) {
        // eslint-disable-next-line no-console
        console.log(`  [${items.length}] ${reason}`);
        if (items.length <= 12) {
          // eslint-disable-next-line no-console
          console.log(`       ${items.join(", ")}`);
        }
      }
    }
  }

  if (!skipWearables) {
    await processWearables(force, nameArgs);
  }
};

generateImages().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
