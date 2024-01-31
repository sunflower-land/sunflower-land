import Decimal from "decimal.js-light";
import { expansionRequirements, getRewards } from "./revealLand";
import { TEST_FARM } from "features/game/lib/constants";
import {
  EXPANSION_REQUIREMENTS,
  SPRING_LAYOUTS,
  getBasicLand,
} from "features/game/types/expansions";
import {
  Nodes,
  TOTAL_EXPANSION_NODES,
} from "features/game/expansion/lib/expansionNodes";

describe("expansionRequirements", () => {
  it("returns normal expansion requirements", () => {
    const requirements = expansionRequirements({ game: TEST_FARM });

    expect(requirements?.resources).toEqual({
      Wood: 3,
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
    });

    expect(requirements?.resources).toEqual({
      Wood: 1.5,
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

describe("totalExpansions", () => {
  it("should have the correct amount of nodes for each basic expansion", () => {
    // Starting nodes
    const nodes: Nodes = {
      "Crimstone Rock": 0,
      "Crop Plot": 9,
      "Flower Bed": 0,
      "Fruit Patch": 0,
      "Gold Rock": 0,
      "Iron Rock": 0,
      "Stone Rock": 2,
      "Sunstone Rock": 0,
      Beehive: 0,
      Tree: 3,
    };

    let expansion = 4;
    while (expansion <= 9 && getBasicLand({ id: 1, expansion })) {
      const layout = getBasicLand({ id: 1, expansion });

      if (layout) {
        nodes.Beehive += layout.beehives?.length ?? 0;
        nodes["Crop Plot"] += layout.plots?.length ?? 0;
        nodes["Flower Bed"] += layout.flowerBeds?.length ?? 0;
        nodes["Fruit Patch"] += layout.fruitPatches?.length ?? 0;
        nodes["Gold Rock"] += layout.gold?.length ?? 0;
        nodes["Iron Rock"] += layout.iron?.length ?? 0;
        nodes["Stone Rock"] += layout.stones?.length ?? 0;
        nodes["Sunstone Rock"] += layout.sunstones?.length ?? 0;
        nodes.Tree += layout.trees?.length ?? 0;
        nodes["Crimstone Rock"] += layout.crimstones?.length ?? 0;

        // console.log({ expansion, nodes });
        expect(nodes).toEqual(TOTAL_EXPANSION_NODES.basic[expansion]);
      }

      expansion += 1;
    }
  });

  it("should have the correct amount of nodes for each spring expansion", () => {
    // Starting nodes
    const nodes = TOTAL_EXPANSION_NODES.spring[4];

    let expansion = 5;
    while (SPRING_LAYOUTS[expansion]) {
      const layout = SPRING_LAYOUTS[expansion];

      nodes.Beehive += layout.beehives?.length ?? 0;
      nodes["Crop Plot"] += layout.plots?.length ?? 0;
      nodes["Flower Bed"] += layout.flowerBeds?.length ?? 0;
      nodes["Fruit Patch"] += layout.fruitPatches?.length ?? 0;
      nodes["Gold Rock"] += layout.gold?.length ?? 0;
      nodes["Iron Rock"] += layout.iron?.length ?? 0;
      nodes["Stone Rock"] += layout.stones?.length ?? 0;
      nodes["Sunstone Rock"] += layout.sunstones?.length ?? 0;
      nodes.Tree += layout.trees?.length ?? 0;
      nodes["Crimstone Rock"] += layout.crimstones?.length ?? 0;

      expect(nodes).toEqual(TOTAL_EXPANSION_NODES.spring[expansion]);

      expansion += 1;
    }
  });
});
