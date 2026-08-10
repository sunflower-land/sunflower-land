import ENGLISH_TERMS from "lib/i18n/dictionaries/dictionary.json";
import { CHAPTER_ORDER, CHAPTER_TICKET_NAME } from "./chapters";
import { getKeys } from "lib/object";

describe("chapter ticket boost labels", () => {
  // The megastore buff labels build the translation key dynamically from the
  // chapter ticket name (see bumpkinItemBuffs.ts / collectibleItemBuffs.ts),
  // so a missing dictionary entry renders as a raw key in the UI.
  //
  // Chapters before Winds of Change predate this mechanism and have no keys,
  // so the assertion starts there. Deterministic (no Date.now()) so coverage
  // does not shrink as chapters end.
  it("has a +1 ticket translation for every chapter since Winds of Change", () => {
    const chapters = getKeys(CHAPTER_TICKET_NAME).filter(
      (chapter) => CHAPTER_ORDER[chapter] >= CHAPTER_ORDER["Winds of Change"],
    );

    expect(chapters.length).toBeGreaterThan(0);

    chapters.forEach((chapter) => {
      const ticket = CHAPTER_TICKET_NAME[chapter];
      const key = `description.bonus${ticket.replace(/\s+/g, "")}.boost`;

      expect((ENGLISH_TERMS as Record<string, string>)[key]).toBeDefined();
    });
  });
});
