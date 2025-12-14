import Decimal from "decimal.js-light";
import { WORKBENCH_TOOLS } from "features/game/types/tools";
import { TEST_FARM } from "../../lib/constants";
import { GameState } from "../../types/game";
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
});
