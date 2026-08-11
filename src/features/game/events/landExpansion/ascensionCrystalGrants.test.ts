import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import type { GameState, IslandType } from "features/game/types/game";
import { getRewards } from "./revealLand";
import { ASCENSION_BUMPKIN_LEVEL, upgrade } from "./upgradeFarm";
import {
  LEVEL_EXPERIENCE,
  ascensionBaseline,
  bandXp,
} from "features/game/lib/level";
import { getExpectedAscensionCrystals } from "features/game/expansion/lib/ascension";

/** Total Ascension Crystals offered by the missing-resources back-pay chest. */
const backPaidCrystals = (game: GameState): number => {
  const rewards = getRewards({ game, createdAt: Date.now() });
  const chest = rewards.find((a) => a.id.startsWith("missing-resources"));
  return (chest?.items["Ascension Crystal"] as number | undefined) ?? 0;
};

describe("Ascension Crystal back-pay (revealLand missing-node reconciliation)", () => {
  // A swamp A1 player at Basic Land 33 (e=3) should have earned
  // A0(3) + A1 upgrade(1) + 3 expansion nodes = 7 crystals.
  const legacyA1 = (overrides: Partial<GameState> = {}): GameState => ({
    ...INITIAL_FARM,
    inventory: { ...INITIAL_FARM.inventory, "Basic Land": new Decimal(33) },
    island: { type: "swamp", ascensionLevel: 1 },
    ...overrides,
  });

  it("back-pays a legacy player the full expected crystals (0 owned, 0 mined)", () => {
    expect(backPaidCrystals(legacyA1())).toBe(7);
  });

  it("does not resurrect crystals the player already mined", () => {
    const game = legacyA1({
      farmActivity: { "Ascension Crystal Mined": 7 },
    });
    expect(backPaidCrystals(game)).toBe(0);
  });

  it("respects the inventory + mined invariant (partial)", () => {
    const game = legacyA1({
      inventory: {
        ...INITIAL_FARM.inventory,
        "Basic Land": new Decimal(33),
        "Ascension Crystal": new Decimal(4),
      },
      farmActivity: { "Ascension Crystal Mined": 3 },
    });
    expect(backPaidCrystals(game)).toBe(0);
  });

  it("only back-pays the shortfall (owns some, mined some)", () => {
    const game = legacyA1({
      inventory: {
        ...INITIAL_FARM.inventory,
        "Basic Land": new Decimal(33),
        "Ascension Crystal": new Decimal(1),
      },
      farmActivity: { "Ascension Crystal Mined": 2 },
    });
    expect(backPaidCrystals(game)).toBe(4);
  });
});

describe("Ascension Crystal upgrade-node grant (upgradeFarm)", () => {
  const RESOURCES_FOR_ANY_COST = {
    Gold: new Decimal(1_000_000),
    Crimstone: new Decimal(1_000_000),
    Oil: new Decimal(1_000_000),
    Obsidian: new Decimal(1_000_000),
  };

  type Transition = {
    from: IslandType;
    ascensionLevel?: number;
    basicLand: number;
    experience: number;
  };

  const cases: [string, Transition][] = [
    ["basic -> spring", { from: "basic", basicLand: 9, experience: 0 }],
    ["spring -> desert", { from: "spring", basicLand: 16, experience: 0 }],
    ["desert -> volcano", { from: "desert", basicLand: 25, experience: 0 }],
    [
      "volcano -> swamp",
      {
        from: "volcano",
        basicLand: 30,
        experience: LEVEL_EXPERIENCE[ASCENSION_BUMPKIN_LEVEL],
      },
    ],
    [
      "swamp -> spooky",
      {
        from: "swamp",
        ascensionLevel: 1,
        basicLand: 42,
        experience: ascensionBaseline(1) + bandXp(1),
      },
    ],
    [
      "spooky -> crystal",
      {
        from: "spooky",
        ascensionLevel: 2,
        basicLand: 42,
        experience: ascensionBaseline(2) + bandXp(2),
      },
    ],
    [
      "crystal -> galaxy",
      {
        from: "crystal",
        ascensionLevel: 3,
        basicLand: 42,
        experience: ascensionBaseline(3) + bandXp(3),
      },
    ],
    [
      "galaxy -> marble",
      {
        from: "galaxy",
        ascensionLevel: 4,
        basicLand: 42,
        experience: ascensionBaseline(4) + bandXp(4),
      },
    ],
    [
      "marble -> marble",
      {
        from: "marble",
        ascensionLevel: 5,
        basicLand: 42,
        experience: ascensionBaseline(5) + bandXp(5),
      },
    ],
  ];

  // Each transition grants exactly 1 Ascension Crystal. Every upgrade — basic and
  // ascension alike — delivers it via the side-island reward chest (a
  // `missing-resources` airdrop); nothing tops crystals up into inventory
  // directly. Seeding the player with the crystals they should already own means
  // the chest's net grant is exactly 1.
  it.each(cases)(
    "grants exactly 1 crystal on %s",
    (_label, { from, ascensionLevel, basicLand, experience }) => {
      const ownedBefore = getExpectedAscensionCrystals({
        islandType: from,
        ascensionLevel: ascensionLevel ?? 0,
        basicLand,
      });

      const state = upgrade({
        farmId: 1,
        action: { type: "farm.upgraded" },
        state: {
          ...INITIAL_FARM,
          coins: 1_000_000_000,
          bumpkin: { ...INITIAL_FARM.bumpkin!, experience },
          island: {
            type: from,
            ...(ascensionLevel ? { ascensionLevel } : {}),
          },
          inventory: {
            ...INITIAL_FARM.inventory,
            ...RESOURCES_FOR_ANY_COST,
            "Basic Land": new Decimal(basicLand),
            "Ascension Crystal": new Decimal(ownedBefore),
          },
        },
        createdAt: Date.now(),
      });

      const inventoryAfter = (
        state.inventory["Ascension Crystal"] ?? new Decimal(0)
      ).toNumber();
      const chestCrystals = (state.airdrops ?? [])
        .filter((airdrop) => airdrop.id.startsWith("missing-resources"))
        .reduce(
          (sum, airdrop) => sum + (airdrop.items["Ascension Crystal"] ?? 0),
          0,
        );

      expect(inventoryAfter + chestCrystals - ownedBefore).toBe(1);
    },
  );
});
