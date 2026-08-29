/* Extract inline ImageStyle + TemplateCollectible entries from CollectibleCollection.tsx */
const fs = require("fs");
const FILE = "/Users/adamhannigan/Documents/workspace/sunflower-land/src/features/island/collectibles/CollectibleCollection.tsx";
const src = fs.readFileSync(FILE, "utf8");

const imports = {};
for (const m of src.matchAll(/import\s+(\w+)\s+from\s+"(assets\/[^"]+)"/g)) imports[m[1]] = m[2];

const inline = {}; const templates = []; const problems = [];

// Inline arrow entries: "Name": () => ( ... )  — capture balanced-ish block up to the closing "),\n"
const entryRe = /"([^"]+)":\s*\([^)]*\)\s*=>\s*\(([\s\S]*?)\n  \),\n/g;
for (const m of src.matchAll(entryRe)) {
  const [_, name, body] = m;
  if (/<TemplateCollectible/.test(body)) { templates.push(name); continue; }
  const isM = body.match(/<ImageStyle[\s\S]*?\/>/);
  if (!isM) {
    // plain div+img inline blocks
    const imgM = body.match(/<img[\s\S]*?\/>/);
    if (!imgM) { problems.push([name, "no ImageStyle/img"]); continue; }
  }
  const tag = isM ? isM[0] : body;
  const style = {}; const wrapper = {};
  const divM = tag.match(/divStyle=\{\{([\s\S]*?)\}\}/);
  const imgStyleM = tag.match(/imgStyle=\{\{([\s\S]*?)\}\}/);
  const grab = (text, target) => {
    for (const mm of text.matchAll(/(width|bottom|left|right|top)\s*:\s*`\$\{PIXEL_SCALE\s*\*\s*\(?\s*(-?[\d.]+)\s*\)?\s*\}px`/g)) target[mm[1]] = Number(mm[2]);
  };
  if (divM) grab(divM[1], wrapper);
  if (imgStyleM) grab(imgStyleM[1], style);
  if (!divM && !imgStyleM) grab(tag, style);

  let art;
  const imM = tag.match(/image=\{([^}]+)\}/) || body.match(/src=\{([^}]+)\}/);
  if (imM) {
    const ref = imM[1].trim();
    if (imports[ref]) art = imports[ref];
    else if (/^ITEM_DETAILS\[/.test(ref) && ref.endsWith(".image")) art = "ITEM_DETAILS";
    else if (/^SUNNYSIDE\./.test(ref)) art = ref;
    else { problems.push([name, "art expr " + ref.slice(0, 50)]); continue; }
  } else { problems.push([name, "no image"]); continue; }

  const width = style.width ?? wrapper.width;
  if (width === undefined) { problems.push([name, "no width"]); continue; }
  const pos = Object.keys(wrapper).length ? wrapper : style;
  inline[name] = { art, img: style, wrapper: Object.keys(wrapper).length ? wrapper : undefined };
}

// Bare TemplateCollectible arrow entries without parens: "Name": () => <TemplateCollectible .../>
for (const m of src.matchAll(/"([^"]+)":\s*\([^)]*\)\s*=>\s*<TemplateCollectible/g)) templates.push(m[1]);

fs.writeFileSync(__dirname + "/collectibles-inline.json", JSON.stringify({ inline, templates: [...new Set(templates)] }, null, 1));
console.log("inline:", Object.keys(inline).length, "templates:", new Set(templates).size, "problems:", problems.length);
problems.slice(0, 30).forEach((p) => console.log("PROBLEM:", p.join(" | ")));
