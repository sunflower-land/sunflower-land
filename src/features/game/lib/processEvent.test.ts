import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "./constants";
import { GameState, TradeListing } from "../types/game";
import { checkProgress } from "./processEvent";

describe("processEvent", () => {
  describe("checkProgress", () => {
    it("should return false if the player has 1001 pumpkin soups", () => {
      const state: GameState = {
        ...INITIAL_FARM,
        inventory: {
          "Pumpkin Soup": new Decimal(1000),
        },
        buildings: {
          "Fire Pit": [
            {
              id: "1",
              readyAt: Date.now(),
              createdAt: Date.now(),
              crafting: [
                {
                  name: "Pumpkin Soup",
                  readyAt: Date.now(),
                },
              ],
            },
          ],
        },
      };

      const result = checkProgress({
        state,
        action: {
          type: "recipes.collected",
          building: "Fire Pit",
          buildingId: "1",
        },
        farmId: 1,
        createdAt: Date.now(),
      });

      expect(result.valid).toBe(false);
    });

    it("should return false if a player has 100 chef hats and 1 listed", () => {
      const state: GameState = {
        ...INITIAL_FARM,
        inventory: {
          "Chef Hat": new Decimal(100),
          Axe: new Decimal(1),
        },
        trades: {
          listings: {
            "123": {
              collection: "wearables",
              items: {
                "Chef Hat": 1,
              },
              sfl: 100,
              createdAt: Date.now(),
              tradeType: "instant",
            },
          },
        },
      };

      const result = checkProgress({
        state,
        action: {
          type: "timber.chopped",
          index: "1",
          item: "Axe",
        },
        farmId: 1,
        createdAt: Date.now(),
      });

      expect(result.valid).toBe(false);
    });

    it("should return false if a player has 100 chef hats and 1 listed with no collection", () => {
      const state: GameState = {
        ...INITIAL_FARM,
        inventory: {
          "Chef Hat": new Decimal(100),
          Axe: new Decimal(1),
        },
        trades: {
          listings: {
            "123": {
              items: {
                "Chef Hat": 1,
              },
              sfl: 100,
              createdAt: Date.now(),
              tradeType: "instant",
            } as TradeListing,
          },
        },
      };

      const result = checkProgress({
        state,
        action: {
          type: "timber.chopped",
          index: "1",
          item: "Axe",
        },
        farmId: 1,
        createdAt: Date.now(),
      });

      expect(result.valid).toBe(false);
    });

    it("should return false if a player has 1200 tomatoes and 10 listed with no collection", () => {
      const state: GameState = {
        ...INITIAL_FARM,
        inventory: {
          "Chef Hat": new Decimal(100),
          Axe: new Decimal(1),
        },
        trades: {
          listings: {
            "123": {
              items: {
                "Chef Hat": 1,
              },
              sfl: 100,
              createdAt: Date.now(),
              tradeType: "instant",
            } as TradeListing,
          },
        },
      };

      const result = checkProgress({
        state,
        action: {
          type: "timber.chopped",
          index: "1",
          item: "Axe",
        },
        farmId: 1,
        createdAt: Date.now(),
      });

      expect(result.valid).toBe(false);
    });

    it("should return true if the player is all good", () => {
      const state: GameState = {
        ...INITIAL_FARM,
        inventory: {
          Tomato: new Decimal(1200),
        },
      };

      const result = checkProgress({
        state,
        action: {
          type: "timber.chopped",
          index: "1",
          item: "Axe",
        },
        farmId: 1,
        createdAt: Date.now(),
      });

      expect(result.valid).toBe(true);
    });
  });
});
