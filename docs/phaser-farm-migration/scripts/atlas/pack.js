/**
 * Texture atlas packer for the Phaser farm.
 *
 * The farm draws ~200 tiny sprites from the image CDN at boot, one request
 * each. This packs every small static image in the images repo into a few
 * 2048x2048 pages, so the engine loads a page instead of hundreds of files
 * (src/features/farmEngine/core/atlas.ts aliases each CDN URL onto its frame).
 *
 * Usage:
 *   node docs/phaser-farm-migration/scripts/atlas/pack.js <images-repo>/assets <label>
 *
 * <images-repo>/assets is a checkout of sunflower-land/images at the release
 * the build will be served with (mainnet's /game-assets is the latest images
 * RELEASE, not main). <label> is recorded in the manifest, e.g. the tag.
 *
 * RE-RUN THIS WHENEVER THE IMAGES REPO RELEASES. A frame in the atlas wins
 * over the CDN file, so art that changed upstream keeps its old pixels in the
 * Phaser farm until the atlas is regenerated. New files are unaffected: they
 * are simply not in the atlas and load from the CDN as before.
 *
 * Writes src/assets/atlas/farm-<group>-<n>.png and the generated
 * src/features/farmEngine/core/atlasManifest.ts.
 */
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "../../../..");
const sharp = require(path.join(ROOT, "node_modules/sharp"));

const ASSETS = process.argv[2];
const LABEL = process.argv[3] || "unlabelled";
if (!ASSETS || !fs.existsSync(ASSETS)) {
  console.error("usage: node pack.js <images-repo>/assets <label>");
  process.exit(1);
}

/** 2048 is safe on every phone GPU; 4096 is the usual mobile ceiling. */
const PAGE = 2048;
/** Sprites larger than this on either side stay as their own files. */
const MAX_SIDE = 128;
/** One texel of the frame's own edge on every side, against bleed. */
const PAD = 1;
/** Folders with nothing the farm draws. */
const SKIP = new Set([
  "announcements",
  "captcha",
  "brand",
  "tutorials",
  "telegram",
  "public",
  "splash",
  "world",
  "fonts",
  "phaser",
  "ronin",
  "songs",
  "sfx",
  "sound-effects",
  "videos",
]);
/** A page group loads only when one of its frames is first asked for. */
const groupOf = (rel) => (rel.startsWith("flowers/") ? "flowers" : "core");

const walk = (dir, out = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(png|webp|gif)$/i.test(entry.name)) out.push(full);
  }
  return out;
};

(async () => {
  const sprites = [];
  let skippedAnimated = 0;
  let skippedLarge = 0;
  for (const file of walk(ASSETS).sort()) {
    const rel = path.relative(ASSETS, file).split(path.sep).join("/");
    if (SKIP.has(rel.split("/")[0])) continue;
    let meta;
    try {
      meta = await sharp(file, { animated: true }).metadata();
    } catch {
      continue;
    }
    if ((meta.pages || 1) > 1) {
      skippedAnimated++;
      continue;
    }
    if (meta.width > MAX_SIDE || meta.height > MAX_SIDE) {
      skippedLarge++;
      continue;
    }
    const { data, info } = await sharp(file)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    sprites.push({ rel, w: info.width, h: info.height, data });
  }

  // Shelf packing, tallest first: simple, deterministic and within a few
  // percent of optimal for sprites this uniform.
  const groups = {};
  for (const sprite of sprites)
    (groups[groupOf(sprite.rel)] ||= []).push(sprite);

  const pages = [];
  const frames = {};
  for (const group of Object.keys(groups).sort()) {
    const list = groups[group].sort(
      (a, b) => b.h - a.h || b.w - a.w || a.rel.localeCompare(b.rel),
    );
    let page;
    let x = 0;
    let y = 0;
    let shelf = 0;
    const open = () => {
      page = {
        name: `farm-${group}-${pages.filter((p) => p.group === group).length}`,
        group,
        buffer: Buffer.alloc(PAGE * PAGE * 4),
        used: 0,
      };
      pages.push(page);
      x = 0;
      y = 0;
      shelf = 0;
    };
    open();
    for (const sprite of list) {
      const cw = sprite.w + PAD * 2;
      const ch = sprite.h + PAD * 2;
      if (x + cw > PAGE) {
        x = 0;
        y += shelf;
        shelf = 0;
      }
      if (y + ch > PAGE) open();
      // Blit with the edge texels repeated into the padding.
      for (let row = -PAD; row < sprite.h + PAD; row++) {
        const sy = Math.min(sprite.h - 1, Math.max(0, row));
        for (let col = -PAD; col < sprite.w + PAD; col++) {
          const sx = Math.min(sprite.w - 1, Math.max(0, col));
          const from = (sy * sprite.w + sx) * 4;
          const to = ((y + PAD + row) * PAGE + (x + PAD + col)) * 4;
          sprite.data.copy(page.buffer, to, from, from + 4);
        }
      }
      frames[sprite.rel] = [
        pages.indexOf(page),
        x + PAD,
        y + PAD,
        sprite.w,
        sprite.h,
      ];
      page.used = Math.max(page.used, y + ch);
      x += cw;
      shelf = Math.max(shelf, ch);
    }
  }

  const outDir = path.join(ROOT, "src/assets/atlas");
  fs.mkdirSync(outDir, { recursive: true });
  for (const old of fs.readdirSync(outDir)) {
    if (/^farm-.*\.png$/.test(old)) fs.unlinkSync(path.join(outDir, old));
  }
  for (const page of pages) {
    // Crop to the rows actually used, rounded up to a power of two.
    page.height = Math.min(
      PAGE,
      2 ** Math.ceil(Math.log2(Math.max(64, page.used))),
    );
    const file = path.join(outDir, `${page.name}.png`);
    await sharp(page.buffer.subarray(0, PAGE * page.height * 4), {
      raw: { width: PAGE, height: page.height, channels: 4 },
    })
      // Lossless truecolour. Do NOT pass `effort`, `quality` or `colours`:
      // any of them switches sharp to palette mode, which quantised every
      // page to 256 colours with dithering (the ocean came out a checkerboard
      // and gradients across the farm were speckled).
      .png({ compressionLevel: 9, palette: false })
      .toFile(file);
    page.bytes = fs.statSync(file).size;
  }

  const manifest = `// GENERATED by docs/phaser-farm-migration/scripts/atlas/pack.js — do not edit.
// Source: ${LABEL}. Regenerate whenever the images repo releases.
${pages.map((page, index) => `import page${index} from "assets/atlas/${page.name}.png";`).join("\n")}

/** The images release these pixels were packed from. */
export const ATLAS_SOURCE = ${JSON.stringify(LABEL)};

/** Page image URLs, by page index. */
export const ATLAS_PAGES: readonly string[] = [${pages.map((_, index) => `page${index}`).join(", ")}];

/**
 * Path under the image CDN root -> [page, x, y, width, height]. Kept as one
 * JSON string: ${Object.keys(frames).length} entries parse faster, and bundle smaller, than as an
 * object literal.
 */
export const ATLAS_FRAMES: Record<
  string,
  readonly [number, number, number, number, number]
> = JSON.parse(
  ${JSON.stringify(JSON.stringify(frames))},
);
`;
  fs.writeFileSync(
    path.join(ROOT, "src/features/farmEngine/core/atlasManifest.ts"),
    manifest,
  );

  console.log(
    `${sprites.length} sprites packed (${skippedAnimated} animated and ${skippedLarge} larger than ${MAX_SIDE}px left out)`,
  );
  for (const page of pages) {
    console.log(
      `  ${page.name}.png  ${PAGE}x${page.height}  ${(page.bytes / 1024).toFixed(0)} KB  ${Object.values(frames).filter((f) => f[0] === pages.indexOf(page)).length} frames`,
    );
  }
})();
