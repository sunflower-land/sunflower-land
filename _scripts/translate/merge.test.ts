import { mirrorEnglish, seedFromExisting } from "./merge";

describe("seedFromExisting", () => {
  it("carries existing translations forward", () => {
    const seeded = seedFromExisting(
      { plant: "Pflanzen", build: "Bauen" },
      { plant: "Plant", build: "Build" },
    );
    expect(seeded).toEqual({ plant: "Pflanzen", build: "Bauen" });
  });

  it("drops keys no longer in the dictionary", () => {
    const seeded = seedFromExisting(
      { plant: "Pflanzen", retired: "Alt" },
      { plant: "Plant" },
    );
    expect(seeded).toEqual({ plant: "Pflanzen" });
  });

  it("preserves the existing file's key order, not the dictionary's", () => {
    // Rebuilding in dictionary order rewrites every line of the file, which
    // buries real changes in a whole-file reorder.
    const seeded = seedFromExisting(
      { c: "C", a: "A", b: "B" },
      { a: "A", b: "B", c: "C" },
    );
    expect(Object.keys(seeded)).toEqual(["c", "a", "b"]);
  });

  it("does not invent keys that have no translation yet", () => {
    // New keys are appended by the caller once actually translated.
    const seeded = seedFromExisting(
      { plant: "Pflanzen" },
      { plant: "Plant", ok: "OK" },
    );
    expect(seeded).toEqual({ plant: "Pflanzen" });
  });
});

describe("mirrorEnglish", () => {
  const english = { plant: "Plant", ok: "OK", send: "Send" };

  it("keeps existing translations", () => {
    // The regression that wiped all 9,519 Russian strings in a single commit:
    // every key was overwritten with English, not just the untranslated ones.
    const result = mirrorEnglish(
      { plant: "Посадить", send: "Отправить" },
      english,
      english,
    );
    expect(result.plant).toBe("Посадить");
    expect(result.send).toBe("Отправить");
  });

  it("fills untranslated keys with English", () => {
    const result = mirrorEnglish({ plant: "Посадить" }, english, english);
    expect(result.ok).toBe("OK");
  });

  it("replaces a translation whose English source has changed", () => {
    // Its old translation describes copy that no longer exists. Matches the
    // legacy AWS behaviour.
    const result = mirrorEnglish(
      { plant: "Посадить" },
      { ...english, plant: "Plant a seed" },
      english,
    );
    expect(result.plant).toBe("Plant a seed");
  });

  it("covers every dictionary key", () => {
    const result = mirrorEnglish({}, english, {});
    expect(Object.keys(result).sort()).toEqual(["ok", "plant", "send"]);
  });

  it("does not mutate its input", () => {
    const seeded = { plant: "Посадить" };
    mirrorEnglish(seeded, english, english);
    expect(seeded).toEqual({ plant: "Посадить" });
  });
});
