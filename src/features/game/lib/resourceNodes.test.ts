import { GameState, Rock, Tree } from "../types/game";
import { RockName, UpgradedResourceName } from "../types/resources";
import { INITIAL_FARM } from "./constants";
import {
  canGatherResource,
  canMine,
  canUpgrade,
  getUpgradeableNodes,
} from "./resourceNodes";

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

      const result = canGatherResource({
        name: "Stone Rock",
        ...stoneRock,
      });

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

      const result = canGatherResource({
        name: "Stone Rock",
        ...stoneRock,
      });

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

      const result = canGatherResource({
        name: "Tree",
        ...tree,
      });

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

      const result = canGatherResource({
        name: "Tree",
        ...tree,
      });

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

      const result = canGatherResource({
        name: "Iron Rock",
        ...ironRock,
      });

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

      const result = canGatherResource({
        name: "Gold Rock",
        ...goldRock,
      });

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

      const result = canGatherResource({
        name: "Stone Rock",
        ...stoneRock,
      });

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
        canGatherResource({
          name: "Invalid Rock" as RockName,
          ...invalidRock,
        }),
      ).toThrow("Invalid resource name: Invalid Rock");
    });

    it("should throw error for invalid resource type", () => {
      const invalidResource = {
        name: "Invalid Resource",
        invalidProperty: "test",
      };

      expect(() => canGatherResource(invalidResource as any)).toThrow(
        "Invalid resource",
      );
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

      const result = canMine(stoneRock, "Stone Rock");

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

      const result = canMine(stoneRock, "Stone Rock");

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

      const result = canMine(ironRock, "Iron Rock");

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

      const result = canMine(goldRock, "Gold Rock");

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

      const result = canMine(sunstoneRock, "Sunstone Rock");

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

      const result = canMine(crimstoneRock, "Crimstone Rock");

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

      const result = canMine(fusedStoneRock, "Fused Stone Rock");

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

      const result = canMine(reinforcedStoneRock, "Reinforced Stone Rock");

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

      const result = canMine(refinedIronRock, "Refined Iron Rock");

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

      const result = canMine(temperedIronRock, "Tempered Iron Rock");

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

      const result = canMine(pureGoldRock, "Pure Gold Rock");

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

      const result = canMine(primeGoldRock, "Prime Gold Rock");

      expect(result).toBe(true);
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
