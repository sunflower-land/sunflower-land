import Decimal from "decimal.js-light";
import { expansionRequirements, getRewards } from "./revealLand";
import { TEST_FARM } from "features/game/lib/constants";
import { EXPANSION_REQUIREMENTS } from "features/game/types/expansions";

describe("expansionRequirements", () => {
  it("returns normal expansion requirements", () => {
    const requirements = expansionRequirements({ level: 6, game: TEST_FARM });

    expect(requirements?.resources).toEqual({
      Stone: 3,
      Wood: 5,
    });
  });
  it("returns discounted expansion requirements with Grinx Hammer", () => {
    const requirements = expansionRequirements({
      game: {
        ...TEST_FARM,
        collectibles: {
          "Grinx's Hammer": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: Date.now(),
              id: "123",
              readyAt: Date.now(),
            },
          ],
        },
      },
      level: 6,
    });

    expect(requirements?.resources).toEqual({
      Stone: 1.5,
      Wood: 2.5,
    });
  });

  describe("getRewards", () => {
    it("returns rewards for previously built expansions", () => {
      const rewards = getRewards({
        game: {
          ...TEST_FARM,
          inventory: {
            "Basic Land": new Decimal(5),
          },
          island: {
            type: "spring",
            previousExpansions: 16,
          },
        },
        createdAt: Date.now(),
      });

      expect(rewards[0].items).toEqual(
        EXPANSION_REQUIREMENTS.basic[10].resources
      );
    });
    it("returns correct maximum refund rewards", () => {
      const rewards = getRewards({
        game: {
          ...TEST_FARM,
          inventory: {
            "Basic Land": new Decimal(18),
          },
          island: {
            type: "spring",
            previousExpansions: 23,
          },
        },
        createdAt: Date.now(),
      });

      expect(rewards[0].items).toEqual(
        EXPANSION_REQUIREMENTS.basic[23].resources
      );
    });
    it("does not return anymore rewards if player has no more expansion refunds", () => {
      const rewards = getRewards({
        game: {
          ...TEST_FARM,
          inventory: {
            "Basic Land": new Decimal(5),
          },
          island: {
            type: "spring",
            previousExpansions: 9,
          },
        },
        createdAt: Date.now(),
      });

      expect(rewards).toEqual([]);
    });
  });
});
