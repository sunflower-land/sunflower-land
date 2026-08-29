/* Extract layout config from the static collectible components. */
const fs = require("fs");
const path = require("path");
const DIR = "/Users/adamhannigan/Documents/workspace/sunflower-land/src/features/island/collectibles/components";

const INTERACTIVE = new Set(["Bean.tsx","Bed.tsx","Bud.tsx","Bush.tsx","FestiveTree.tsx","Fountain.tsx","GenieLamp.tsx","GoldEgg.tsx","Hourglass.tsx","ManekiNeko.tsx","Monument.tsx","NyonStatue.tsx","Observatory.tsx","ObsidianShrine.tsx","PetShrine.tsx","Project.tsx","RockGolem.tsx","SaltSculpture.tsx","Sign.tsx","SuperTotem.tsx","TimeWarpTotem.tsx","TomatoBombard.tsx","Wardrobe.tsx","WeatherProtection.tsx","WindsOfChangeBanner.tsx"]);
const SHEET = new Set(["SquirrelMonkey.tsx","WickerMan.tsx"]);

const results = {}; const problems = [];
for (const file of fs.readdirSync(DIR)) {
  if (!file.endsWith(".tsx") || INTERACTIVE.has(file) || SHEET.has(file)) continue;
  const src = fs.readFileSync(path.join(DIR, file), "utf8");

  // Collectible name: SFTDetailPopover name="..."  (fallback: alt="...")
  const nameM = src.match(/SFTDetailPopover\s+name="([^"]+)"/) || src.match(/alt="([^"]+)"/);
  if (!nameM) { problems.push([file, "no name"]); continue; }
  const name = nameM[1];

  // Image imports: var -> path
  const imports = {};
  for (const m of src.matchAll(/import\s+(\w+)\s+from\s+"(assets\/[^"]+)"/g)) imports[m[1]] = m[2];

  // ImageStyle template variant [template/ImageStyle.tsx]
  const imageStyleM = src.match(/<ImageStyle[\s\S]*?\/>/);
  let tag, artRef;
  if (imageStyleM) {
    tag = imageStyleM[0];
    const im = tag.match(/image=\{([^}]+)\}/);
    artRef = im ? im[1].trim() : null;
  } else {
    let imgTags = [...src.matchAll(/<img[\s\S]*?\/>/g)];
    var shadowSpec;
    if (imgTags.length === 2) {
      // shadow + art composition (ApprenticeBeaver template)
      const shadowIdx = imgTags.findIndex((t) => /src=\{shadow\}/.test(t[0]));
      if (shadowIdx === -1) { problems.push([file, "imgs=2 no shadow", name]); continue; }
      const sTag = imgTags[shadowIdx][0];
      shadowSpec = {};
      for (const m of sTag.matchAll(/(width|bottom|left|right|top)\s*:\s*`\$\{PIXEL_SCALE\s*\*\s*(-?[\d.]+)\s*\}px`/g)) {
        shadowSpec[m[1]] = Number(m[2]);
      }
      imgTags = [imgTags[1 - shadowIdx]];
    }
    if (imgTags.length !== 1) { problems.push([file, `imgs=${imgTags.length}`, name]); continue; }
    tag = imgTags[0][0];
    const srcM = tag.match(/src=\{([^}]+)\}/);
    artRef = srcM ? srcM[1].trim() : null;
  }
  if (!artRef) { problems.push([file, "no src", name]); continue; }
  let art;
  if (imports[artRef]) art = imports[artRef];
  else if (/^ITEM_DETAILS\[/.test(artRef) && artRef.endsWith(".image")) art = "ITEM_DETAILS";
  else if (/^SUNNYSIDE\./.test(artRef)) art = artRef;
  else { problems.push([file, "src expr: " + artRef, name]); continue; }

  // style numbers: PIXEL_SCALE * N  (also bare numbers like `${PIXEL_SCALE * -3}px`)
  const style = {};
  for (const m of tag.matchAll(/(width|bottom|left|right|top)\s*:\s*`\$\{PIXEL_SCALE\s*\*\s*(-?[\d.]+)\s*\}px`/g)) {
    style[m[1]] = Number(m[2]);
  }
  // wrapper div style (Template B): capture its offsets too
  const divM = src.match(/<div[\s\S]*?>/);
  const wrapper = {};
  if (divM && divM[0].includes("PIXEL_SCALE")) {
    for (const m of divM[0].matchAll(/(width|bottom|left|right|top)\s*:\s*`\$\{PIXEL_SCALE\s*\*\s*(-?[\d.]+)\s*\}px`/g)) {
      wrapper[m[1]] = Number(m[2]);
    }
  }
  const centered = /left-1\/2/.test(tag);
  if (style.width === undefined && wrapper.width === undefined) { problems.push([file, "no width", name]); continue; }

  results[name] = {
    file,
    art,
    img: style,
    wrapper: Object.keys(wrapper).length ? wrapper : undefined,
    centered: centered || undefined,
    shadow: typeof shadowSpec !== "undefined" ? shadowSpec : undefined,
  };
  shadowSpec = undefined;
}
fs.writeFileSync(__dirname + "/collectibles-static.json", JSON.stringify(results, null, 1));
console.log("extracted:", Object.keys(results).length, "problems:", problems.length);
for (const p of problems) console.log("PROBLEM:", p.join(" | "));
