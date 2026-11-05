import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { CONFIG } from "lib/config";
import type { GameState } from "./game";
import {
  CHAPTER_CROP_WEEK,
  CHAPTER_CROP_WEEKS,
  hasChapterCropWeekAccess,
  isChapterCropWeekActive,
  isRetiredChapterCropWeekItem,
} from "./chapterCropWeek";

const DAY = 24 * 60 * 60 * 1000;
const beforeStart = CHAPTER_CROP_WEEK.startDate.getTime() - DAY;
const duringEvent = CHAPTER_CROP_WEEK.startDate.getTime() + DAY;
const afterEnd = CHAPTER_CROP_WEEK.endDate.getTime() + DAY;

// Admin testers = adminFeatureFlag (Gift Giver worn/owned + Beta Pass).
const ADMIN_FARM: GameState = {
  ...TEST_FARM,
  wardrobe: { ...TEST_FARM.wardrobe, "Gift Giver": 1 },
  inventory: { ...TEST_FARM.inventory, "Beta Pass": new Decimal(1) },
};

describe("isChapterCropWeekActive", () => {
  it("is only true inside the event window", () => {
    expect(isChapterCropWeekActive(beforeStart)).toBe(false);
    expect(isChapterCropWeekActive(CHAPTER_CROP_WEEK.startDate.getTime())).toBe(
      true,
    );
    expect(isChapterCropWeekActive(duringEvent)).toBe(true);
    expect(isChapterCropWeekActive(CHAPTER_CROP_WEEK.endDate.getTime())).toBe(
      false,
    );
    expect(isChapterCropWeekActive(afterEnd)).toBe(false);
  });
});

describe("hasChapterCropWeekAccess", () => {
  // adminFeatureFlag is always on for testnet (CI runs with VITE_NETWORK=amoy),
  // so pin mainnet to exercise the real Gift Giver + Beta Pass rule.
  let previousNetwork: (typeof CONFIG)["NETWORK"];
  beforeEach(() => {
    previousNetwork = CONFIG.NETWORK;
    CONFIG.NETWORK = "mainnet";
  });
  afterEach(() => {
    CONFIG.NETWORK = previousNetwork;
  });

  it("blocks regular players before the event starts", () => {
    expect(hasChapterCropWeekAccess(TEST_FARM, beforeStart)).toBe(false);
  });

  it("lets admin testers in before the event starts", () => {
    expect(hasChapterCropWeekAccess(ADMIN_FARM, beforeStart)).toBe(true);
  });

  it("lets everyone in during the event", () => {
    expect(hasChapterCropWeekAccess(TEST_FARM, duringEvent)).toBe(true);
    expect(hasChapterCropWeekAccess(ADMIN_FARM, duringEvent)).toBe(true);
  });

  it("blocks everyone, admins included, after the event ends", () => {
    expect(hasChapterCropWeekAccess(TEST_FARM, afterEnd)).toBe(false);
    expect(hasChapterCropWeekAccess(ADMIN_FARM, afterEnd)).toBe(false);
  });
});

describe("isRetiredChapterCropWeekItem", () => {
  it("keeps the current run's items live until its end date", () => {
    const { seed, crop, recipe } = CHAPTER_CROP_WEEK;

    for (const item of [seed, crop, recipe]) {
      expect(isRetiredChapterCropWeekItem(item, beforeStart)).toBe(false);
      expect(isRetiredChapterCropWeekItem(item, duringEvent)).toBe(false);
    }
  });

  it("retires the current run's items once its end date passes", () => {
    const { seed, crop, recipe } = CHAPTER_CROP_WEEK;

    for (const item of [seed, crop, recipe]) {
      expect(
        isRetiredChapterCropWeekItem(item, CHAPTER_CROP_WEEK.endDate.getTime()),
      ).toBe(true);
      expect(isRetiredChapterCropWeekItem(item, afterEnd)).toBe(true);
    }
  });

  it("retires every earlier run's items", () => {
    expect(isRetiredChapterCropWeekItem("Saltwort Seed", duringEvent)).toBe(
      true,
    );
    expect(isRetiredChapterCropWeekItem("Saltwort", duringEvent)).toBe(true);
    expect(isRetiredChapterCropWeekItem("Saltbite", duringEvent)).toBe(true);
  });

  it("never retires items outside Chapter Crop Week", () => {
    expect(isRetiredChapterCropWeekItem("Sunflower Seed", afterEnd)).toBe(
      false,
    );
    expect(isRetiredChapterCropWeekItem("Kale", afterEnd)).toBe(false);
  });

  it("treats the last registered run as the current one", () => {
    expect(CHAPTER_CROP_WEEK).toBe(
      CHAPTER_CROP_WEEKS[CHAPTER_CROP_WEEKS.length - 1],
    );
  });
});

describe("CHAPTER_CROP_WEEKS", () => {
  it("lists runs oldest first, each starting after the previous one ends", () => {
    CHAPTER_CROP_WEEKS.forEach((run, index) => {
      expect(run.startDate.getTime()).toBeLessThan(run.endDate.getTime());

      const previous = CHAPTER_CROP_WEEKS[index - 1];
      if (previous) {
        expect(run.startDate.getTime()).toBeGreaterThanOrEqual(
          previous.endDate.getTime(),
        );
      }
    });
  });
});
