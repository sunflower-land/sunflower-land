import { INITIAL_FARM } from "features/game/lib/constants";
import { enhancedRestock } from "./enhancedRestock";
import Decimal from "decimal.js-light";

describe("enhancedRestock", () => {
  it("throws an error if player doesn't have enough gems for restock", () => {
    expect(() => {
      enhancedRestock({
        state: {
          ...INITIAL_FARM,
          inventory: {
            ...INITIAL_FARM.inventory,
            Gem: new Decimal(0),
          },
        },
        action: {
          type: "shops.restocked.enhanced",
          npc: "betty",
        },
      });
    }).toThrow("You do not have enough Gems");
  });

  it("restocks only the market", () => {
    const state = enhancedRestock({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Gem: new Decimal(30),
        },
        stock: {
          ...INITIAL_FARM.stock,
          "Sunflower Seed": new Decimal(0),
          Axe: new Decimal(100),
        },
      },
      action: {
        type: "shops.restocked.enhanced",
        npc: "betty",
      },
    });

    expect(state.stock["Sunflower Seed"]).toEqual(new Decimal(400));
    expect(state.stock.Axe).toEqual(new Decimal(100));
  });
  it("restocks only the workbench", () => {
    const state = enhancedRestock({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Gem: new Decimal(30),
        },
        stock: {
          ...INITIAL_FARM.stock,
          "Sunflower Seed": new Decimal(200),
          Axe: new Decimal(0),
        },
      },
      action: {
        type: "shops.restocked.enhanced",
        npc: "blacksmith",
      },
    });

    expect(state.stock["Sunflower Seed"]).toEqual(new Decimal(200));
    expect(state.stock.Axe).toEqual(new Decimal(200));
  });
  it("restocks only the treasure shop tools", () => {
    const state = enhancedRestock({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Gem: new Decimal(30),
        },
        stock: {
          ...INITIAL_FARM.stock,
          "Sunflower Seed": new Decimal(200),
          Axe: new Decimal(100),
          "Sand Shovel": new Decimal(0),
        },
      },
      action: {
        type: "shops.restocked.enhanced",
        npc: "jafar",
      },
    });

    expect(state.stock["Sunflower Seed"]).toEqual(new Decimal(200));
    expect(state.stock.Axe).toEqual(new Decimal(100));
    expect(state.stock["Sand Shovel"]).toEqual(new Decimal(50));
  });
});
