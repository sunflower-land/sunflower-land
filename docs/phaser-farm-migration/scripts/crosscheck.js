const fs = require("fs");
const data = JSON.parse(fs.readFileSync(__dirname + "/collectibles-static.json", "utf8"));
const inlineData = JSON.parse(fs.readFileSync(__dirname + "/collectibles-inline.json", "utf8"));
for (const [k, v] of Object.entries(inlineData.inline)) if (!data[k]) data[k] = v;
const imagesTs = fs.readFileSync("/Users/adamhannigan/Documents/workspace/sunflower-land/src/features/game/types/images.ts", "utf8");

// var -> path
const importMap = {};
for (const m of imagesTs.matchAll(/import\s+(\w+)\s+from\s+"(assets\/[^"]+)"/g)) importMap[m[1]] = m[2];
// name -> image var  ("Name": { ... image: var,
const nameToPath = {};
for (const m of imagesTs.matchAll(/"([^"]+)":\s*\{[\s\S]{0,400}?image:\s*(\w+)/g)) {
  if (importMap[m[2]]) nameToPath[m[1]] = importMap[m[2]];
}
// also unquoted keys:  Name: { image: var
for (const m of imagesTs.matchAll(/^\s{2}(\w+):\s*\{[\s\S]{0,400}?image:\s*(\w+)/gm)) {
  if (importMap[m[2]] && !nameToPath[m[1]]) nameToPath[m[1]] = importMap[m[2]];
}

let match = 0, mismatch = [], noEntry = [];
for (const [name, cfg] of Object.entries(data)) {
  if (cfg.art === "ITEM_DETAILS" || cfg.art.startsWith("SUNNYSIDE")) { match++; continue; }
  const itemPath = nameToPath[name];
  if (!itemPath) { noEntry.push(name); continue; }
  if (itemPath === cfg.art) match++;
  else mismatch.push([name, cfg.art, itemPath]);
}
console.log("match:", match, "mismatch:", mismatch.length, "noEntry:", noEntry.length);
mismatch.slice(0, 40).forEach((m) => console.log("MISMATCH:", m.join(" | ")));
noEntry.slice(0, 20).forEach((n) => console.log("NOENTRY:", n));
fs.writeFileSync(__dirname + "/collectibles-mismatch.json", JSON.stringify({ mismatch, noEntry }, null, 1));
