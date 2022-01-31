import Decimal from "decimal.js-light";
import { GameState } from "../types/game";
import { craft } from "./craft";

let GAME_STATE: GameState = {
  id: 1,
  fields: [],
  balance: new Decimal(0),
  inventory: {},
};

describe("craft", () => {
  it("throws an error if item is not craftable", () => {
    expect(() =>
      craft(GAME_STATE, {
        type: "item.crafted",
        item: "Sunflower",
        amount: 1,
      })
    ).toThrow("This item is not craftable: Sunflower");
  });

  it("does not craft item if there is not enough funds", () => {
    expect(() =>
      craft(
        {
          ...GAME_STATE,
          balance: new Decimal(0.005),
        },
        {
          type: "item.crafted",
          item: "Sunflower Seed",
          amount: 1,
        }
      )
    ).toThrow("Insufficient tokens");
  });

  it("does not craft item if there is insufficient ingredients", () => {
    expect(() =>
      craft(
        {
          ...GAME_STATE,
          balance: new Decimal(10),
          inventory: { Wood: 0 },
        },
        {
          type: "item.crafted",
          item: "Pickaxe",
          amount: 1,
        }
      )
    ).toThrow("Insufficient ingredient: Wood");
  });

  it("crafts item with sufficient balance", () => {
    const state = craft(
      {
        ...GAME_STATE,
        balance: new Decimal(1),
      },
      {
        type: "item.crafted",
        item: "Sunflower Seed",
        amount: 1,
      }
    );

    expect(state.balance).toEqual(new Decimal(0.99));
    expect(state.inventory["Sunflower Seed"]).toBe(1);
  });

  it("does not craft an item with an unusual amount", () => {
    expect(() =>
      craft(
        {
          ...GAME_STATE,
          balance: new Decimal(1),
        },
        {
          type: "item.crafted",
          item: "Sunflower Seed",
          amount: 2,
        }
      )
    ).toThrow("Invalid amount");
  });

  it("crafts item with sufficient ingredients", () => {
    const state = craft(
      {
        ...GAME_STATE,
        balance: new Decimal(1),
        inventory: { Wood: 10 },
      },
      {
        type: "item.crafted",
        item: "Pickaxe",
        amount: 1,
      }
    );

    expect(state.balance).toEqual(new Decimal(0));
    expect(state.inventory["Pickaxe"]).toBe(1);
    expect(state.inventory["Wood"]).toBe(8);
  });

  it("requires a certain item before crafting", () => {
    expect(() =>
      craft(
        {
          ...GAME_STATE,
          balance: new Decimal(1),
          inventory: { Wood: 10 },
        },
        {
          type: "item.crafted",
          item: "Carrot Seed",
          amount: 1,
        }
      )
    ).toThrow("Missing Pumpkin Soup");
  });

  it("crafts an item if they have sufficient materials", () => {
    const state = craft(
      {
        ...GAME_STATE,
        balance: new Decimal(1),
        inventory: { "Pumpkin Soup": 1 },
      },
      {
        type: "item.crafted",
        item: "Carrot Seed",
        amount: 1,
      }
    );

    expect(state.balance).toEqual(new Decimal(0.5));
    expect(state.inventory["Carrot Seed"]).toBe(1);
  });

  it("crafts item in bulk given sufficient balance", () => {
    const state = craft(
      {
        ...GAME_STATE,
        balance: new Decimal(0.1),
      },
      {
        type: "item.crafted",
        item: "Sunflower Seed",
        amount: 10,
      }
    );

    expect(state.balance).toEqual(new Decimal(0));
    expect(state.inventory["Sunflower Seed"]).toBe(10);
  });

  it("crafts item in bulk given sufficient ingredients", () => {
    const state = craft(
      {
        ...GAME_STATE,
        balance: new Decimal(10),
        inventory: { Wood: 21 },
      },
      {
        type: "item.crafted",
        item: "Pickaxe",
        amount: 10,
      }
    );

    expect(state.balance).toEqual(new Decimal(0));
    expect(state.inventory["Pickaxe"]).toBe(10);
    expect(state.inventory["Wood"]).toBe(1);
  });

  it("does not craft in bulk given insufficient ingredients", () => {
    expect(() =>
      craft(
        {
          ...GAME_STATE,
          balance: new Decimal(10),
          inventory: { Wood: 8 },
        },
        {
          type: "item.crafted",
          item: "Pickaxe",
          amount: 10,
        }
      )
    ).toThrow("Insufficient ingredient: Wood");
  });
});
