/**
 * Extracts the landscaping ghost geometry for resources from the DOM's
 * READONLY_RESOURCE_COMPONENTS [island/resources/Resource.tsx] so the engine's
 * placement ghost draws the same sprite at the same offsets instead of an
 * ITEM_DETAILS approximation.
 *
 * Usage: node docs/phaser-farm-migration/scripts/extract-readonly-resources.js
 * Prints a TS table to paste into landscaping/readonlyResourceArt.ts.
 */
const fs = require("fs");
const path = require("path");

const file = path.resolve(
  __dirname,
  "../../../src/features/island/resources/Resource.tsx",
);
const src = fs.readFileSync(file, "utf8");
const body = src.slice(src.indexOf("  return {", src.indexOf("READONLY_RESOURCE_COMPONENTS")));

// Split on top-level `"Name": () => (` entries.
const entries = [...body.matchAll(/^\s{4}"?([A-Za-z][A-Za-z 0-9']*)"?: \(\) => \(/gm)];
const out = [];
for (let i = 0; i < entries.length; i++) {
  const start = entries[i].index;
  const end = i + 1 < entries.length ? entries[i + 1].index : body.length;
  const chunk = body.slice(start, end);
  const name = entries[i][1];

  const num = (prop) => {
    // `prop: `${PIXEL_SCALE * N}px`` (N may be negative/decimal), or bare PIXEL_SCALE
    const re = new RegExp(prop + ":\\s*`\\$\\{PIXEL_SCALE\\s*\\*\\s*(-?[\\d.]+)\\}px`");
    const m = chunk.match(re);
    if (m) return parseFloat(m[1]);
    const bare = new RegExp(prop + ":\\s*`\\$\\{PIXEL_SCALE\\}px`");
    return bare.test(chunk) ? 1 : undefined;
  };

  const src_ = chunk.match(/src=\{(?:ITEM_DETAILS\["([^"]+)"\]\.image|SUNNYSIDE\.([\w.]+))\}/);
  out.push({
    name,
    art: src_ ? (src_[1] ? `ITEM_DETAILS["${src_[1]}"].image` : `SUNNYSIDE.${src_[2]}`) : null,
    width: num("width"),
    top: num("top"),
    bottom: num("bottom"),
    left: num("left"),
    right: num("right"),
    dynamic: /TREE_SIZE_VARIANTS|treeStyle|VARIANTS\(/.test(chunk),
  });
}
console.log(JSON.stringify(out, null, 1));
