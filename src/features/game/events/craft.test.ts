import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "../lib/constants";
import { SEEDS } from "../types/crops";
import { GameState } from "../types/game";
import { craft } from "./craft";

const GAME_STATE: GameState = INITIAL_FARM;

describe("craft", () => {
  it("throws an error if item is not craftable", () => {
    expect(() =>
      craft({
        state: GAME_STATE,
        action: {
          type: "item.crafted",
          item: "Sunflower Statue",
          amount: 1,
        },
      })
    ).toThrow("This item is not craftable: Sunflower");
  });

  it("throws an error if item is disabled", () => {
    expect(() =>
      craft({
        state: GAME_STATE,
        action: {
          type: "item.crafted",
          item: "Rod",
          amount: 1,
        },
      })
    ).toThrow("This item is disabled");
  });

  it("does not craft item if there is not enough funds", () => {
    expect(() =>
      craft({
        state: {
          ...GAME_STATE,
          balance: new Decimal(0.0000005),
        },
        action: {
          type: "item.crafted",
          item: "Sunflower Seed",
          amount: 1,
        },
      })
    ).toThrow("Insufficient tokens");
  });

  it("does not craft item if there is insufficient ingredients", () => {
    expect(() =>
      craft({
        state: {
          ...GAME_STATE,
          balance: new Decimal(10),
          inventory: {},
        },
        action: {
          type: "item.crafted",
          item: "Pickaxe",
          amount: 1,
        },
      })
    ).toThrow("Insufficient ingredient: Wood");
  });

  it("crafts item with sufficient balance", () => {
    const state = craft({
      state: {
        ...GAME_STATE,
        balance: new Decimal(1),
      },
      action: {
        type: "item.crafted",
        item: "Sunflower Seed",
        amount: 1,
      },
    });

    expect(state.balance).toEqual(
      new Decimal(1).minus(SEEDS()["Sunflower Seed"].tokenAmount as Decimal)
    );
    expect(state.inventory["Sunflower Seed"]).toEqual(new Decimal(1));
  });

  it("does not craft an item with an unusual amount", () => {
    expect(() =>
      craft({
        state: {
          ...GAME_STATE,
          balance: new Decimal(1),
        },
        action: {
          type: "item.crafted",
          item: "Sunflower Seed",
          amount: 0.2,
        },
      })
    ).toThrow("Invalid amount");
  });

  it("crafts item with sufficient ingredients", () => {
    const state = craft({
      state: {
        ...GAME_STATE,
        balance: new Decimal(1),
        inventory: { Wood: new Decimal(10) },
      },
      action: {
        type: "item.crafted",
        item: "Pickaxe",
        amount: 1,
      },
    });

    expect(state.balance).toEqual(new Decimal(0));
    expect(state.inventory["Pickaxe"]).toEqual(new Decimal(1));
    expect(state.inventory["Wood"]).toEqual(new Decimal(8));
  });

  it("crafts an item if they have sufficient materials", () => {
    const state = craft({
      state: {
        ...GAME_STATE,
        balance: new Decimal(1),
        inventory: { "Pumpkin Soup": new Decimal(1) },
      },
      action: {
        type: "item.crafted",
        item: "Carrot Seed",
        amount: 1,
      },
    });

    expect(state.balance).toEqual(
      new Decimal(1).sub(SEEDS()["Carrot Seed"].tokenAmount as Decimal)
    );
    expect(state.inventory["Carrot Seed"]).toEqual(new Decimal(1));
  });

  it("crafts item in bulk given sufficient balance", () => {
    const state = craft({
      state: {
        ...GAME_STATE,
        balance: new Decimal(0.1),
      },
      action: {
        type: "item.crafted",
        item: "Sunflower Seed",
        amount: 10,
      },
    });

    expect(state.balance).toEqual(
      new Decimal(0.1).sub(
        SEEDS()["Sunflower Seed"].tokenAmount?.mul(10) as Decimal
      )
    );
    expect(state.inventory["Sunflower Seed"]).toEqual(new Decimal(10));
  });

  it("crafts item in bulk given sufficient ingredients", () => {
    const state = craft({
      state: {
        ...GAME_STATE,
        balance: new Decimal(10),
        inventory: { Wood: new Decimal(21) },
      },
      action: {
        type: "item.crafted",
        item: "Pickaxe",
        amount: 10,
      },
    });

    expect(state.balance).toEqual(new Decimal(0));
    expect(state.inventory["Pickaxe"]).toEqual(new Decimal(10));
    expect(state.inventory["Wood"]).toEqual(new Decimal(1));
  });

  it("does not craft in bulk given insufficient ingredients", () => {
    expect(() =>
      craft({
        state: {
          ...GAME_STATE,
          balance: new Decimal(10),
          inventory: { Wood: new Decimal(8) },
        },
        action: {
          type: "item.crafted",
          item: "Pickaxe",
          amount: 10,
        },
      })
    ).toThrow("Insufficient ingredient: Wood");
  });

  // it("does not craft an item that is not in stock", () => {
  //   expect(() =>
  //     craft({
  //       state: {
  //         ...GAME_STATE,
  //         stock: {
  //           "Sunflower Seed": new Decimal(0),
  //         },
  //         balance: new Decimal(10),
  //       },
  //       action: {
  //         type: "item.crafted",
  //         item: "Sunflower Seed",
  //         amount: 1,
  //       },
  //     })
  //   ).toThrow("Not enough stock");
  // });

  it("requires a certain item before crafting", () => {
    expect(() =>
      craft({
        state: {
          ...GAME_STATE,
          balance: new Decimal(1),
          inventory: { Wood: new Decimal(10) },
        },
        action: {
          type: "item.crafted",
          item: "Carrot Seed",
          amount: 1,
        },
      })
    ).toThrow("Missing Pumpkin Soup");
  });
});
