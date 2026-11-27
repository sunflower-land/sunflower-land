import fs from "fs";
import path from "path";

const REPO_ROOT = path.resolve(__dirname, "../../../..");
const VI_DICT_PATH = path.resolve(__dirname, "vi.json");
const FONT_PATH = path.join(REPO_ROOT, "public/fonts/Hint.ttf");

const VN_LOWER =
  "aàáảãạăằắẳẵặâầấẩẫậbcdđeèéẻẽẹêềếểễệghiìíỉĩịklmnoòóỏõọôồốổỗộơờớởỡợpqrstuùúủũụưừứửữựvxyỳýỷỹỵ";
const VN_ALL = `${VN_LOWER}${VN_LOWER.toUpperCase()}`;
const UI_PUNCT = "•–—…→₫";
// Limit dictionary regression checks to Latin/Vietnamese letter ranges so
// translation-bot additions containing new emojis or symbols do not break CI.
const LATIN_LETTER_RE = /^[A-Za-z\u00C0-\u024F\u1E00-\u1EFF]$/;

function readFontTables(ttfBuf: Buffer) {
  const numTables = ttfBuf.readUInt16BE(4);
  const tables = new Map<string, number>();
  for (let i = 0; i < numTables; i++) {
    const off = 12 + i * 16;
    tables.set(
      ttfBuf.toString("latin1", off, off + 4),
      ttfBuf.readUInt32BE(off + 8),
    );
  }

  const hheaOffset = tables.get("hhea");
  const cmapOffset = tables.get("cmap");
  if (hheaOffset === undefined || cmapOffset === undefined) {
    throw new Error("Hint.ttf missing required hhea or cmap table");
  }

  const hhea = {
    ascent: ttfBuf.readInt16BE(hheaOffset + 4),
    descent: ttfBuf.readInt16BE(hheaOffset + 6),
    lineGap: ttfBuf.readInt16BE(hheaOffset + 8),
  };

  const numSubtables = ttfBuf.readUInt16BE(cmapOffset + 2);
  const codepoints = new Set<number>();
  for (let i = 0; i < numSubtables; i++) {
    const rec = cmapOffset + 4 + i * 8;
    const pid = ttfBuf.readUInt16BE(rec);
    const eid = ttfBuf.readUInt16BE(rec + 2);
    const subOff = cmapOffset + ttfBuf.readUInt32BE(rec + 4);
    const fmt = ttfBuf.readUInt16BE(subOff);
    if (fmt !== 4 || pid !== 3 || eid !== 1) continue;

    const segCount = ttfBuf.readUInt16BE(subOff + 6) / 2;
    const endStart = subOff + 14;
    const startStart = endStart + 2 * segCount + 2;
    const deltaStart = startStart + 2 * segCount;
    const rangeStart = deltaStart + 2 * segCount;
    for (let s = 0; s < segCount; s++) {
      const startCode = ttfBuf.readUInt16BE(startStart + 2 * s);
      const endCode = ttfBuf.readUInt16BE(endStart + 2 * s);
      const idDelta = ttfBuf.readInt16BE(deltaStart + 2 * s);
      const roPos = rangeStart + 2 * s;
      const rangeOffset = ttfBuf.readUInt16BE(roPos);
      if (startCode === 0xffff) continue;
      for (let cp = startCode; cp <= endCode; cp++) {
        let gid = 0;
        if (rangeOffset === 0) {
          gid = (cp + idDelta) & 0xffff;
        } else {
          const gpos = roPos + rangeOffset + 2 * (cp - startCode);
          gid = ttfBuf.readUInt16BE(gpos);
          if (gid !== 0) gid = (gid + idDelta) & 0xffff;
        }
        if (gid !== 0) codepoints.add(cp);
      }
    }
  }

  return { hhea, codepoints };
}

describe("Vietnamese BasicVi Hint.ttf font coverage", () => {
  const viDict = JSON.parse(fs.readFileSync(VI_DICT_PATH, "utf8")) as Record<
    string,
    string
  >;
  const { hhea, codepoints } = readFontTables(fs.readFileSync(FONT_PATH));

  it("maps all 134 Vietnamese letters, 6 UI symbols, and Latin/Vietnamese letters in vi.json", () => {
    expect(hhea).toEqual({ ascent: 768, descent: -128, lineGap: 92 });

    const missingAlphabet = [...VN_ALL, ...UI_PUNCT].filter(
      (ch) => !codepoints.has(ch.codePointAt(0)!),
    );
    expect(missingAlphabet).toEqual([]);

    const missingLatinChars = new Set<string>();
    for (const value of Object.values(viDict)) {
      if (typeof value !== "string") continue;
      for (const ch of value) {
        if (!LATIN_LETTER_RE.test(ch)) continue;
        if (!codepoints.has(ch.codePointAt(0)!)) {
          missingLatinChars.add(ch);
        }
      }
    }
    expect([...missingLatinChars]).toEqual([]);
  });
});
