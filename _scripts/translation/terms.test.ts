import {
  getPlaceholders,
  mergeTranslations,
  planTranslation,
  validateTranslations,
} from "./terms";

describe("getPlaceholders", () => {
  it("returns every {{placeholder}} in the text", () => {
    expect(getPlaceholders("Pay {{price}} for {{item}}")).toEqual([
      "{{price}}",
      "{{item}}",
    ]);
  });

  it("returns nothing for plain text", () => {
    expect(getPlaceholders("Land Tools")).toEqual([]);
  });
});

describe("planTranslation", () => {
  it("keeps a term whose English text has not changed", () => {
    const plan = planTranslation({
      english: { hello: "Hello" },
      snapshot: { hello: "Hello" },
      existing: { hello: "Hallo" },
    });

    expect(plan).toEqual({ kept: { hello: "Hallo" }, pending: [] });
  });

  it("translates a term that is new", () => {
    const plan = planTranslation({
      english: { hello: "Hello", bye: "Bye" },
      snapshot: { hello: "Hello" },
      existing: { hello: "Hallo" },
    });

    expect(plan).toEqual({ kept: { hello: "Hallo" }, pending: ["bye"] });
  });

  it("translates a term again when its English text changed", () => {
    const plan = planTranslation({
      english: { hello: "Hello there" },
      snapshot: { hello: "Hello" },
      existing: { hello: "Hallo" },
    });

    expect(plan).toEqual({ kept: {}, pending: ["hello"] });
  });

  it("translates a term the last run left out of the locale", () => {
    const plan = planTranslation({
      english: { hello: "Hello" },
      snapshot: { hello: "Hello" },
      existing: {},
    });

    expect(plan).toEqual({ kept: {}, pending: ["hello"] });
  });

  it("drops a term that was removed from the dictionary", () => {
    const plan = planTranslation<string>({
      english: { hello: "Hello" },
      snapshot: { hello: "Hello", old: "Old" },
      existing: { hello: "Hallo", old: "Alt" },
    });

    expect(plan).toEqual({ kept: { hello: "Hallo" }, pending: [] });
  });

  it("does not send blank English text for translation", () => {
    const plan = planTranslation({
      english: { blank: "  " },
      snapshot: {},
      existing: {},
    });

    expect(plan).toEqual({ kept: {}, pending: [] });
  });
});

describe("mergeTranslations", () => {
  it("keeps existing terms first, then adds new ones in dictionary order", () => {
    const merged = mergeTranslations({
      english: { a: "A", b: "B", c: "C", d: "D" },
      kept: { c: "c-de", a: "a-de" },
      translated: { d: "d-de", b: "b-de" },
    });

    expect(Object.entries(merged)).toEqual([
      ["c", "c-de"],
      ["a", "a-de"],
      ["b", "b-de"],
      ["d", "d-de"],
    ]);
  });

  it("leaves out a term that has no translation, so the next run retries it", () => {
    const merged = mergeTranslations({
      english: { a: "A", b: "B" },
      kept: { a: "a-de" },
      translated: {},
    });

    expect(merged).toEqual({ a: "a-de" });
  });

  it("writes blank English text as an empty string", () => {
    const merged = mergeTranslations({
      english: { blank: " " },
      kept: {},
      translated: {},
    });

    expect(merged).toEqual({ blank: "" });
  });
});

describe("validateTranslations", () => {
  it("accepts a translation that keeps its placeholders", () => {
    const result = validateTranslations({
      requested: { cost: "Costs {{gems}} Gems" },
      returned: [{ key: "cost", text: "Kostet {{gems}} Edelsteine" }],
    });

    expect(result).toEqual({
      accepted: { cost: "Kostet {{gems}} Edelsteine" },
      rejected: [],
    });
  });

  it("accepts placeholders in a different order", () => {
    const result = validateTranslations({
      requested: { trade: "{{name}} bought {{item}}" },
      returned: [{ key: "trade", text: "{{item}} wurde von {{name}} gekauft" }],
    });

    expect(result.rejected).toEqual([]);
  });

  it("rejects a translation that lost a placeholder", () => {
    const result = validateTranslations({
      requested: { cost: "Costs {{gems}} Gems" },
      returned: [{ key: "cost", text: "Kostet Edelsteine" }],
    });

    expect(result).toEqual({
      accepted: {},
      rejected: [{ key: "cost", reason: "placeholders" }],
    });
  });

  it("rejects a translation that changed a placeholder", () => {
    const result = validateTranslations({
      requested: { cost: "Costs {{gems}} Gems" },
      returned: [{ key: "cost", text: "Kostet {{edelsteine}} Edelsteine" }],
    });

    expect(result.rejected).toEqual([{ key: "cost", reason: "placeholders" }]);
  });

  it("rejects a translation that added a placeholder", () => {
    const result = validateTranslations({
      requested: { hello: "Hello" },
      returned: [{ key: "hello", text: "Hallo {{name}}" }],
    });

    expect(result.rejected).toEqual([{ key: "hello", reason: "placeholders" }]);
  });

  it("accepts a translation that repeats a placeholder as often as the English", () => {
    const result = validateTranslations({
      requested: { failed: "Your {{type}} failed. Retry the {{type}}." },
      returned: [
        {
          key: "failed",
          text: "{{type}} fehlgeschlagen. {{type}} wiederholen.",
        },
      ],
    });

    expect(result.rejected).toEqual([]);
  });

  it("rejects a translation that uses a repeated placeholder only once", () => {
    const result = validateTranslations({
      requested: { failed: "Your {{type}} failed. Retry the {{type}}." },
      returned: [{ key: "failed", text: "{{type}} fehlgeschlagen." }],
    });

    expect(result.rejected).toEqual([
      { key: "failed", reason: "placeholders" },
    ]);
  });

  it("rejects a translation that uses a placeholder more often than the English", () => {
    const result = validateTranslations({
      requested: { cost: "Costs {{gems}} Gems" },
      returned: [{ key: "cost", text: "{{gems}} Edelsteine, {{gems}}" }],
    });

    expect(result.rejected).toEqual([{ key: "cost", reason: "placeholders" }]);
  });

  it("rejects an empty translation", () => {
    const result = validateTranslations({
      requested: { hello: "Hello" },
      returned: [{ key: "hello", text: "  " }],
    });

    expect(result.rejected).toEqual([{ key: "hello", reason: "empty" }]);
  });

  it("rejects a requested term that was not returned", () => {
    const result = validateTranslations({
      requested: { hello: "Hello", bye: "Bye" },
      returned: [{ key: "hello", text: "Hallo" }],
    });

    expect(result).toEqual({
      accepted: { hello: "Hallo" },
      rejected: [{ key: "bye", reason: "missing" }],
    });
  });

  it("ignores a key that was not requested", () => {
    const result = validateTranslations({
      requested: { hello: "Hello" },
      returned: [
        { key: "hello", text: "Hallo" },
        { key: "invented", text: "Erfunden" },
      ],
    });

    expect(result).toEqual({ accepted: { hello: "Hallo" }, rejected: [] });
  });

  it("uses the first valid translation when a key is returned twice", () => {
    const result = validateTranslations({
      requested: { hello: "Hello" },
      returned: [
        { key: "hello", text: "Hallo" },
        { key: "hello", text: "Servus" },
      ],
    });

    expect(result).toEqual({ accepted: { hello: "Hallo" }, rejected: [] });
  });

  it("trims the translated text", () => {
    const result = validateTranslations({
      requested: { hello: "Hello" },
      returned: [{ key: "hello", text: " Hallo\n" }],
    });

    expect(result.accepted).toEqual({ hello: "Hallo" });
  });
});
