/*
 * Generate staticCollectibles.ts from the extracted data.
 *
 * NOTE: the checked-in table has since been corrected in place against the
 * main build's rendered geometry (missed wrapper offsets, max-width clamps
 * and `top` offsets). Regenerating overwrites those fixes; diff the output
 * against the current table and keep the corrected entries.
 */
const fs = require("fs");
const path = require("path");
// Repo root, so the scripts work from any checkout or worktree.
const ROOT = path.join(__dirname, "../../..");
const data = JSON.parse(fs.readFileSync(__dirname + "/collectibles-static.json", "utf8"));
const inlineData = JSON.parse(fs.readFileSync(__dirname + "/collectibles-inline.json", "utf8"));
for (const [k, v] of Object.entries(inlineData.inline)) if (!data[k]) data[k] = v;
const templates = inlineData.templates;
const { mismatch } = JSON.parse(fs.readFileSync(__dirname + "/collectibles-mismatch.json", "utf8"));
const mismatchSet = new Map(mismatch.map(([name, placed]) => [name, placed]));

const importLines = [];
const importVars = new Map(); // path -> var
let counter = 0;
const varFor = (path) => {
  if (!importVars.has(path)) {
    const v = `art${counter++}`;
    importVars.set(path, v);
    importLines.push(`import ${v} from "${path}";`);
  }
  return importVars.get(path);
};

const entries = [];
const sortedNames = Object.keys(data).sort();
for (const name of sortedNames) {
  const cfg = data[name];
  const parts = [];
  const img = cfg.img ?? {};
  const wrapper = cfg.wrapper;

  // art: omit when ITEM_DETAILS-identical; SUNNYSIDE refs inline; mismatches import.
  if (mismatchSet.has(name)) parts.push(`art: ${varFor(mismatchSet.get(name))}`);
  else if (cfg.art.startsWith("SUNNYSIDE")) parts.push(`art: ${cfg.art}`);
  // width: prefer img width, fallback wrapper width
  const width = img.width ?? wrapper?.width;
  parts.push(`width: ${width}`);
  const pos = wrapper ?? img;
  for (const k of ["bottom", "left", "right", "top"]) {
    if (pos[k] !== undefined && pos[k] !== 0) parts.push(`${k}: ${pos[k]}`);
  }
  // centered img inside a wider wrapper
  if (cfg.centered && wrapper && img.width !== undefined && img.width !== wrapper.width) {
    parts.push(`centeredIn: ${wrapper.width}`);
  }
  // `left-1/2 -translate-x-1/2` with no wrapper: centred in the placement
  // box itself, whose width only the engine knows.
  if (cfg.centered && !wrapper && img.left === undefined && img.right === undefined) {
    parts.push("centered: true");
  }
  if (cfg.shadow) {
    const s = [];
    for (const k of ["width", "bottom", "left", "right", "top"]) {
      if (cfg.shadow[k] !== undefined) s.push(`${k}: ${cfg.shadow[k]}`);
    }
    parts.push(`shadow: { ${s.join(", ")} }`);
  }
  entries.push(`  "${name}": { ${parts.join(", ")} },`);
}

const out = `import { SUNNYSIDE } from "assets/sunnyside";
${importLines.join("\n")}
import type { CollectibleName } from "features/game/types/craftables";

/**
 * GENERATED layout table for the ~300 static collectible components
 * (scripted extraction from features/island/collectibles/components/*.tsx —
 * see docs/phaser-farm-migration/CHECKLIST.md Phase 6). Offsets are source px
 * relative to the placement box, bottom-left anchored like the DOM's
 * \`absolute bottom-0\` images. \`art\` omitted = ITEM_DETAILS[name].image
 * (verified identical import path); \`centeredIn\` = the DOM centres the image
 * horizontally inside a wrapper of that width.
 *
 * \`width\` is the width the DOM actually DISPLAYS (after its max-width clamp),
 * used only to centre the native-size art [core/pixelArt.ts]. Entries whose
 * extraction missed a wrapper offset, clamp or \`top\` were corrected in place
 * from the main build's rendered geometry (centre-x and bottom edge measured
 * per item), so re-running the generator would undo them.
 */
export type StaticCollectibleSpec = {
  art?: string;
  width: number;
  bottom?: number;
  left?: number;
  right?: number;
  top?: number;
  centeredIn?: number;
  /** The DOM centres the image horizontally in its placement box. */
  centered?: boolean;
  /** npcs/shadow.png underlay (the DOM's two-img beaver template). */
  shadow?: {
    /** A different shadow sprite than npcs/shadow.png. */
    art?: string;
    width: number;
    bottom?: number;
    left?: number;
    right?: number;
    top?: number;
  };
};

export const STATIC_COLLECTIBLES: Partial<
  Record<CollectibleName, StaticCollectibleSpec>
> = {
${entries.join("\n")}
};

/**
 * Collectibles the DOM renders via TemplateCollectible: ITEM_DETAILS art at
 * its natural width, horizontally centred, flush with the box bottom
 * (TemplateCollectible.tsx). DECORATION_TEMPLATES names get the same
 * treatment at runtime.
 */
export const TEMPLATE_COLLECTIBLES: CollectibleName[] = [
${templates.map((t) => `  "${t}",`).join("\n")}
];
`;
fs.mkdirSync(path.join(ROOT, "src/features/farmEngine/entities/collectibles"), { recursive: true });
fs.writeFileSync(
  path.join(ROOT, "src/features/farmEngine/entities/collectibles/staticCollectibles.ts"),
  out,
);
console.log("entries:", entries.length, "imports:", importLines.length);
