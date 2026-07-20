import {
  downgradeChapterCropWeekSkills,
  hasUpgradedChapterCropWeekSkill,
} from "./bumpkinSkills";
import type { Skills } from "./game";
import { COOKABLES, COOKABLE_CAKES } from "./consumables";
import { isMediumCrop } from "./crops";
import {
  CHAPTER_CROP_WEEK_CROP,
  CHAPTER_CROP_WEEK_RECIPE,
} from "./chapterCropWeek";

describe("downgradeChapterCropWeekSkills", () => {
  it("caps upgraded Crops and Cooking ranks at 1", () => {
    const result = downgradeChapterCropWeekSkills({
      "Green Thumb": 3, // Crops
      "Double Nom": 2, // Cooking
    });
    expect(result["Green Thumb"]).toBe(1);
    expect(result["Double Nom"]).toBe(1);
  });

  it("leaves rank 1 and unrelated skill trees unchanged", () => {
    const result = downgradeChapterCropWeekSkills({
      "Green Thumb": 1, // Crops, already base rank
      "Iron Bumpkin": 3, // Mining, out of scope
    });
    expect(result["Green Thumb"]).toBe(1);
    expect(result["Iron Bumpkin"]).toBe(3);
  });

  it("does not mutate the input object", () => {
    const skills: Skills = { "Green Thumb": 3 };
    downgradeChapterCropWeekSkills(skills);
    expect(skills["Green Thumb"]).toBe(3);
  });

  it("returns the same reference when nothing needs capping", () => {
    const skills: Skills = { "Iron Bumpkin": 3, "Green Thumb": 1 };
    expect(downgradeChapterCropWeekSkills(skills)).toBe(skills);
  });
});

describe("hasUpgradedChapterCropWeekSkill", () => {
  it("is true when a skill in the tree is rank 2+", () => {
    expect(hasUpgradedChapterCropWeekSkill({ "Green Thumb": 2 }, "Crops")).toBe(
      true,
    );
    expect(
      hasUpgradedChapterCropWeekSkill({ "Double Nom": 3 }, "Cooking"),
    ).toBe(true);
  });

  it("is false at rank 1 (base effect still applies)", () => {
    expect(hasUpgradedChapterCropWeekSkill({ "Green Thumb": 1 }, "Crops")).toBe(
      false,
    );
  });

  it("respects the tree argument", () => {
    // A rank-2 Cooking skill does not trigger the Crops notice, and vice versa.
    expect(hasUpgradedChapterCropWeekSkill({ "Double Nom": 2 }, "Crops")).toBe(
      false,
    );
    expect(
      hasUpgradedChapterCropWeekSkill({ "Green Thumb": 2 }, "Cooking"),
    ).toBe(false);
  });

  it("ignores upgraded skills from unrelated trees", () => {
    expect(
      hasUpgradedChapterCropWeekSkill({ "Iron Bumpkin": 3 }, "Crops"),
    ).toBe(false);
  });

  it("ignores in-tree skills that can't affect the event item", () => {
    // Frosted Cakes only affects cakes, and Saltbite is not a cake.
    expect(
      hasUpgradedChapterCropWeekSkill({ "Frosted Cakes": 3 }, "Cooking"),
    ).toBe(false);
    // Young Farmer (basic) / Old Farmer (advanced) don't affect medium Saltwort.
    expect(
      hasUpgradedChapterCropWeekSkill({ "Young Farmer": 3 }, "Crops"),
    ).toBe(false);
    expect(hasUpgradedChapterCropWeekSkill({ "Old Farmer": 3 }, "Crops")).toBe(
      false,
    );
  });
});

describe("CHAPTER_CROP_WEEK notice-skill assumptions", () => {
  // The notice skill sets are hand-picked from the event items' properties; guard
  // those assumptions so a future crop/recipe tweak fails loudly here instead of
  // silently mis-showing (or hiding) the "boosts paused" notice.
  it("Saltwort is a medium plot crop", () => {
    expect(isMediumCrop(CHAPTER_CROP_WEEK_CROP)).toBe(true);
  });

  it("Saltbite is a non-cake Fire Pit recipe", () => {
    expect(COOKABLES[CHAPTER_CROP_WEEK_RECIPE].building).toBe("Fire Pit");
    expect(CHAPTER_CROP_WEEK_RECIPE in COOKABLE_CAKES).toBe(false);
  });
});
