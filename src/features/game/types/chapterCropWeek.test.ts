import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { CONFIG } from "lib/config";
import type { GameState } from "./game";
import {
  CHAPTER_CROP_WEEK,
  hasChapterCropWeekAccess,
  isChapterCropWeekActive,
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
