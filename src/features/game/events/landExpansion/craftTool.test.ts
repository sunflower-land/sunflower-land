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
      })
    ).toThrow("Tool does not exist");
  });

  it("does not craft item if there is not enough funds", () => {
    expect(() =>
      craftTool({
        state: {
          ...GAME_STATE,
          balance: new Decimal(0.0000005),
        },
        action: {
          type: "tool.crafted",
          tool: "Axe",
        },
      })
    ).toThrow("Insufficient tokens");
  });

  it("does not craft item if there is insufficient ingredients", () => {
    expect(() =>
      craftTool({
        state: {
          ...GAME_STATE,
          balance: new Decimal(10),
          inventory: {},
        },
        action: {
          type: "tool.crafted",
          tool: "Pickaxe",
        },
      })
    ).toThrow("Insufficient ingredient: Wood");
  });

  it("crafts item with sufficient balance", () => {
    const state = craftTool({
      state: {
        ...GAME_STATE,
        balance: new Decimal(1),
        inventory: {},
      },
      action: {
        type: "tool.crafted",
        tool: "Axe",
      },
    });

    expect(state.balance).toEqual(
      new Decimal(1).minus(WORKBENCH_TOOLS()["Axe"].sfl)
    );
    expect(state.inventory["Axe"]).toEqual(new Decimal(1));
  });

  it("crafts item with sufficient ingredients", () => {
    const state = craftTool({
      state: {
        ...GAME_STATE,
        balance: new Decimal(1),
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

  it("does not craft an item that is not in stock", () => {
    expect(() =>
      craftTool({
        state: {
          ...GAME_STATE,
          stock: {
            Axe: new Decimal(0),
          },
          balance: new Decimal(10),
        },
        action: {
          type: "tool.crafted",
          tool: "Axe",
        },
      })
    ).toThrow("Not enough stock");
  });
});

it("increments Axe Crafted activity by 1 when 1 axe is crafted", () => {
  const state = craftTool({
    state: {
      ...GAME_STATE,
      balance: new Decimal(1),
      inventory: {},
    },
    action: {
      type: "tool.crafted",
      tool: "Axe",
    },
  });

  expect(state.bumpkin?.activity?.["Axe Crafted"]).toBe(1);
});

it("increments SFL spent when axe is crafted", () => {
  const state = craftTool({
    state: {
      ...GAME_STATE,
      balance: new Decimal(1),
      inventory: {},
    },
    action: {
      type: "tool.crafted",
      tool: "Axe",
    },
  });

  expect(state.bumpkin?.activity?.["SFL Spent"]).toEqual(0.0625);
});
