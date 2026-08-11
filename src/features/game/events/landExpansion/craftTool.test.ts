import Decimal from "decimal.js-light";
import { WORKBENCH_TOOLS } from "features/game/types/tools";
import { TEST_FARM } from "../../lib/constants";
import type { GameState } from "../../types/game";
import { craftTool } from "./craftTool";

const GAME_STATE: GameState = TEST_FARM;

describe("craftTool", () => {
  it("throws an error if item is not craftable", () => {
    expect(() =>
      craftTool({
        state: GAME_STATE,
        action: {
          type: "tool.crafted",
          tool: "Sunflower Statue" as any,
        },
      }),
    ).toThrow("Tool does not exist");
  });

  it("does not craft tool if there is not enough funds", () => {
    expect(() =>
      craftTool({
        state: {
          ...GAME_STATE,
          coins: 1,
        },
        action: {
          type: "tool.crafted",
          tool: "Axe",
        },
      }),
    ).toThrow("Insufficient Coins");
  });

  it("does not craft tool if there is insufficient ingredients", () => {
    expect(() =>
      craftTool({
        state: {
          ...GAME_STATE,
          coins: 100,
          inventory: {},
        },
        action: {
          type: "tool.crafted",
          tool: "Pickaxe",
        },
      }),
    ).toThrow("Insufficient ingredient: Wood");
  });

  it("crafts tool with sufficient balance", () => {
    const coins = 100;
    const state = craftTool({
      state: {
        ...GAME_STATE,
        coins,
        inventory: {},
      },
      action: {
        type: "tool.crafted",
        tool: "Axe",
      },
    });

    expect(state.coins).toEqual(coins - WORKBENCH_TOOLS["Axe"].price);
    expect(state.inventory["Axe"]).toEqual(new Decimal(1));
  });

  it("crafts tool with sufficient ingredients", () => {
    const state = craftTool({
      state: {
        ...GAME_STATE,
        coins: 100,
        inventory: { Wood: new Decimal(10) },
      },
      action: {
        type: "tool.crafted",
        tool: "Pickaxe",
      },
    });

    expect(state.inventory["Pickaxe"]).toEqual(new Decimal(1));
    expect(state.inventory["Wood"]).toEqual(new Decimal(7));
  });

  it("applies Reel Deal rank 1 (x0.5) to the Rod coin cost", () => {
    const coins = 100;
    const state = craftTool({
      state: {
        ...GAME_STATE,
        coins,
        inventory: { Wood: new Decimal(10), Stone: new Decimal(10) },
        bumpkin: {
          ...TEST_FARM.bumpkin,
          skills: { "Reel Deal": 1 },
        },
      },
      action: {
        type: "tool.crafted",
        tool: "Rod",
      },
    });

    // Rod base price is 20; x0.5 => 10.
    expect(state.coins).toEqual(coins - 10);
    expect(state.inventory["Rod"]).toEqual(new Decimal(1));
  });

  it("scales Reel Deal with rank (x0.4 at rank 3)", () => {
    const coins = 100;
    const state = craftTool({
      state: {
        ...GAME_STATE,
        coins,
        inventory: { Wood: new Decimal(10), Stone: new Decimal(10) },
        bumpkin: {
          ...TEST_FARM.bumpkin,
          skills: { "Reel Deal": 3 },
        },
      },
      action: {
        type: "tool.crafted",
        tool: "Rod",
      },
    });

    // Rod base price is 20; x0.4 => 8.
    expect(state.coins).toEqual(coins - 8);
    expect(state.inventory["Rod"]).toEqual(new Decimal(1));
  });

  it("does not craft a tool that is not in stock", () => {
    expect(() =>
      craftTool({
        state: {
          ...GAME_STATE,
          stock: {
            Axe: new Decimal(0),
          },
          coins: 100,
        },
        action: {
          type: "tool.crafted",
          tool: "Axe",
        },
      }),
    ).toThrow("Not enough stock");
  });

  it("increments Axe Crafted activity by 1 when 1 axe is crafted", () => {
    const state = craftTool({
      state: {
        ...GAME_STATE,
        coins: 100,
        inventory: {},
      },
      action: {
        type: "tool.crafted",
        tool: "Axe",
      },
    });

    expect(state.farmActivity["Axe Crafted"]).toBe(1);
  });

  it("increments Coins spent when axe is crafted", () => {
    const state = craftTool({
      state: {
        ...GAME_STATE,
        coins: 100,
        inventory: {},
      },
      action: {
        type: "tool.crafted",
        tool: "Axe",
      },
    });

    expect(state.farmActivity["Coins Spent"]).toEqual(20);
  });

  it("does not craft a tool that has a required island expansion that the player has not reached", () => {
    expect(() =>
      craftTool({
        state: {
          ...GAME_STATE,
          coins: 100,
          inventory: { Wood: new Decimal(25), Iron: new Decimal(10) },
        },
        action: {
          type: "tool.crafted",
          tool: "Oil Drill",
        },
      }),
    ).toThrow("You do not have the required island expansion");
  });

  it("Axes cost 20% less coins with Feller's Discount skill", () => {
    const state = craftTool({
      state: {
        ...GAME_STATE,
        coins: 100,
        inventory: {},
        bumpkin: {
          ...GAME_STATE.bumpkin,
          skills: {
            "Feller's Discount": 1,
          },
        },
      },
      action: {
        type: "tool.crafted",
        tool: "Axe",
      },
    });

    expect(state.coins).toEqual(84);
  });

  it("Axes cost 25% less coins with Feller's Discount skill at rank 2", () => {
    const state = craftTool({
      state: {
        ...GAME_STATE,
        coins: 100,
        inventory: {},
        bumpkin: {
          ...GAME_STATE.bumpkin,
          skills: {
            "Feller's Discount": 2,
          },
        },
      },
      action: {
        type: "tool.crafted",
        tool: "Axe",
      },
    });

    // Axe base price 20 coins * 0.75 = 15 => 100 - 15 = 85
    expect(state.coins).toEqual(85);
  });

  it("Axes cost 30% less coins with Feller's Discount skill at rank 3", () => {
    const state = craftTool({
      state: {
        ...GAME_STATE,
        coins: 100,
        inventory: {},
        bumpkin: {
          ...GAME_STATE.bumpkin,
          skills: {
            "Feller's Discount": 3,
          },
        },
      },
      action: {
        type: "tool.crafted",
        tool: "Axe",
      },
    });

    // Axe base price 20 coins * 0.7 = 14 => 100 - 14 = 86
    expect(state.coins).toEqual(86);
  });

  it("pickaxe cost 20% less coins with  skill", () => {
    const state = craftTool({
      state: {
        ...GAME_STATE,
        coins: 100,
        inventory: {
          Wood: new Decimal(3),
        },
        bumpkin: {
          ...GAME_STATE.bumpkin,
          skills: {
            "Frugal Miner": 1,
          },
        },
      },
      action: {
        type: "tool.crafted",
        tool: "Pickaxe",
      },
    });

    expect(state.coins).toEqual(84);
  });
  it("pickaxe cost 30% less coins with Frugal Miner at rank 2", () => {
    const state = craftTool({
      state: {
        ...GAME_STATE,
        coins: 100,
        inventory: { Wood: new Decimal(3) },
        bumpkin: {
          ...GAME_STATE.bumpkin,
          skills: { "Frugal Miner": 2 },
        },
      },
      action: { type: "tool.crafted", tool: "Pickaxe" },
    });

    expect(state.coins).toEqual(86);
  });
  it("pickaxe cost 40% less coins with Frugal Miner at rank 3", () => {
    const state = craftTool({
      state: {
        ...GAME_STATE,
        coins: 100,
        inventory: { Wood: new Decimal(3) },
        bumpkin: {
          ...GAME_STATE.bumpkin,
          skills: { "Frugal Miner": 3 },
        },
      },
      action: { type: "tool.crafted", tool: "Pickaxe" },
    });

    expect(state.coins).toEqual(88);
  });
  it("stone pickaxe cost 20% less coins with  skill", () => {
    const state = craftTool({
      state: {
        ...GAME_STATE,
        coins: 100,
        inventory: {
          Wood: new Decimal(3),
          Stone: new Decimal(5),
        },
        bumpkin: {
          ...GAME_STATE.bumpkin,
          skills: {
            "Frugal Miner": 1,
          },
        },
      },
      action: {
        type: "tool.crafted",
        tool: "Stone Pickaxe",
      },
    });

    expect(state.coins).toEqual(84);
  });
  it("iron pickaxe cost 20% less coins with  skill", () => {
    const state = craftTool({
      state: {
        ...GAME_STATE,
        coins: 100,
        inventory: {
          Wood: new Decimal(3),
          Iron: new Decimal(5),
        },
        bumpkin: {
          ...GAME_STATE.bumpkin,
          skills: {
            "Frugal Miner": 1,
          },
        },
      },
      action: {
        type: "tool.crafted",
        tool: "Iron Pickaxe",
      },
    });

    expect(state.coins).toEqual(36);
  });
  it("gold pickaxe cost 20% less coins with  skill", () => {
    const state = craftTool({
      state: {
        ...GAME_STATE,
        coins: 100,
        inventory: {
          Wood: new Decimal(3),
          Gold: new Decimal(3),
        },
        bumpkin: {
          ...GAME_STATE.bumpkin,
          skills: {
            "Frugal Miner": 1,
          },
        },
      },
      action: {
        type: "tool.crafted",
        tool: "Gold Pickaxe",
      },
    });

    expect(state.coins).toEqual(20);
  });

  it("costs 20 wool instead of leather to craft oil drill with oil rig skill", () => {
    const state = craftTool({
      state: {
        ...GAME_STATE,
        coins: 100,
        inventory: {
          Wool: new Decimal(20),
          Wood: new Decimal(20),
          Iron: new Decimal(9),
          Leather: new Decimal(10),
        },
        bumpkin: {
          ...GAME_STATE.bumpkin,
          skills: {
            "Oil Rig": 1,
          },
        },
        island: {
          type: "desert",
        },
      },
      action: {
        type: "tool.crafted",
        tool: "Oil Drill",
      },
    });

    expect(state.inventory["Wool"]).toEqual(new Decimal(0));
    expect(state.inventory["Leather"]).toEqual(new Decimal(10));
    expect(state.inventory["Oil Drill"]).toEqual(new Decimal(1));
  });

  // Rank 1 (20 Wool) is covered above; ranks scale the wool cost down.
  it.each([
    [2, 15],
    [3, 10],
  ])(
    "crafts oil drill with %i Oil Rig rank => %i wool instead of leather",
    (rank, wool) => {
      const state = craftTool({
        state: {
          ...GAME_STATE,
          coins: 100,
          inventory: {
            Wool: new Decimal(wool),
            Wood: new Decimal(20),
            Iron: new Decimal(9),
            Leather: new Decimal(10),
          },
          bumpkin: {
            ...GAME_STATE.bumpkin,
            skills: {
              "Oil Rig": rank,
            },
          },
          island: {
            type: "desert",
          },
        },
        action: {
          type: "tool.crafted",
          tool: "Oil Drill",
        },
      });

      expect(state.inventory["Wool"]).toEqual(new Decimal(0));
      expect(state.inventory["Leather"]).toEqual(new Decimal(10));
      expect(state.inventory["Oil Drill"]).toEqual(new Decimal(1));
    },
  );

  it("does not craft a tool if the bumpkin level is below the required level", () => {
    expect(() =>
      craftTool({
        state: {
          ...GAME_STATE,
          coins: 1000,
          inventory: {
            Feather: new Decimal(5),
            Wool: new Decimal(3),
          },
          bumpkin: {
            ...GAME_STATE.bumpkin,
            experience: 40154, // Level 17, below required level 18
          },
        },
        action: {
          type: "tool.crafted",
          tool: "Crab Pot",
        },
      }),
    ).toThrow("You do not have the required level");
  });

  it("crafts a tool when the bumpkin level meets the required level", () => {
    const state = craftTool({
      state: {
        ...GAME_STATE,
        coins: 1000,
        inventory: {
          Feather: new Decimal(5),
          Wool: new Decimal(3),
        },
        bumpkin: {
          ...GAME_STATE.bumpkin,
          experience: 47405, // Level 18, meets required level 18
        },
      },
      action: {
        type: "tool.crafted",
        tool: "Crab Pot",
      },
    });

    expect(state.inventory["Crab Pot"]).toEqual(new Decimal(1));
  });

  it("crafts a tool when the bumpkin level exceeds the required level", () => {
    const state = craftTool({
      state: {
        ...GAME_STATE,
        coins: 1000,
        inventory: {
          Feather: new Decimal(10),
          "Merino Wool": new Decimal(10),
        },
        bumpkin: {
          ...GAME_STATE.bumpkin,
          experience: 109155, // Level 24, meets required level 24
        },
      },
      action: {
        type: "tool.crafted",
        tool: "Mariner Pot",
      },
    });

    expect(state.inventory["Mariner Pot"]).toEqual(new Decimal(1));
  });

  it("Salt Rakes cost 20% less coins with Cheap Rakes skill", () => {
    const state = craftTool({
      state: {
        ...GAME_STATE,
        coins: 100,
        inventory: { Wood: new Decimal(10) },
        bumpkin: {
          ...GAME_STATE.bumpkin,
          skills: {
            "Cheap Rakes": 1,
          },
        },
      },
      action: {
        type: "tool.crafted",
        tool: "Salt Rake",
      },
    });

    expect(state.coins).toEqual(84);
  });

  it("scales the Cheap Rakes discount with rank", () => {
    // Salt Rake base cost is 20 coins: x0.7 -> 14 spent, x0.6 -> 12 spent.
    const craftAtRank = (rank: number) =>
      craftTool({
        state: {
          ...GAME_STATE,
          coins: 100,
          inventory: { Wood: new Decimal(10) },
          bumpkin: {
            ...GAME_STATE.bumpkin,
            skills: {
              "Cheap Rakes": rank,
            },
          },
        },
        action: {
          type: "tool.crafted",
          tool: "Salt Rake",
        },
      }).coins;

    expect(craftAtRank(2)).toEqual(86);
    expect(craftAtRank(3)).toEqual(88);
  });

  it("Salt Rakes cost 10% less with Salt Sculpture level 4", () => {
    const state = craftTool({
      state: {
        ...GAME_STATE,
        coins: 100,
        inventory: { Wood: new Decimal(10) },
        sculptures: { "Salt Sculpture": { level: 4 } },
      },
      action: {
        type: "tool.crafted",
        tool: "Salt Rake",
      },
    });

    expect(state.coins).toEqual(82);
  });

  it("stacks Cheap Rakes + Salt Sculpture level 4 discount", () => {
    const state = craftTool({
      state: {
        ...GAME_STATE,
        coins: 100,
        inventory: { Wood: new Decimal(10) },
        sculptures: { "Salt Sculpture": { level: 4 } },
        bumpkin: {
          ...GAME_STATE.bumpkin,
          skills: {
            "Cheap Rakes": 1,
          },
        },
      },
      action: {
        type: "tool.crafted",
        tool: "Salt Rake",
      },
    });

    expect(state.coins).toEqual(100 - 20 * 0.8 * 0.9);
  });

  describe("weather items", () => {
    it("crafts a weather item when the player does not own one", () => {
      const state = craftTool({
        state: {
          ...GAME_STATE,
          coins: 1000,
          inventory: {
            Wood: new Decimal(100),
            Leather: new Decimal(100),
          },
        },
        action: {
          type: "tool.crafted",
          tool: "Tornado Pinwheel",
        },
      });

      expect(state.inventory["Tornado Pinwheel"]).toStrictEqual(new Decimal(1));
    });

    it("does not craft a weather item if the player already owns one", () => {
      expect(() =>
        craftTool({
          state: {
            ...GAME_STATE,
            coins: 1000,
            inventory: {
              Wood: new Decimal(100),
              Leather: new Decimal(100),
              "Tornado Pinwheel": new Decimal(1),
            },
          },
          action: {
            type: "tool.crafted",
            tool: "Tornado Pinwheel",
          },
        }),
      ).toThrow("You can only have one of this weather item");
    });

    it("does not allow crafting two weather items at once", () => {
      expect(() =>
        craftTool({
          state: {
            ...GAME_STATE,
            coins: 1000,
            inventory: {
              Wood: new Decimal(100),
              Leather: new Decimal(100),
            },
          },
          action: {
            type: "tool.crafted",
            tool: "Tornado Pinwheel",
            amount: 2,
          },
        }),
      ).toThrow("You can only have one of this weather item");
    });
  });
});
