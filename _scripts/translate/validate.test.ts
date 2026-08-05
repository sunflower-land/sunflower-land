import { validateTranslation, placeholdersIn } from "./validate";

describe("placeholdersIn", () => {
  it("extracts placeholders and tolerates inner whitespace", () => {
    expect(placeholdersIn("You need {{amount}} {{item}}")).toEqual([
      "{{amount}}",
      "{{item}}",
    ]);
    expect(placeholdersIn("{{ amount }}")).toEqual(["{{ amount }}"]);
  });

  it("returns nothing for plain text", () => {
    expect(placeholdersIn("Harvest")).toEqual([]);
  });
});

describe("validateTranslation", () => {
  const ok = (source: string, translated: string) =>
    expect(validateTranslation("k", source, translated)).toBeUndefined();

  const fails = (source: string, translated: string | undefined) =>
    expect(validateTranslation("k", source, translated)).toMatchObject({
      key: "k",
    });

  it("accepts a plain translation", () => {
    ok("Harvest", "Ernten");
  });

  it("accepts placeholders reproduced verbatim", () => {
    ok("You need {{amount}} Wood", "Du brauchst {{amount}} Wood");
  });

  it("accepts placeholders in a different order", () => {
    // Word order legitimately changes between languages, so position is not
    // something to validate -- only presence and count.
    ok("{{amount}} of {{item}}", "{{item}}을(를) {{amount}}개");
  });

  it("rejects a dropped placeholder", () => {
    // The failure that silently shipped ~30 broken strings on the AWS pipeline.
    fails("You need {{amount}} Wood", "Du brauchst Wood");
  });

  it("rejects an invented placeholder", () => {
    // A placeholder the source never had renders as literal braces in-game,
    // because nothing supplies a value for it.
    fails("Harvest", "Ernte {{amount}}");
  });

  it("rejects a duplicated placeholder", () => {
    fails("{{amount}} Wood", "{{amount}} {{amount}} Holz");
  });

  it("rejects a leaked legacy AWS marker", () => {
    // it.json and ja.json each still ship one of these.
    fails("You need {{amount}} Wood", "Ti serve [0@/$] Wood");
  });

  it("rejects empty or missing output", () => {
    fails("Harvest", "");
    fails("Harvest", "   ");
    fails("Harvest", undefined);
  });

  it("reports why it failed", () => {
    expect(
      validateTranslation("k", "You need {{amount}}", "Du brauchst"),
    ).toMatchObject({ reason: "missing-placeholder" });

    expect(validateTranslation("k", "Harvest", "")).toMatchObject({
      reason: "empty",
    });

    expect(validateTranslation("k", "{{a}}", "[0@/$]")).toMatchObject({
      reason: "legacy-token",
    });
  });
});
