import { INITIAL_FARM } from "features/game/lib/constants";
import { collectCrafting } from "./collectCrafting";
import Decimal from "decimal.js-light";

describe("collectCrafting", () => {
  it("adds the item to the inventory", () => {
    const state = collectCrafting({
      state: {
        ...INITIAL_FARM,
        craftingBox: {
          item: { collectible: "Dirt Path" },
          readyAt: 1,
          startedAt: 1,
          status: "crafting",
          recipes: {},
        },
      },
      action: {
        type: "crafting.collected",
      },
    });

    expect(state.inventory["Dirt Path"]).toEqual(new Decimal(1));
  });

  it("sets the state back to idle", () => {
    const state = collectCrafting({
      state: {
        ...INITIAL_FARM,
        craftingBox: {
          item: { collectible: "Dirt Path" },
          readyAt: 1,
          startedAt: 1,
          status: "crafting",
          recipes: {},
        },
      },
      action: {
        type: "crafting.collected",
      },
    });

    expect(state.craftingBox.status).toEqual("idle");
  });

  it("clears the item from the crafting box", () => {
    const state = collectCrafting({
      state: {
        ...INITIAL_FARM,
        craftingBox: {
          item: { collectible: "Dirt Path" },
          readyAt: 1,
          startedAt: 1,
          status: "crafting",
          recipes: {},
        },
      },
      action: {
        type: "crafting.collected",
      },
    });

    expect(state.craftingBox.item).toBeUndefined();
  });

  it("throws if the item is not ready", () => {
    const now = Date.now();

    expect(() =>
      collectCrafting({
        state: {
          ...INITIAL_FARM,
          craftingBox: {
            item: { collectible: "Dirt Path" },
            readyAt: now + 1000,
            startedAt: now,
            status: "crafting",
            recipes: {},
          },
        },
        action: {
          type: "crafting.collected",
        },
        createdAt: now,
      }),
    ).toThrow("Item is not ready");
  });
});
