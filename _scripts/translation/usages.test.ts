import { findKeyUsages } from "./usages";

const PANEL = [
  "function Panel() {",
  "  return (",
  "    <div>",
  "      <Button onClick={onClear}>",
  '        {t("clear")}',
  "      </Button>",
  "    </div>",
  "  );",
  "}",
].join("\n");

describe("findKeyUsages", () => {
  it("shows the lines around the key, without the shared indentation", () => {
    const usages = findKeyUsages("clear", [
      { path: "src/Panel.tsx", text: PANEL },
    ]);

    expect(usages).toEqual([
      {
        file: "src/Panel.tsx",
        code: [
          "return (",
          "  <div>",
          "    <Button onClick={onClear}>",
          '      {t("clear")}',
          "    </Button>",
          "  </div>",
          ");",
        ].join("\n"),
      },
    ]);
  });

  it("stops at the start and end of the file", () => {
    const usages = findKeyUsages("intro", [
      { path: "src/a.ts", text: 'const title = t("intro");\nshow(title);' },
    ]);

    expect(usages).toEqual([
      { file: "src/a.ts", code: 'const title = t("intro");\nshow(title);' },
    ]);
  });

  it("matches single quotes and backticks", () => {
    const usages = findKeyUsages("intro", [
      { path: "src/a.ts", text: "translate('intro');" },
      { path: "src/b.ts", text: "translate(`intro`);" },
    ]);

    expect(usages.map(({ file }) => file)).toEqual(["src/a.ts", "src/b.ts"]);
  });

  it("does not match a longer key or a key built in code", () => {
    const usages = findKeyUsages("clear", [
      { path: "src/a.ts", text: 't("clearAll"); t(`clear.${type}`);' },
    ]);

    expect(usages).toEqual([]);
  });

  it("takes one snippet per file and at most two files", () => {
    const text = 't("intro");\n\n\n\n\n\n\n\nt("intro");';
    const usages = findKeyUsages("intro", [
      { path: "src/a.ts", text },
      { path: "src/b.ts", text: 't("intro");' },
      { path: "src/c.ts", text: 't("intro");' },
    ]);

    expect(usages.map(({ file }) => file)).toEqual(["src/a.ts", "src/b.ts"]);
    expect(usages[0].code).toEqual('t("intro");');
  });

  it("keeps only the matching line when the snippet is too long", () => {
    const long = `const x = "${"a".repeat(600)}";`;
    const usages = findKeyUsages("intro", [
      { path: "src/a.ts", text: `${long}\n    t("intro"),\n${long}` },
    ]);

    expect(usages).toEqual([{ file: "src/a.ts", code: 't("intro"),' }]);
  });

  it("returns nothing for a key the code never uses", () => {
    expect(
      findKeyUsages("unused", [{ path: "src/Panel.tsx", text: PANEL }]),
    ).toEqual([]);
  });
});
