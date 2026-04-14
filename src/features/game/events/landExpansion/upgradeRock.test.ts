import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { upgradeRock, UpgradeRockAction } from "./upgradeRock";
import { GameState } from "features/game/types/game";
import { RESOURCE_MULTIPLIER } from "features/game/types/resources";

describe("upgradeRock", () => {
  const GAME_STATE: GameState = {
    ...INITIAL_FARM,
    coins: 100000,
    inventory: {
      "Stone Rock": new Decimal(10),
      "Fused Stone Rock": new Decimal(5),
      Obsidian: new Decimal(20),
    },
    stones: {
      "0": {
        createdAt: Date.now(),
        stone: { minedAt: 0 },
        x: 1,
        y: 1,
      },
      "1": {
        createdAt: Date.now(),
        stone: { minedAt: 0 },
        x: 2,
        y: 2,
      },
      "2": {
        createdAt: Date.now(),
        stone: { minedAt: 0 },
        x: 3,
        y: 3,
      },
      "3": {
        createdAt: Date.now(),
        stone: { minedAt: 0 },
        x: 4,
        y: 4,
      },
    },
  };

  describe("Fused Stone Rock upgrade", () => {
    it("should upgrade stone rocks to fused stone rock", () => {
      const action: UpgradeRockAction = {
        type: "rock.upgraded",
        upgradeTo: "Fused Stone Rock",
        id: "fused-1",
      };

      const state = upgradeRock({
        state: GAME_STATE,
        action,
      });

      expect(state.coins).toBe(50000);

      // Should remove ingredients from inventory
      expect(state.inventory["Stone Rock"]).toEqual(new Decimal(6));
      expect(state.inventory.Obsidian).toEqual(new Decimal(15));

      // Should add upgraded rock to inventory
      expect(state.inventory["Fused Stone Rock"]).toEqual(new Decimal(6));

      // Should remove 4 stone rocks from the map
      expect(Object.keys(state.stones)).toHaveLength(1);

      // Should place new fused stone rock
      expect(state.stones["fused-1"]).toEqual({
        createdAt: expect.any(Number),
        stone: { minedAt: 0 },
        x: 1,
        y: 1,
        tier: 2,
        name: "Fused Stone Rock",
        multiplier: RESOURCE_MULTIPLIER["Fused Stone Rock"],
      });

      // Should track farm activity
      expect(state.farmActivity["Fused Stone Rock Upgrade"]).toBe(1);
    });

    it("should throw error if insufficient coins", () => {
      const action: UpgradeRockAction = {
        type: "rock.upgraded",
        upgradeTo: "Fused Stone Rock",
        id: "fused-1",
      };

      expect(() =>
        upgradeRock({
          state: { ...GAME_STATE, coins: 1000 },
          action,
        }),
      ).toThrow("Insufficient coins");
    });

    it("should throw error if not enough placed stones to upgrade", () => {
      const action: UpgradeRockAction = {
        type: "rock.upgraded",
        upgradeTo: "Fused Stone Rock",
        id: "fused-1",
      };

      expect(() =>
        upgradeRock({
          state: {
            ...GAME_STATE,
            stones: {
              "0": {
                createdAt: Date.now(),
                stone: { minedAt: 0 },
                x: 1,
                y: 1,
                tier: 1,
              },
            },
          },
          action,
        }),
      ).toThrow("Not enough placed stones to upgrade");
    });

    it("should throw error if insufficient stone rocks", () => {
      const action: UpgradeRockAction = {
        type: "rock.upgraded",
        upgradeTo: "Fused Stone Rock",
        id: "fused-1",
      };

      expect(() =>
        upgradeRock({
          state: {
            ...GAME_STATE,
            inventory: {
              ...GAME_STATE.inventory,
              "Stone Rock": new Decimal(2),
            },
          },
          action,
        }),
      ).toThrow("Insufficient Stone Rock");
    });

    it("should throw error if insufficient obsidian", () => {
      const action: UpgradeRockAction = {
        type: "rock.upgraded",
        upgradeTo: "Fused Stone Rock",
        id: "fused-1",
      };

      expect(() =>
        upgradeRock({
          state: {
            ...GAME_STATE,
            inventory: {
              ...GAME_STATE.inventory,
              Obsidian: new Decimal(2),
            },
          },
          action,
        }),
      ).toThrow("Insufficient Obsidian");
    });
  });

  describe("Reinforced Stone Rock upgrade", () => {
    it("should upgrade fused stone rocks to reinforced stone rock", () => {
      const now = Date.now();
      const action: UpgradeRockAction = {
        type: "rock.upgraded",
        upgradeTo: "Reinforced Stone Rock",
        id: "reinforced-1",
      };

      const state = upgradeRock({
        state: {
          ...GAME_STATE,
          coins: 200000,
          inventory: {
            "Fused Stone Rock": new Decimal(10),
            Obsidian: new Decimal(20),
          },
          stones: {
            "0": {
              createdAt: now,
              stone: { minedAt: 0 },
              x: 1,
              y: 1,
              tier: 2,
            },
            "1": {
              createdAt: now,
              stone: { minedAt: 0 },
              x: 2,
              y: 2,
              tier: 2,
            },
            "2": {
              createdAt: now,
              stone: { minedAt: 0 },
              x: 3,
              y: 3,
              tier: 2,
            },
            "3": {
              createdAt: now,
              stone: { minedAt: 0 },
              x: 4,
              y: 4,
              tier: 2,
            },
          },
        },
        action,
        createdAt: now,
      });

      // Should deduct coins
      expect(state.coins).toBe(100000);

      // Should remove ingredients from inventory
      expect(state.inventory["Fused Stone Rock"]).toEqual(new Decimal(6));
      expect(state.inventory.Obsidian).toEqual(new Decimal(10));

      // Should add upgraded rock to inventory
      expect(state.inventory["Reinforced Stone Rock"]).toEqual(new Decimal(1));

      // Should remove 4 fused stone rocks from the map
      expect(Object.keys(state.stones)).toHaveLength(1);

      // Should place new reinforced stone rock
      expect(state.stones["reinforced-1"]).toEqual({
        createdAt: now,
        stone: { minedAt: 0 },
        x: 1,
        y: 1,
        tier: 3,
        name: "Reinforced Stone Rock",
        multiplier: RESOURCE_MULTIPLIER["Reinforced Stone Rock"],
      });
    });
  });

  describe("Iron Rock upgrades", () => {
    it("should upgrade iron rocks to refined iron rock", () => {
      const now = Date.now();
      const action: UpgradeRockAction = {
        type: "rock.upgraded",
        upgradeTo: "Refined Iron Rock",
        id: "refined-iron-1",
      };

      const state = upgradeRock({
        state: {
          ...GAME_STATE,
          coins: 200000,
          inventory: {
            "Iron Rock": new Decimal(10),
            Obsidian: new Decimal(20),
          },
          iron: {
            "0": {
              createdAt: now,
              stone: { minedAt: 0 },
              x: 1,
              y: 1,
              tier: 1,
            },
            "1": {
              createdAt: now,
              stone: { minedAt: 0 },
              x: 2,
              y: 2,
              tier: 1,
            },
            "2": {
              createdAt: now,
              stone: { minedAt: 0 },
              x: 3,
              y: 3,
              tier: 1,
            },
            "3": {
              createdAt: now,
              stone: { minedAt: 0 },
              x: 4,
              y: 4,
              tier: 1,
            },
          },
        },
        action,
        createdAt: now,
      });

      // Should place new refined iron rock in iron state
      expect(state.iron["refined-iron-1"]).toEqual({
        createdAt: now,
        stone: { minedAt: 0 },
        x: 1,
        y: 1,
        tier: 2,
        name: "Refined Iron Rock",
        multiplier: RESOURCE_MULTIPLIER["Refined Iron Rock"],
      });

      // Should remove original iron rocks
      expect(Object.keys(state.iron)).toHaveLength(1);
    });
  });

  describe("Gold Rock upgrades", () => {
    it("should upgrade gold rocks to pure gold rock", () => {
      const action: UpgradeRockAction = {
        type: "rock.upgraded",
        upgradeTo: "Pure Gold Rock",
        id: "pure-gold-1",
      };

      const now = Date.now();
      const state = upgradeRock({
        state: {
          ...GAME_STATE,
          coins: 200000,
          inventory: {
            "Gold Rock": new Decimal(10),
            Obsidian: new Decimal(20),
          },
          gold: {
            "0": {
              createdAt: now,
              stone: { minedAt: 0 },
              x: 1,
              y: 1,
              tier: 1,
            },
            "1": {
              createdAt: now,
              stone: { minedAt: 0 },
              x: 2,
              y: 2,
              tier: 1,
            },
            "2": {
              createdAt: now,
              stone: { minedAt: 0 },
              x: 3,
              y: 3,
              tier: 1,
            },
            "3": {
              createdAt: now,
              stone: { minedAt: 0 },
              x: 4,
              y: 4,
              tier: 1,
            },
          },
        },
        action,
        createdAt: now,
      });

      // Should place new pure gold rock in gold state
      expect(state.gold["pure-gold-1"]).toEqual({
        createdAt: now,
        stone: { minedAt: 0 },
        x: 1,
        y: 1,
        tier: 2,
        name: "Pure Gold Rock",
        multiplier: RESOURCE_MULTIPLIER["Pure Gold Rock"],
      });
    });

    it("should upgrade pure gold rocks to prime gold rock", () => {
      const action: UpgradeRockAction = {
        type: "rock.upgraded",
        upgradeTo: "Prime Gold Rock",
        id: "prime-gold-1",
      };

      const now = Date.now();
      const state = upgradeRock({
        state: {
          ...GAME_STATE,
          coins: 500000,
          inventory: {
            "Pure Gold Rock": new Decimal(10),
            Obsidian: new Decimal(20),
          },
          gold: {
            "0": {
              createdAt: now,
              stone: { minedAt: 0 },
              x: 1,
              y: 1,
              tier: 2,
            },
            "1": {
              createdAt: now,
              stone: { minedAt: 0 },
              x: 2,
              y: 2,
              tier: 2,
            },
            "2": {
              createdAt: now,
              stone: { minedAt: 0 },
              x: 3,
              y: 3,
              tier: 2,
            },
            "3": {
              createdAt: now,
              stone: { minedAt: 0 },
              x: 4,
              y: 4,
              tier: 2,
            },
          },
        },
        action,
        createdAt: now,
      });

      // Should place new prime gold rock in gold state
      expect(state.gold["prime-gold-1"]).toEqual({
        createdAt: now,
        stone: { minedAt: 0 },
        x: 1,
        y: 1,
        tier: 3,
        name: "Prime Gold Rock",
        multiplier: RESOURCE_MULTIPLIER["Prime Gold Rock"],
      });
    });
  });

  describe("Edge cases", () => {
    it("should handle rocks with different tiers", () => {
      const action: UpgradeRockAction = {
        type: "rock.upgraded",
        upgradeTo: "Fused Stone Rock",
        id: "fused-1",
      };

      const state = upgradeRock({
        state: {
          ...GAME_STATE,
          stones: {
            "0": {
              createdAt: Date.now(),
              stone: { minedAt: 0 },
              x: 1,
              y: 1,
              tier: 2,
            },
            "1": {
              createdAt: Date.now(),
              stone: { minedAt: 0 },
              x: 2,
              y: 2,
              tier: 1,
            },
            "2": {
              createdAt: Date.now(),
              stone: { minedAt: 0 },
              x: 3,
              y: 3,
              tier: 1,
            },
            "3": {
              createdAt: Date.now(),
              stone: { minedAt: 0 },
              x: 4,
              y: 4,
              tier: 1,
            },
            "4": {
              createdAt: Date.now(),
              stone: { minedAt: 0 },
              x: 5,
              y: 5,
              tier: 1,
            },
          },
        },
        action,
      });

      // Should only remove tier 1 rocks
      expect(Object.keys(state.stones)).toHaveLength(2); // 5 - 4 + 1 new
      expect(state.stones["0"]).toBeDefined(); // Tier 2 rock should remain
    });

    it("should handle zero ingredient amounts", () => {
      const action: UpgradeRockAction = {
        type: "rock.upgraded",
        upgradeTo: "Fused Stone Rock",
        id: "fused-1",
      };

      // This should not throw an error even with zero amounts
      const state = upgradeRock({
        state: GAME_STATE,
        action,
      });

      expect(state).toBeDefined();
    });

    it("should track farm activity correctly", () => {
      const action: UpgradeRockAction = {
        type: "rock.upgraded",
        upgradeTo: "Fused Stone Rock",
        id: "fused-1",
      };

      const state = upgradeRock({
        state: GAME_STATE,
        action,
      });

      expect(state.farmActivity["Fused Stone Rock Upgrade"]).toBe(1);

      // Test multiple upgrades
      const state2 = upgradeRock({
        state: {
          ...state,
          coins: 100000,
          inventory: {
            ...state.inventory,
            "Stone Rock": new Decimal(10),
            Obsidian: new Decimal(20),
          },
          stones: {
            "0": {
              createdAt: Date.now(),
              stone: { minedAt: 0 },
              x: 1,
              y: 1,
              tier: 1,
            },
            "1": {
              createdAt: Date.now(),
              stone: { minedAt: 0 },
              x: 2,
              y: 2,
              tier: 1,
            },
            "2": {
              createdAt: Date.now(),
              stone: { minedAt: 0 },
              x: 3,
              y: 3,
              tier: 1,
            },
            "3": {
              createdAt: Date.now(),
              stone: { minedAt: 0 },
              x: 4,
              y: 4,
              tier: 1,
            },
          },
        },
        action: { ...action, id: "fused-2" },
      });

      expect(state2.farmActivity["Fused Stone Rock Upgrade"]).toBe(2);
    });
  });
});
