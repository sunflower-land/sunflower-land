import Decimal from "decimal.js-light";
import { INITIAL_STOCK, TEST_FARM } from "./constants";

describe("INITIAL_STOCK", () => {
  it("does not increase stock of tools if Toolshed is placed but NOT ready", () => {
    const state = {
      ...TEST_FARM,
      buildings: {
        Toolshed: [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: Date.now() + 1000,
            id: "1",
          },
        ],
      },
    };
    expect(INITIAL_STOCK(state).Axe).toEqual(new Decimal(200));
    expect(INITIAL_STOCK(state).Pickaxe).toEqual(new Decimal(60));
    expect(INITIAL_STOCK(state)["Stone Pickaxe"]).toEqual(new Decimal(20));
    expect(INITIAL_STOCK(state)["Iron Pickaxe"]).toEqual(new Decimal(5));
  });

  it("increases stock of tools if Toolshed is placed and ready", () => {
    const state = {
      ...TEST_FARM,
      buildings: {
        Toolshed: [
          {
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: Date.now() - 1000,
            id: "1",
          },
        ],
      },
    };

    expect(INITIAL_STOCK(state).Axe).toEqual(new Decimal(300));
    expect(INITIAL_STOCK(state).Pickaxe).toEqual(new Decimal(90));
    expect(INITIAL_STOCK(state)["Stone Pickaxe"]).toEqual(new Decimal(30));
    expect(INITIAL_STOCK(state)["Iron Pickaxe"]).toEqual(new Decimal(8));
  });
});
