/**
 * GIF -> spritesheet converter for the Phaser farm.
 *
 * The DOM farm renders animated GIFs directly in <img> tags; Phaser can't
 * animate a GIF, so the engine showed their first frame only. This decodes
 * every GIF the farm renders into a VERTICAL strip PNG (sharp/libvips reads
 * animated GIFs as stacked, fully-composed frames — exactly the layout
 * Phaser's spritesheet parser walks) and writes a typed manifest keyed by the
 * original art URL, so renderers can swap an Image for a looping Sprite.
 *
 * Usage:
 *   node docs/phaser-farm-migration/scripts/gif-to-spritesheet.js [--force]
 *
 * Outputs:
 *   src/assets/animations/<name>.png          (vertical strips, committed)
 *   src/features/farmEngine/core/animatedArt.ts   (GENERATED manifest)
 *
 * CDN sources are downloaded and their strips stored locally too — the art
 * team can move the strips onto the CDN later and only the manifest's import
 * lines change.
 *
 * Besides GIFs this also converts ANIMATED WEBPS (sharp reads both):
 *   - every animated webp under src/assets/sfts/pets/ (common pet art), and
 *   - per-token CDN art for the buds + pet NFTs in the veteran fixture
 *     (bud images/<id>.webp, pet sleepings/<id>_animated.webp), keyed under
 *     BOTH the mainnet and testnet URL so lookups match either network.
 * These strips live in src/assets/animations/ until they migrate to the
 * Images repo.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const REPO = path.resolve(__dirname, "../../..");
const OUT_DIR = path.join(REPO, "src/assets/animations");
const MANIFEST = path.join(
  REPO,
  "src/features/farmEngine/core/animatedArt.ts",
);
const CDN_BASE = "https://sunflower-land.com/testnet-assets";

/**
 * Local GIFs the farm renders. `import` is the path the app imports the GIF
 * by, so the manifest can key on the identical module value in dev and prod.
 */
const LOCAL = [
  "assets/sfts/fountain.gif",
  "assets/sfts/beaver.gif",
  "assets/sfts/apprentice_beaver.gif",
  "assets/sfts/construction_beaver.gif",
  "assets/sfts/kuebiko.gif",
  "assets/sfts/tunnel_mole.gif",
  "assets/sfts/rocky_mole.gif",
  "assets/sfts/nugget.gif",
  "assets/sfts/wood_nymph_wendy.gif",
  "assets/sfts/cabbage_boy.gif",
  "assets/sfts/cabbage_girl.gif",
  "assets/sfts/peeled_potato.gif",
  "assets/sfts/ladybug.gif",
  "assets/sfts/black_bear.gif",
  "assets/sfts/obie.gif",
  "assets/sfts/maximus.gif",
  "assets/sfts/tomato_clown.gif",
  "assets/sfts/lab_grown_carrot.gif",
  "assets/sfts/lab_grown_pumpkin.gif",
  "assets/sfts/lab_grown_radish.gif",
  "assets/sfts/victoria_sisters.gif",
  "assets/sfts/maneki_neko.gif",
  "assets/sfts/heart_of_davy_jones.gif",
  "assets/sfts/pablo_bunny.gif",
  "assets/sfts/sapo_docuras.gif",
  "assets/sfts/sapo_travessura.gif",
  "assets/sfts/reveling_lemon.gif",
  "assets/sfts/easter/easter_bunny.gif",
  "assets/decorations/snowglobe.gif",
  "assets/decorations/banners/spring_banner.gif",
  "assets/decorations/banners/winds-of-change_banner_loop.gif",
  "assets/decorations/isle_boat.gif",
  "assets/events/golden_crop/golden_crop.gif",
];

/**
 * CDN GIFs referenced by the farm engine (resolved from the SUNNYSIDE keys the
 * engine actually uses). `key` is the SUNNYSIDE path the manifest re-derives.
 */
const REMOTE = [
  { key: "building.smoke", path: "/buildings/smoke.gif" },
  { key: "fx.sparkle", path: "/fx/sparkle2.gif" },
  { key: "land.pontoon", path: "/land/levels/pontoon.gif" },
  { key: "npcs.artisianDoing", path: "/npcs/artisian_doing.gif" },
  { key: "npcs.artisian", path: "/npcs/artisian.gif" },
  { key: "npcs.chef_doing", path: "/npcs/chef_doing.gif" },
  { key: "npcs.chef", path: "/npcs/chef.gif" },
  { key: "npcs.firePit_npcDoing", path: "/npcs/cook_doing.gif" },
  { key: "npcs.firePit_npc", path: "/npcs/cook.gif" },
  { key: "npcs.goblin_chef_doing", path: "/npcs/goblin_chef_doing.gif" },
  { key: "npcs.goblin_chef", path: "/npcs/goblin_chef.gif" },
  { key: "npcs.goblinSnorkling", path: "/npcs/goblin_snorkling.gif" },
  { key: "npcs.goblin_swimming", path: "/npcs/goblin_swimming.gif" },
  { key: "npcs.fishMarket_npc_doing", path: "/npcs/neville_doing.gif" },
  { key: "npcs.smoothieChefMaking", path: "/npcs/smoothie_making.gif" },
  { key: "npcs.smoothieChef", path: "/npcs/smoothie.gif" },
  { key: "npcs.swimmer", path: "/npcs/swimmer.gif" },
];

/**
 * GIFs deliberately NOT converted — the engine already animates these from a
 * purpose-built sheet the art team ships, which beats a GIF decode.
 */
const EXCLUDED = new Set([
  "assets/sfts/squirrel_monkey.gif", // SHEET_COLLECTIBLES (squirrel_monkey_sheet)
  "assets/sfts/tomato_bombard.gif", // CLICK_SHEETS (idle + click burst sheets)
]);

/** `assets/sfts/fountain.gif` -> `sfts_fountain`; `/npcs/cook.gif` -> `npcs_cook`. */
const sheetName = (source) =>
  source
    .replace(/^assets\//, "")
    .replace(/^\//, "")
    .replace(/\.(gif|webp)$/, "")
    .replace(/[/]/g, "_");

/** Animated webps under a tree (RIFF container with an ANIM chunk). */
const findAnimatedWebps = (dir) => {
  const out = [];
  const walk = (d) => {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".webp")) {
        const head = Buffer.alloc(400);
        const fd = fs.openSync(full, "r");
        fs.readSync(fd, head, 0, 400, 0);
        fs.closeSync(fd);
        if (head.includes("ANIM")) out.push(path.relative(path.join(REPO, "src"), full));
      }
    }
  };
  walk(dir);
  return out.sort();
};

/**
 * Per-token CDN art for the ids the veteran fixture places. Adam bakes the
 * FULL collections in the Images repo later; these cover the demo farm.
 * Each id is keyed under both network domains.
 */
const tokenSources = () => {
  const fixture = JSON.parse(
    fs.readFileSync(
      path.join(REPO, "src/features/game/lib/fixtures/veteranFarm.json"),
      "utf8",
    ),
  );
  const sources = [];
  for (const id of Object.keys(fixture.buds ?? {})) {
    sources.push({
      name: `buds_${id}`,
      download: `https://testnet-buds.sunflower-land.com/images/${id}.webp`,
      keys: [
        `https://buds.sunflower-land.com/images/${id}.webp`,
        `https://testnet-buds.sunflower-land.com/images/${id}.webp`,
      ],
    });
  }
  for (const id of Object.keys(fixture.pets?.nfts ?? {})) {
    sources.push({
      name: `pets_sleepings_${id}`,
      download: `https://testnet-pets.sunflower-land.com/sleepings/${id}_animated.webp`,
      keys: [
        `https://pets.sunflower-land.com/sleepings/${id}_animated.webp`,
        `https://testnet-pets.sunflower-land.com/sleepings/${id}_animated.webp`,
      ],
    });
  }
  return sources;
};

/** Phaser takes one frameRate per animation; GIF delays are per frame. */
const frameRateOf = (delays) => {
  const valid = (delays ?? []).filter((d) => d > 0);
  if (!valid.length) return 10;
  const sorted = [...valid].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  return Math.max(1, Math.round(1000 / median));
};

async function convert(buffer, name) {
  const image = sharp(buffer, { animated: true });
  const meta = await image.metadata();
  const frames = meta.pages ?? 1;
  const frameHeight = meta.pageHeight ?? meta.height;
  // animated:true already yields the stacked vertical strip.
  await image.png().toFile(path.join(OUT_DIR, `${name}.png`));
  return {
    name,
    frameWidth: meta.width,
    frameHeight,
    frames,
    fps: frameRateOf(meta.delay),
    variableDelays: new Set(meta.delay ?? []).size > 1,
  };
}

/**
 * Drift guard: every GIF that ITEM_DETAILS renders should be in LOCAL, or the
 * farm silently falls back to a still first frame when someone adds new art.
 */
function reportUncoveredArt() {
  const images = fs.readFileSync(
    path.join(REPO, "src/features/game/types/images.ts"),
    "utf8",
  );
  const covered = new Set([...LOCAL, ...EXCLUDED]);
  const missing = [...images.matchAll(/from\s+"(assets\/[^"]+\.gif)"/g)]
    .map((m) => m[1])
    .filter((asset) => !covered.has(asset));
  if (missing.length) {
    console.log(
      `\nWARNING: ${missing.length} GIF(s) rendered by ITEM_DETAILS are not in LOCAL — they will render as a still frame:\n  ` +
        [...new Set(missing)].join("\n  "),
    );
  }
}

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const localEntries = [];
  const remoteEntries = [];
  const skipped = [];

  for (const source of LOCAL) {
    const file = path.join(REPO, "src", source);
    if (!fs.existsSync(file)) {
      skipped.push(`${source} (missing)`);
      continue;
    }
    const result = await convert(fs.readFileSync(file), sheetName(source));
    localEntries.push({ ...result, import: source });
    console.log(
      `local  ${source} -> ${result.name}.png (${result.frames}f ${result.frameWidth}x${result.frameHeight} @${result.fps}fps)`,
    );
  }

  // Animated common-pet webps, keyed by their import module like the gifs.
  for (const source of findAnimatedWebps(path.join(REPO, "src/assets/sfts/pets"))) {
    const result = await convert(
      fs.readFileSync(path.join(REPO, "src", source)),
      sheetName(source),
    );
    localEntries.push({ ...result, import: source });
    console.log(
      `local  ${source} -> ${result.name}.png (${result.frames}f ${result.frameWidth}x${result.frameHeight} @${result.fps}fps)`,
    );
  }

  // Per-token CDN art (buds, pet sleepings) for the veteran fixture.
  const tokenEntries = [];
  for (const { name, download, keys } of tokenSources()) {
    const response = await fetch(download);
    if (!response.ok) {
      skipped.push(`${download} (HTTP ${response.status})`);
      continue;
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    const meta = await sharp(buffer, { animated: true }).metadata();
    if ((meta.pages ?? 1) <= 1) {
      skipped.push(`${download} (static, no conversion needed)`);
      continue;
    }
    const result = await convert(buffer, name);
    tokenEntries.push({ ...result, keys });
    console.log(
      `token  ${download} -> ${result.name}.png (${result.frames}f ${result.frameWidth}x${result.frameHeight} @${result.fps}fps)`,
    );
  }

  const convertedByPath = new Map();
  for (const { key, path: remotePath } of REMOTE) {
    // Several SUNNYSIDE keys can point at one file (chef/goblin_chef) — decode
    // once, then map every key at it.
    if (convertedByPath.has(remotePath)) {
      remoteEntries.push({
        ...convertedByPath.get(remotePath),
        key,
        cdnPath: remotePath,
      });
      continue;
    }
    const url = `${CDN_BASE}${remotePath}`;
    const response = await fetch(url);
    if (!response.ok) {
      skipped.push(`${url} (HTTP ${response.status})`);
      continue;
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    const result = await convert(buffer, sheetName(remotePath));
    convertedByPath.set(remotePath, result);
    remoteEntries.push({ ...result, key, cdnPath: remotePath });
    console.log(
      `remote ${remotePath} -> ${result.name}.png (${result.frames}f ${result.frameWidth}x${result.frameHeight} @${result.fps}fps)`,
    );
  }

  // ---- manifest -----------------------------------------------------------
  // Two SUNNYSIDE keys can share one sheet — emit each import once.
  const importLines = [
    ...new Set([
      ...localEntries.map(
        (e) => `import ${varName(e.name)} from "${sheetName2Asset(e)}";`,
      ),
      ...remoteEntries.map(
        (e) => `import ${varName(e.name)} from "assets/animations/${e.name}.png";`,
      ),
      ...tokenEntries.map(
        (e) => `import ${varName(e.name)} from "assets/animations/${e.name}.png";`,
      ),
    ]),
  ];
  const sourceImports = localEntries.map(
    (e) => `import ${varName(e.name)}Gif from "${e.import}";`,
  );

  const entryLine = (e, keyExpr) =>
    `  [${keyExpr}, { sheet: ${varName(e.name)}, frameWidth: ${e.frameWidth}, frameHeight: ${e.frameHeight}, frames: ${e.frames}, fps: ${e.fps} }],`;

  const body = `/**
 * GENERATED by docs/phaser-farm-migration/scripts/gif-to-spritesheet.js —
 * do not edit by hand; re-run the script to refresh.
 *
 * Maps every animated-GIF art URL the farm renders to its converted vertical
 * strip. The DOM shows these GIFs in <img> tags; Phaser plays the strip
 * instead, so the engine animates what the DOM animates.
 */
import { CONFIG } from "lib/config";
${sourceImports.join("\n")}
${importLines.join("\n")}

export type AnimatedArt = {
  sheet: string;
  frameWidth: number;
  frameHeight: number;
  frames: number;
  fps: number;
};

/** Keyed by the ORIGINAL art URL, so lookups work wherever art is resolved. */
export const ANIMATED_ART: Record<string, AnimatedArt> = Object.fromEntries([
${localEntries.map((e) => entryLine(e, `${varName(e.name)}Gif`)).join("\n")}
${remoteEntries
  .map((e) =>
    entryLine(e, `\`\${CONFIG.PROTECTED_IMAGE_URL}${e.cdnPath}\``),
  )
  .join("\n")}
${tokenEntries
  .flatMap((e) => e.keys.map((k) => entryLine(e, JSON.stringify(k))))
  .join("\n")}
]);

/** The converted strip for an art URL, when one exists. */
export const animatedArtFor = (url: string | undefined): AnimatedArt | undefined =>
  url ? ANIMATED_ART[url] : undefined;
`;

  fs.writeFileSync(MANIFEST, body);
  console.log(
    `\n${localEntries.length} local + ${remoteEntries.length} remote + ${tokenEntries.length} token -> ${OUT_DIR}`,
  );
  if (skipped.length) console.log("skipped:\n  " + skipped.join("\n  "));
  reportUncoveredArt();
})().catch((error) => {
  console.error("FATAL:", error.message);
  process.exit(1);
});

function varName(name) {
  return name.replace(/[^a-zA-Z0-9]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
}
function sheetName2Asset(entry) {
  return `assets/animations/${entry.name}.png`;
}
