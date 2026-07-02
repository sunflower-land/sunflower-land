import type { GameState, Rock, Tree } from "../types/game";
import type { RockName, UpgradedResourceName } from "../types/resources";
import { INITIAL_FARM, STONE_RECOVERY_TIME } from "./constants";
import {
  canGatherResource,
  canMine,
  canUpgrade,
  getMineReadyAt,
  getUpgradeableNodes,
} from "./resourceNodes";
import { EXPIRY_COOLDOWNS, getExpiryCooldown } from "./collectibleBuilt";
import { computeReadyAt, getMineBoostWindows } from "./boostWindows";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  stones: {
    0: {
      createdAt: Date.now(),
      stone: {
        minedAt: 0,
      },
      x: 1,
      y: 1,
    },
    1: {
      createdAt: Date.now(),
      stone: {
        minedAt: Date.now() - 5 * 60 * 1000, // 5 minutes ago
      },
      x: 4,
      y: 1,
    },
  },
  trees: {
    0: {
      createdAt: Date.now(),
      wood: {
        choppedAt: 0,
      },
      x: 1,
      y: 1,
    },
    1: {
      createdAt: Date.now(),
      wood: {
        choppedAt: Date.now() - 2 * 60 * 1000, // 2 minutes ago
      },
      x: 4,
      y: 1,
    },
  },
  iron: {
    0: {
      createdAt: Date.now(),
      stone: {
        minedAt: 0,
      },
      x: 2,
      y: 2,
    },
  },
  gold: {
    0: {
      createdAt: Date.now(),
      stone: {
        minedAt: 0,
      },
      x: 3,
      y: 3,
    },
  },
};

describe("resourceNodes", () => {
  describe("canGatherResource", () => {
    it("should return true for a stone rock that can be mined", () => {
      const stoneRock: Rock = {
        createdAt: Date.now(),
        stone: {
          minedAt: 0,
        },
        x: 1,
        y: 1,
      };

      const result = canGatherResource(
        {
          name: "Stone Rock",
          ...stoneRock,
        },
        GAME_STATE,
      );

      expect(result).toBe(true);
    });

    it("should return false for a stone rock that was recently mined", () => {
      const stoneRock: Rock = {
        createdAt: Date.now(),
        stone: {
          minedAt: Date.now() - 1000, // 1 second ago
        },
        x: 1,
        y: 1,
      };

      const result = canGatherResource(
        {
          name: "Stone Rock",
          ...stoneRock,
        },
        GAME_STATE,
      );

      expect(result).toBe(false);
    });

    it("should return true for a tree that can be chopped", () => {
      const tree: Tree = {
        createdAt: Date.now(),
        wood: {
          choppedAt: 0,
        },
        x: 1,
        y: 1,
      };

      const result = canGatherResource(
        {
          name: "Tree",
          ...tree,
        },
        GAME_STATE,
      );

      expect(result).toBe(true);
    });

    it("should return false for a tree that was recently chopped", () => {
      const tree: Tree = {
        createdAt: Date.now(),
        wood: {
          choppedAt: Date.now() - 1000, // 1 second ago
        },
        x: 1,
        y: 1,
      };

      const result = canGatherResource(
        {
          name: "Tree",
          ...tree,
        },
        GAME_STATE,
      );

      expect(result).toBe(false);
    });

    it("should handle iron rock with name inference", () => {
      const ironRock: Rock = {
        createdAt: Date.now(),
        stone: {
          minedAt: 0,
        },
        x: 1,
        y: 1,
      };

      const result = canGatherResource(
        {
          name: "Iron Rock",
          ...ironRock,
        },
        GAME_STATE,
      );

      expect(result).toBe(true);
    });

    it("should handle gold rock with name inference", () => {
      const goldRock: Rock = {
        createdAt: Date.now(),
        stone: {
          minedAt: 0,
        },
        x: 1,
        y: 1,
      };

      const result = canGatherResource(
        {
          name: "Gold Rock",
          ...goldRock,
        },
        GAME_STATE,
      );

      expect(result).toBe(true);
    });

    it("should handle stone rock with name inference", () => {
      const stoneRock: Rock = {
        createdAt: Date.now(),
        stone: {
          minedAt: 0,
        },
        x: 1,
        y: 1,
      };

      const result = canGatherResource(
        {
          name: "Stone Rock",
          ...stoneRock,
        },
        GAME_STATE,
      );

      expect(result).toBe(true);
    });

    it("should throw error for invalid rock name", () => {
      const invalidRock: Rock = {
        createdAt: Date.now(),
        stone: {
          minedAt: 0,
        },
        x: 1,
        y: 1,
      };

      expect(() =>
        canGatherResource(
          {
            name: "Invalid Rock" as RockName,
            ...invalidRock,
          },
          GAME_STATE,
        ),
      ).toThrow("Invalid resource name: Invalid Rock");
    });

    it("should throw error for invalid resource type", () => {
      const invalidResource = {
        name: "Invalid Resource",
        invalidProperty: "test",
      };

      expect(() =>
        canGatherResource(invalidResource as any, GAME_STATE),
      ).toThrow("Invalid resource");
    });
  });

  describe("canMine", () => {
    it("should return true for stone rock that can be mined", () => {
      const stoneRock: Rock = {
        createdAt: Date.now(),
        stone: {
          minedAt: 0,
        },
        x: 1,
        y: 1,
      };

      const result = canMine(stoneRock, "Stone Rock", GAME_STATE);

      expect(result).toBe(true);
    });

    it("should return false for stone rock that was recently mined", () => {
      const stoneRock: Rock = {
        createdAt: Date.now(),
        stone: {
          minedAt: Date.now() - 1000, // 1 second ago
        },
        x: 1,
        y: 1,
      };

      const result = canMine(stoneRock, "Stone Rock", GAME_STATE);

      expect(result).toBe(false);
    });

    it("should return true for iron rock that can be mined", () => {
      const ironRock: Rock = {
        createdAt: Date.now(),
        stone: {
          minedAt: 0,
        },
        x: 1,
        y: 1,
      };

      const result = canMine(ironRock, "Iron Rock", GAME_STATE);

      expect(result).toBe(true);
    });

    it("should return true for gold rock that can be mined", () => {
      const goldRock: Rock = {
        createdAt: Date.now(),
        stone: {
          minedAt: 0,
        },
        x: 1,
        y: 1,
      };

      const result = canMine(goldRock, "Gold Rock", GAME_STATE);

      expect(result).toBe(true);
    });

    it("should return true for sunstone rock that can be mined", () => {
      const sunstoneRock: Rock = {
        createdAt: Date.now(),
        stone: {
          minedAt: 0,
        },
        x: 1,
        y: 1,
      };

      const result = canMine(sunstoneRock, "Sunstone Rock", GAME_STATE);

      expect(result).toBe(true);
    });

    it("should return true for crimstone rock that can be mined", () => {
      const crimstoneRock: Rock = {
        createdAt: Date.now(),
        stone: {
          minedAt: 0,
        },
        x: 1,
        y: 1,
      };

      const result = canMine(crimstoneRock, "Crimstone Rock", GAME_STATE);

      expect(result).toBe(true);
    });

    it("should return true for fused stone rock that can be mined", () => {
      const fusedStoneRock: Rock = {
        createdAt: Date.now(),
        stone: {
          minedAt: 0,
        },
        x: 1,
        y: 1,
      };

      const result = canMine(fusedStoneRock, "Fused Stone Rock", GAME_STATE);

      expect(result).toBe(true);
    });

    it("should return true for reinforced stone rock that can be mined", () => {
      const reinforcedStoneRock: Rock = {
        createdAt: Date.now(),
        stone: {
          minedAt: 0,
        },
        x: 1,
        y: 1,
      };

      const result = canMine(
        reinforcedStoneRock,
        "Reinforced Stone Rock",
        GAME_STATE,
      );

      expect(result).toBe(true);
    });

    it("should return true for refined iron rock that can be mined", () => {
      const refinedIronRock: Rock = {
        createdAt: Date.now(),
        stone: {
          minedAt: 0,
        },
        x: 1,
        y: 1,
      };

      const result = canMine(refinedIronRock, "Refined Iron Rock", GAME_STATE);

      expect(result).toBe(true);
    });

    it("should return true for tempered iron rock that can be mined", () => {
      const temperedIronRock: Rock = {
        createdAt: Date.now(),
        stone: {
          minedAt: 0,
        },
        x: 1,
        y: 1,
      };

      const result = canMine(
        temperedIronRock,
        "Tempered Iron Rock",
        GAME_STATE,
      );

      expect(result).toBe(true);
    });

    it("should return true for pure gold rock that can be mined", () => {
      const pureGoldRock: Rock = {
        createdAt: Date.now(),
        stone: {
          minedAt: 0,
        },
        x: 1,
        y: 1,
      };

      const result = canMine(pureGoldRock, "Pure Gold Rock", GAME_STATE);

      expect(result).toBe(true);
    });

    it("should return true for prime gold rock that can be mined", () => {
      const primeGoldRock: Rock = {
        createdAt: Date.now(),
        stone: {
          minedAt: 0,
        },
        x: 1,
        y: 1,
      };

      const result = canMine(primeGoldRock, "Prime Gold Rock", GAME_STATE);

      expect(result).toBe(true);
    });
  });

  describe("getMineReadyAt", () => {
    const HOUR = 60 * 60 * 1000;

    it("uses minedAt + base recovery for a legacy rock (no baseDurationMs)", () => {
      const minedAt = 1_000_000;
      const rock: Rock = {
        createdAt: Date.now(),
        stone: { minedAt },
        x: 1,
        y: 1,
      };

      expect(getMineReadyAt(rock, "Stone Rock", INITIAL_FARM)).toEqual(
        minedAt + STONE_RECOVERY_TIME * 1000,
      );
    });

    it("uses minedAt + baseDurationMs for a windowed rock with no active boosts", () => {
      const minedAt = 1_000_000;
      const baseDurationMs = 4 * HOUR;
      const rock: Rock = {
        createdAt: Date.now(),
        stone: { minedAt, baseDurationMs },
        x: 1,
        y: 1,
      };

      // Empty windows → computeReadyAt reduces to minedAt + baseDurationMs.
      expect(getMineReadyAt(rock, "Stone Rock", INITIAL_FARM)).toEqual(
        minedAt + baseDurationMs,
      );
    });

    it("returns an earlier ready time when a mine boost speeds the rock up", () => {
      const minedAt = 1_000_000;
      const baseDurationMs = 4 * HOUR;
      const rock: Rock = {
        createdAt: Date.now(),
        stone: { minedAt, baseDurationMs },
        x: 1,
        y: 1,
      };

      // A Time Warp Totem placed exactly at minedAt covers the whole task at 2×.
      const boostedGame: GameState = {
        ...INITIAL_FARM,
        collectibles: {
          ...INITIAL_FARM.collectibles,
          "Time Warp Totem": [
            { id: "1", coordinates: { x: 0, y: 0 }, createdAt: minedAt },
          ],
        },
      };

      const boostedReadyAt = getMineReadyAt(rock, "Stone Rock", boostedGame);

      // 4h of work at 2× finishes in 2h — strictly earlier than the unboosted 4h.
      expect(boostedReadyAt).toBeLessThan(minedAt + baseDurationMs);
      expect(boostedReadyAt).toEqual(minedAt + baseDurationMs / 2);
    });

    it("matches computeReadyAt over the resolved mine windows", () => {
      const minedAt = 1_000_000;
      const baseDurationMs = 8 * HOUR;
      const rock: Rock = {
        createdAt: Date.now(),
        stone: { minedAt, baseDurationMs },
        x: 1,
        y: 1,
      };

      const game: GameState = {
        ...INITIAL_FARM,
        collectibles: {
          ...INITIAL_FARM.collectibles,
          "Ore Hourglass": [
            { id: "1", coordinates: { x: 0, y: 0 }, createdAt: minedAt },
          ],
        },
      };

      expect(getMineReadyAt(rock, "Iron Rock", game)).toEqual(
        computeReadyAt({
          startedAt: minedAt,
          baseDurationMs,
          windows: getMineBoostWindows(game, "Iron Rock"),
        }),
      );
    });

    it("credits an EXPIRED boost window for a rock mined during it (does not slow back down)", () => {
      // Highest-risk edge case for the speed-rate model: windows are built from the
      // booster's persisted createdAt + cooldown, NOT from whether it's active "now".
      // An Ore Hourglass placed when the iron rock was mined accelerates only the
      // first 3h of recovery; once it expires the already-earned credit must persist
      // — readyAt stays at the boosted time and never reverts to the unboosted 8h.
      const minedAt = 1_000_000;
      const oreWindow = getExpiryCooldown("Ore Hourglass", INITIAL_FARM);
      // Base outlasts the window (3×) so the 2× boost expires mid-recovery and the
      // tail accrues at 1× — the expired-window edge this test guards.
      const baseDurationMs = oreWindow * 3;
      const rock: Rock = {
        createdAt: Date.now(),
        stone: { minedAt, baseDurationMs },
        x: 1,
        y: 1,
      };

      const game: GameState = {
        ...INITIAL_FARM,
        collectibles: {
          ...INITIAL_FARM.collectibles,
          "Ore Hourglass": [
            { id: "1", coordinates: { x: 0, y: 0 }, createdAt: minedAt },
          ],
        },
      };

      // The window at 2× banks 2×oreWindow of work; the remaining oreWindow accrues
      // at 1× after it expires → ready 2×oreWindow after mining, not the unboosted base.
      const readyAt = getMineReadyAt(rock, "Iron Rock", game);
      expect(readyAt).toEqual(
        minedAt + oreWindow + (baseDurationMs - oreWindow * 2),
      );
      expect(readyAt).toEqual(minedAt + 2 * oreWindow);
      expect(readyAt).toBeLessThan(minedAt + baseDurationMs);

      // Post-expiry sanity via canMine: still recovering during the window, ready
      // just past 2×oreWindow — the expired window's credit is stable over time.
      expect(canMine(rock, "Iron Rock", game, minedAt + oreWindow)).toBe(false);
      expect(
        canMine(rock, "Iron Rock", game, minedAt + 2 * oreWindow + 1),
      ).toBe(true);
    });

    it("honors baseDurationMs even with SPEED_BOOSTS off (keys off the field, not the flag)", () => {
      // FE jest runs with SPEED_BOOSTS (testnetFeatureFlag) OFF by default, yet the
      // read path keys off the permanent baseDurationMs marker, so a windowed rock
      // keeps windowed timing regardless of the flag.
      const minedAt = 1_000_000;
      const baseDurationMs = 4 * HOUR;
      const rock: Rock = {
        createdAt: Date.now(),
        stone: { minedAt, baseDurationMs },
        x: 1,
        y: 1,
      };

      const boostedGame: GameState = {
        ...INITIAL_FARM,
        collectibles: {
          ...INITIAL_FARM.collectibles,
          "Super Totem": [
            { id: "1", coordinates: { x: 0, y: 0 }, createdAt: minedAt },
          ],
        },
      };

      // Still windowed (2×) → 2h, not the legacy STONE_RECOVERY_TIME path.
      expect(getMineReadyAt(rock, "Stone Rock", boostedGame)).toEqual(
        minedAt + baseDurationMs / 2,
      );
    });

    it("canMine delegates to getMineReadyAt (now > readyAt)", () => {
      const minedAt = 1_000_000;
      const baseDurationMs = 4 * HOUR;
      const rock: Rock = {
        createdAt: Date.now(),
        stone: { minedAt, baseDurationMs },
        x: 1,
        y: 1,
      };

      const readyAt = getMineReadyAt(rock, "Stone Rock", INITIAL_FARM);

      expect(canMine(rock, "Stone Rock", INITIAL_FARM, readyAt + 1)).toBe(true);
      expect(canMine(rock, "Stone Rock", INITIAL_FARM, readyAt)).toBe(false);
      expect(canMine(rock, "Stone Rock", INITIAL_FARM, readyAt - 1)).toBe(
        false,
      );
    });

    it("a truncated boost window (removedAt) still survives via the cooldown clamp", () => {
      // Sanity: an active totem whose window outlasts the task speeds it up; this
      // guards that getMineBoostWindows is actually consulted (uses EXPIRY_COOLDOWNS).
      const minedAt = 1_000_000;
      const baseDurationMs = 1 * HOUR;
      const rock: Rock = {
        createdAt: Date.now(),
        stone: { minedAt, baseDurationMs },
        x: 1,
        y: 1,
      };

      const game: GameState = {
        ...INITIAL_FARM,
        collectibles: {
          ...INITIAL_FARM.collectibles,
          "Super Totem": [
            { id: "1", coordinates: { x: 0, y: 0 }, createdAt: minedAt },
          ],
        },
      };

      // Super Totem cooldown is 7 days ≫ the 1h task, so the whole task runs at 2×.
      expect(EXPIRY_COOLDOWNS["Super Totem"]).toBeGreaterThan(baseDurationMs);
      expect(getMineReadyAt(rock, "Stone Rock", game)).toEqual(
        minedAt + baseDurationMs / 2,
      );
    });
  });

  describe("canUpgrade", () => {
    it("should return false when no upgradeable nodes are available", () => {
      const gameState: GameState = {
        ...GAME_STATE,
        stones: {},
      };

      const result = canUpgrade(
        gameState,
        "Fused Stone Rock" as UpgradedResourceName,
      );

      expect(result).toBe(false);
    });

    it("should return true when enough upgradeable nodes are available", () => {
      const gameState: GameState = {
        ...GAME_STATE,
        stones: {
          "0": {
            createdAt: Date.now(),
            stone: {
              minedAt: 0,
            },
            x: 1,
            y: 1,
          },
          "1": {
            createdAt: Date.now(),
            stone: {
              minedAt: 0,
            },
            x: 2,
            y: 2,
          },
          "2": {
            createdAt: Date.now(),
            stone: {
              minedAt: 0,
            },
            x: 3,
            y: 3,
          },
          "3": {
            createdAt: Date.now(),
            stone: {
              minedAt: 0,
            },
            x: 2,
            y: 2,
          },
        },
      };

      const result = canUpgrade(
        gameState,
        "Fused Stone Rock" as UpgradedResourceName,
      );

      expect(result).toBe(true);
    });

    it("should return false when not enough upgradeable nodes are available", () => {
      const gameState: GameState = {
        ...GAME_STATE,
        stones: {
          0: {
            createdAt: Date.now(),
            stone: {
              minedAt: 0,
            },
            x: 1,
            y: 1,
          },
        },
      };

      const result = canUpgrade(
        gameState,
        "Fused Stone Rock" as UpgradedResourceName,
      );

      expect(result).toBe(false);
    });

    it("should return false when nodes are not placed", () => {
      const gameState: GameState = {
        ...GAME_STATE,
        stones: {
          0: {
            createdAt: Date.now(),
            stone: {
              minedAt: 0,
            },
            x: undefined,
            y: undefined,
          },
          1: {
            createdAt: Date.now(),
            stone: {
              minedAt: 0,
            },
            x: undefined,
            y: undefined,
          },
        },
      };

      const result = canUpgrade(
        gameState,
        "Fused Stone Rock" as UpgradedResourceName,
      );

      expect(result).toBe(false);
    });

    it("should return false when nodes cannot be gathered", () => {
      const gameState: GameState = {
        ...GAME_STATE,
        stones: {
          0: {
            createdAt: Date.now(),
            stone: {
              minedAt: Date.now() - 1000, // Recently mined
            },
            x: 1,
            y: 1,
          },
          1: {
            createdAt: Date.now(),
            stone: {
              minedAt: Date.now() - 1000, // Recently mined
            },
            x: 2,
            y: 2,
          },
        },
      };

      const result = canUpgrade(
        gameState,
        "Fused Stone Rock" as UpgradedResourceName,
      );

      expect(result).toBe(false);
    });
  });

  describe("getUpgradeableNodes", () => {
    it("should return empty array when no nodes are available", () => {
      const gameState: GameState = {
        ...GAME_STATE,
        stones: {},
      };

      const result = getUpgradeableNodes(
        gameState,
        "Fused Stone Rock" as UpgradedResourceName,
      );

      expect(result).toEqual([]);
    });

    it("should return upgradeable nodes that meet requirements", () => {
      const gameState: GameState = {
        ...GAME_STATE,
        stones: {
          0: {
            createdAt: Date.now(),
            stone: {
              minedAt: 0,
            },
            x: 1,
            y: 1,
          },
          1: {
            createdAt: Date.now(),
            stone: {
              minedAt: 0,
            },
            x: 2,
            y: 2,
          },
        },
      };

      const result = getUpgradeableNodes(
        gameState,
        "Fused Stone Rock" as UpgradedResourceName,
      );

      expect(result).toHaveLength(2);
      expect(result[0][0]).toBe("0");
      expect(result[1][0]).toBe("1");
    });

    it("should filter out nodes that are not placed", () => {
      const gameState: GameState = {
        ...GAME_STATE,
        stones: {
          0: {
            createdAt: Date.now(),
            stone: {
              minedAt: 0,
            },
            x: 1,
            y: 1,
          },
          1: {
            createdAt: Date.now(),
            stone: {
              minedAt: 0,
            },
            x: undefined,
            y: undefined,
          },
        },
      };

      const result = getUpgradeableNodes(
        gameState,
        "Fused Stone Rock" as UpgradedResourceName,
      );

      expect(result).toHaveLength(1);
      expect(result[0][0]).toBe("0");
    });

    it("should filter out nodes that cannot be gathered", () => {
      const gameState: GameState = {
        ...GAME_STATE,
        stones: {
          0: {
            createdAt: Date.now(),
            stone: {
              minedAt: 0,
            },
            x: 1,
            y: 1,
          },
          1: {
            createdAt: Date.now(),
            stone: {
              minedAt: Date.now() - 1000, // Recently mined
            },
            x: 2,
            y: 2,
          },
        },
      };

      const result = getUpgradeableNodes(
        gameState,
        "Fused Stone Rock" as UpgradedResourceName,
      );

      expect(result).toHaveLength(1);
      expect(result[0][0]).toBe("0");
    });

    it("should filter out nodes with wrong tier", () => {
      const gameState: GameState = {
        ...GAME_STATE,
        stones: {
          0: {
            createdAt: Date.now(),
            stone: {
              minedAt: 0,
            },
            x: 1,
            y: 1,
            tier: 2, // Wrong tier
          },
          1: {
            createdAt: Date.now(),
            stone: {
              minedAt: 0,
            },
            x: 2,
            y: 2,
            tier: 1, // Correct tier
          },
        },
      };

      const result = getUpgradeableNodes(
        gameState,
        "Fused Stone Rock" as UpgradedResourceName,
      );

      expect(result).toHaveLength(1);
      expect(result[0][0]).toBe("1");
    });

    it("should return sorted results", () => {
      const gameState: GameState = {
        ...GAME_STATE,
        stones: {
          "2": {
            createdAt: Date.now(),
            stone: {
              minedAt: 0,
            },
            x: 1,
            y: 1,
          },
          "1": {
            createdAt: Date.now(),
            stone: {
              minedAt: 0,
            },
            x: 2,
            y: 2,
          },
          "0": {
            createdAt: Date.now(),
            stone: {
              minedAt: 0,
            },
            x: 3,
            y: 3,
          },
        },
      };

      const result = getUpgradeableNodes(
        gameState,
        "Fused Stone Rock" as UpgradedResourceName,
      );

      expect(result).toHaveLength(3);
      expect(result[0][0]).toBe("0");
      expect(result[1][0]).toBe("1");
      expect(result[2][0]).toBe("2");
    });
  });
});
