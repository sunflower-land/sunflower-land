import {
  BASIC_REWARDS,
  CHEST_MULTIPLIER,
  LUXURY_REWARDS,
  RARE_REWARDS,
} from "./chests";
import { CHAPTERS } from "./chapters";
import {
  getChapterTrackCollectibles,
  getChapterTrackWearables,
} from "./collections";

describe("chapter megastore chest rewards", () => {
  const DURING_ASCENSION_AGE = new Date("2026-10-15T00:00:00.000Z").getTime();
  const CAVE_DWELLERS_START = CHAPTERS["Cave Dwellers"].startDate.getTime();
  const MID_CAVE_DWELLERS = new Date("2026-12-01T00:00:00.000Z").getTime();
  const CAVE_DWELLERS_MEGASTORE_REWARDS = [
    { wearables: { "Duende Hat": 1 }, weighting: 1.9 * CHEST_MULTIPLIER },
    { items: { "Straw House": 1 }, weighting: 1.9 * CHEST_MULTIPLIER },
    { items: { "Mining Drill": 1 }, weighting: 1.9 * CHEST_MULTIPLIER },
  ];

  it("adds Ascension Age megastore items to Luxury chests during Ascension Age", () => {
    const rewards = LUXURY_REWARDS(DURING_ASCENSION_AGE);

    expect(rewards).toContainEqual({
      wearables: { "Moon Hair": 1 },
      weighting: 1.9 * CHEST_MULTIPLIER,
    });
    expect(rewards).toContainEqual({
      items: { Astrolabe: 1 },
      weighting: 1.9 * CHEST_MULTIPLIER,
    });
    expect(rewards).toContainEqual({
      items: { "Otty the Otter": 1 },
      weighting: 1.9 * CHEST_MULTIPLIER,
    });
  });

  it("does not add Cave Dwellers megastore items to Luxury chests when the chapter starts", () => {
    const rewards = LUXURY_REWARDS(CAVE_DWELLERS_START);

    for (const reward of CAVE_DWELLERS_MEGASTORE_REWARDS) {
      expect(rewards).not.toContainEqual(reward);
    }
  });

  it("does not add Cave Dwellers megastore items to Luxury chests mid-chapter", () => {
    const rewards = LUXURY_REWARDS(MID_CAVE_DWELLERS);

    for (const reward of CAVE_DWELLERS_MEGASTORE_REWARDS) {
      expect(rewards).not.toContainEqual(reward);
    }
  });
});

describe("chapter track chest rewards", () => {
  const MID_CAVE_DWELLERS = new Date("2026-12-01T00:00:00.000Z").getTime();
  const CAVE_DWELLERS_TRACK_ITEMS: string[] = [
    ...getChapterTrackCollectibles("Cave Dwellers"),
    ...getChapterTrackWearables("Cave Dwellers"),
  ];

  it("does not add Cave Dwellers track items to Basic or Rare chests", () => {
    for (const rewards of [BASIC_REWARDS, RARE_REWARDS]) {
      const names = rewards(MID_CAVE_DWELLERS).flatMap((reward) => [
        ...Object.keys(reward.items ?? {}),
        ...Object.keys(reward.wearables ?? {}),
      ]);

      for (const name of CAVE_DWELLERS_TRACK_ITEMS) {
        expect(names).not.toContain(name);
      }
    }
  });
});
