import ENGLISH_TERMS from "lib/i18n/dictionaries/dictionary.json";
import { CHAPTERS, CHAPTER_TICKET_NAME } from "./chapters";
import { getKeys } from "lib/object";

describe("chapter ticket boost labels", () => {
  // The megastore buff labels build the translation key dynamically from the
  // chapter ticket name (see bumpkinItemBuffs.ts / collectibleItemBuffs.ts),
  // so a missing dictionary entry renders as a raw key in the UI.
  it("has a +1 ticket translation for every chapter that can still be active", () => {
    const now = Date.now();
    const upcomingChapters = getKeys(CHAPTERS).filter(
      (chapter) => CHAPTERS[chapter].endDate.getTime() > now,
    );

    upcomingChapters.forEach((chapter) => {
      const ticket = CHAPTER_TICKET_NAME[chapter];
      const key = `description.bonus${ticket.replace(/\s+/g, "")}.boost`;

      expect((ENGLISH_TERMS as Record<string, string>)[key]).toBeDefined();
    });
  });
});
