import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import {
  UPGRADE_INTERIOR_ERRORS,
  upgradeInterior,
} from "./upgradeInterior";
import { HOME_EXPANSION_UPGRADE_REQUIREMENTS } from "features/interior/lib/upgradeRequirements";

// HOME_EXPANSIONS is a betaFeatureFlag — testnet OR Beta Pass. Tests assume
// testnet (`CONFIG.NETWORK === "amoy"`) is true, so the flag passes for these
// volcano-island fixtures without needing a Beta Pass in inventory.
const richVolcanoState = (): GameState => ({
  ...TEST_FARM,
  island: { ...TEST_FARM.island, type: "volcano" },
  coins: 1_000_000,
  inventory: {
    ...TEST_FARM.inventory,
    Obsidian: new Decimal(10_000),
    "Beta Pass": new Decimal(1),
  },
});

describe("upgradeInterior (interior.upgrade)", () => {
  it("creates the level_one floor and sets expansion on the first upgrade", () => {
    const next = upgradeInterior({
      state: richVolcanoState(),
      action: { type: "interior.upgrade" },
    });
    expect(next.interior.level_one).toBeDefined();
    expect(next.interior.expansion).toBe("level-one-start");
    expect(next.interior.level_one?.collectibles).toEqual({});
  });

  it("deducts the coin and Obsidian cost on the first upgrade", () => {
    const before = richVolcanoState();
    const next = upgradeInterior({
      state: before,
      action: { type: "interior.upgrade" },
    });
    const cost = HOME_EXPANSION_UPGRADE_REQUIREMENTS["level-one-start"];
    expect(next.coins).toBe(before.coins - cost.coins);
    expect(next.inventory.Obsidian?.toNumber()).toBe(
      before.inventory.Obsidian!.minus(cost.inventory.Obsidian!).toNumber(),
    );
  });

  it("advances expansion tier on a subsequent upgrade", () => {
    const start = upgradeInterior({
      state: richVolcanoState(),
      action: { type: "interior.upgrade" },
    });
    expect(start.interior.expansion).toBe("level-one-start");

    const second = upgradeInterior({
      state: start,
      action: { type: "interior.upgrade" },
    });
    expect(second.interior.expansion).toBe("level-one-2");
  });

  it("preserves placed collectibles when advancing tier", () => {
    const seeded: GameState = {
      ...richVolcanoState(),
      interior: {
        ...richVolcanoState().interior,
        expansion: "level-one-2",
        level_one: {
          collectibles: {
            "Abandoned Bear": [{ id: "x", coordinates: { x: 12, y: 12 } }],
          },
        },
      },
    };
    const next = upgradeInterior({
      state: seeded,
      action: { type: "interior.upgrade" },
    });
    expect(next.interior.expansion).toBe("level-one-3");
    expect(next.interior.level_one?.collectibles["Abandoned Bear"]).toHaveLength(
      1,
    );
  });

  it("rejects upgrade when not on volcano island", () => {
    expect(() =>
      upgradeInterior({
        state: { ...richVolcanoState(), island: { type: "spring" } },
        action: { type: "interior.upgrade" },
      }),
    ).toThrow(UPGRADE_INTERIOR_ERRORS.NOT_ON_VOLCANO);
  });

  it("rejects upgrade once expansion is level-one-full", () => {
    const maxed: GameState = {
      ...richVolcanoState(),
      interior: {
        ...richVolcanoState().interior,
        expansion: "level-one-full",
        level_one: { collectibles: {} },
      },
    };
    expect(() =>
      upgradeInterior({
        state: maxed,
        action: { type: "interior.upgrade" },
      }),
    ).toThrow(UPGRADE_INTERIOR_ERRORS.ALREADY_MAXED);
  });

  it("rejects upgrade when player lacks coins", () => {
    expect(() =>
      upgradeInterior({
        state: { ...richVolcanoState(), coins: 0 },
        action: { type: "interior.upgrade" },
      }),
    ).toThrow(UPGRADE_INTERIOR_ERRORS.INSUFFICIENT_COINS);
  });

  it("rejects upgrade when player lacks Obsidian", () => {
    expect(() =>
      upgradeInterior({
        state: {
          ...richVolcanoState(),
          inventory: { ...richVolcanoState().inventory, Obsidian: new Decimal(0) },
        },
        action: { type: "interior.upgrade" },
      }),
    ).toThrow(UPGRADE_INTERIOR_ERRORS.INSUFFICIENT_INVENTORY);
  });

  it("does not deduct cost when the upgrade is rejected", () => {
    const before = { ...richVolcanoState(), coins: 0 };
    expect(() =>
      upgradeInterior({ state: before, action: { type: "interior.upgrade" } }),
    ).toThrow();
    // Original state unchanged
    expect(before.coins).toBe(0);
    expect(before.interior.expansion).toBeUndefined();
    expect(before.interior.level_one).toBeUndefined();
  });
});
