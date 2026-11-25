import {
  getContextReferences,
  getNameReferences,
  getPlaceholders,
  getReferenceTerms,
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

// A dictionary key can share its name with something every object inherits.
describe("keys named like inherited object properties", () => {
  it("plans a new term named constructor for translation", () => {
    const plan = planTranslation({
      english: { constructor: "Build" },
      snapshot: {},
      existing: {},
    });

    expect(plan.pending).toEqual(["constructor"]);
  });

  it("merges a translated term named toString", () => {
    const merged = mergeTranslations({
      english: { toString: "Text" },
      kept: {},
      translated: { toString: "Texto" },
    });

    expect(Object.entries(merged)).toEqual([["toString", "Texto"]]);
  });

  it("accepts a translation for a term named constructor", () => {
    const result = validateTranslations({
      requested: { constructor: "Build" },
      returned: [{ key: "constructor", text: "Bauen" }],
    });

    expect(Object.entries(result.accepted)).toEqual([["constructor", "Bauen"]]);
    expect(result.rejected).toEqual([]);
  });

  it("rejects a term named constructor that was not returned", () => {
    const result = validateTranslations({
      requested: { constructor: "Build" },
      returned: [],
    });

    expect(result.rejected).toEqual([
      { key: "constructor", reason: "missing" },
    ]);
  });
});

describe("getReferenceTerms", () => {
  const english = {
    "market.buy.title": "Buy",
    "market.buy.confirm": "Confirm purchase",
    "market.buy.cancel": "Cancel",
    "market.sell.title": "Sell",
    "barn.title": "Barn",
    landTools: "Land Tools",
  };

  it("returns translated strings that share the new string\u0027s prefix", () => {
    const references = getReferenceTerms<string>({
      pending: ["market.buy.cancel"],
      english,
      kept: {
        "market.buy.title": "Kaufen",
        "market.buy.confirm": "Kauf bestätigen",
        "barn.title": "Scheune",
      },
    });

    expect(references).toEqual([
      { key: "market.buy.title", english: "Buy", translation: "Kaufen" },
      {
        key: "market.buy.confirm",
        english: "Confirm purchase",
        translation: "Kauf bestätigen",
      },
    ]);
  });

  it("falls back to a shorter prefix when the closest group is too small", () => {
    const references = getReferenceTerms<string>({
      pending: ["market.buy.cancel"],
      english,
      kept: { "market.sell.title": "Verkaufen", "barn.title": "Scheune" },
    });

    expect(references.map(({ key }) => key)).toEqual(["market.sell.title"]);
  });

  it("fills up from a shorter prefix without counting a string twice", () => {
    const references = getReferenceTerms<string>({
      pending: ["market.buy.cancel"],
      english,
      kept: { "market.buy.title": "Kaufen", "market.sell.title": "Verkaufen" },
      perTerm: 2,
    });

    expect(references.map(({ key }) => key)).toEqual([
      "market.buy.title",
      "market.sell.title",
    ]);
  });

  it("returns nothing for a key with no prefix", () => {
    const references = getReferenceTerms<string>({
      pending: ["landTools"],
      english,
      kept: { "barn.title": "Scheune" },
    });

    expect(references).toEqual([]);
  });

  it("never uses a string that is itself waiting for translation", () => {
    const references = getReferenceTerms<string>({
      pending: ["market.buy.cancel", "market.buy.confirm"],
      english,
      kept: { "market.buy.title": "Kaufen" },
    });

    expect(references.map(({ key }) => key)).toEqual(["market.buy.title"]);
  });

  it("shares references between new strings in the same group", () => {
    const references = getReferenceTerms<string>({
      pending: ["market.buy.cancel", "market.buy.confirm"],
      english,
      kept: { "market.buy.title": "Kaufen", "market.sell.title": "Verkaufen" },
      perTerm: 1,
    });

    expect(references.map(({ key }) => key)).toEqual(["market.buy.title"]);
  });

  it("limits the references for one string", () => {
    const references = getReferenceTerms<string>({
      pending: ["market.buy.cancel"],
      english,
      kept: {
        "market.buy.title": "Kaufen",
        "market.buy.confirm": "Kauf bestätigen",
        "market.sell.title": "Verkaufen",
      },
      perTerm: 2,
    });

    expect(references.map(({ key }) => key)).toEqual([
      "market.buy.title",
      "market.buy.confirm",
    ]);
  });

  it("limits the references for a whole request", () => {
    const references = getReferenceTerms<string>({
      pending: ["market.buy.cancel", "barn.door"],
      english: { ...english, "barn.door": "Door" },
      kept: {
        "market.buy.title": "Kaufen",
        "market.buy.confirm": "Kauf bestätigen",
        "barn.title": "Scheune",
      },
      limit: 2,
    });

    expect(references.map(({ key }) => key)).toEqual([
      "market.buy.title",
      "market.buy.confirm",
    ]);
  });

  it("skips long strings", () => {
    const references = getReferenceTerms<string>({
      pending: ["market.buy.cancel"],
      english: { ...english, "market.buy.title": "Buy ".repeat(100) },
      kept: { "market.buy.title": "Kaufen ".repeat(100) },
    });

    expect(references).toEqual([]);
  });
});

describe("getNameReferences", () => {
  const english = {
    "drink.carrotJuice": "Carrot Juice",
    "drink.juice": "Juice",
    "crop.potato": "Potato",
    clear: "Clear",
    welcome: "Welcome back!",
    "chore.carrotJuice": "Cook Carrot Juice 20 times",
    "chore.potato": "Harvest Potato 100 times",
    "chore.clear": "Clear the field",
    "chore.potatoes": "Harvest Potatoes",
    "chore.salad": "Make a potato salad",
    "chore.welcome": "Say Welcome back! to Betty",
  };
  const kept = {
    "drink.carrotJuice": "Karottensaft",
    "drink.juice": "Saft",
    "crop.potato": "Kartoffel",
    clear: "Leeren",
    welcome: "Willkommen zurück!",
  };

  it("sends the translation of a name the new string mentions", () => {
    const references = getNameReferences<string>({
      pending: ["chore.potato"],
      english,
      kept,
    });

    expect(references).toEqual([
      { key: "crop.potato", english: "Potato", translation: "Kartoffel" },
    ]);
  });

  it("prefers the longest name over a name inside it", () => {
    const references = getNameReferences<string>({
      pending: ["chore.carrotJuice"],
      english,
      kept,
    });

    expect(references.map(({ key }) => key)).toEqual(["drink.carrotJuice"]);
  });

  it("does not treat a one-word name at the start of a string as a name", () => {
    const references = getNameReferences<string>({
      pending: ["chore.clear"],
      english,
      kept,
    });

    expect(references).toEqual([]);
  });

  it("matches whole words with the same capitals only", () => {
    const references = getNameReferences<string>({
      pending: ["chore.potatoes", "chore.salad"],
      english,
      kept,
    });

    expect(references).toEqual([]);
  });

  it("does not treat a sentence as a name", () => {
    const references = getNameReferences<string>({
      pending: ["chore.welcome"],
      english,
      kept,
    });

    expect(references).toEqual([]);
  });

  it("skips names that have no translation yet or are waiting for one", () => {
    const references = getNameReferences<string>({
      pending: ["chore.potato", "crop.potato"],
      english,
      kept: {},
    });

    expect(references).toEqual([]);
  });

  it("uses the most common translation when a name has several", () => {
    const references = getNameReferences<string>({
      pending: ["chore.potato"],
      english: {
        ...english,
        "bud.potato": "Potato",
        "market.potato": "Potato",
      },
      kept: {
        "crop.potato": "Erdapfel",
        "bud.potato": "Kartoffel",
        "market.potato": "Kartoffel",
      },
    });

    expect(references).toEqual([
      { key: "bud.potato", english: "Potato", translation: "Kartoffel" },
    ]);
  });

  it("limits the names sent for one string", () => {
    const references = getNameReferences<string>({
      pending: ["chore.both"],
      english: { ...english, "chore.both": "Trade Potato for Carrot Juice" },
      kept,
      perTerm: 1,
    });

    expect(references.map(({ key }) => key)).toEqual(["drink.carrotJuice"]);
  });
});

describe("getContextReferences", () => {
  const english = {
    "crop.potato": "Potato",
    "crop.wheat": "Wheat",
    "bud.potato": "Potato",
    "market.potato": "Potato",
    "crop.task": "Plant a Potato seed",
  };
  const kept = {
    "crop.potato": "Erdapfel",
    "crop.wheat": "Weizen",
    "bud.potato": "Kartoffel",
    "market.potato": "Kartoffel",
  };

  it("keeps a name to the translation chosen for it", () => {
    const references = getContextReferences<string>({
      pending: ["crop.task"],
      english,
      kept,
    });

    expect(references).toEqual([
      { key: "bud.potato", english: "Potato", translation: "Kartoffel" },
      { key: "crop.wheat", english: "Wheat", translation: "Weizen" },
    ]);
  });

  it("sends each string only once", () => {
    const references = getContextReferences<string>({
      pending: ["crop.task"],
      english,
      kept: { ...kept, "crop.potato": "Kartoffel" },
    });

    expect(references.map(({ key }) => key)).toEqual([
      "crop.potato",
      "crop.wheat",
    ]);
  });
});
