import Decimal from "decimal.js-light";
import { INITIAL_FARM, INITIAL_BUMPKIN } from "../lib/constants";
import { SeedName, SEEDS } from "../types/crops";
import { GameState } from "../types/game";
import { seedBought } from "./seedBought";

const GAME_STATE: GameState = INITIAL_FARM;

describe("seedBought", () => {
  it("throws an error if item is not a seed", () => {
    expect(() =>
      seedBought({
        state: GAME_STATE,
        action: {
          type: "seed.bought",
          item: "Goblin Key" as SeedName,
          amount: 1,
        },
      })
    ).toThrow("This item is not a seed");
  });

  it("does not craft seed if required level is not reached", () => {
    expect(() =>
      seedBought({
        state: {
          ...GAME_STATE,
          bumpkin: {
            ...INITIAL_BUMPKIN,
            experience: 100,
          },
        },
        action: {
          type: "seed.bought",
          item: "Pumpkin Seed",
          amount: 1,
        },
      })
    ).toThrow("Inadequate level");
  });

  it("does not craft an item with an unusual amount", () => {
    expect(() =>
      seedBought({
        state: {
          ...GAME_STATE,
          balance: new Decimal(1),
        },
        action: {
          type: "seed.bought",
          item: "Sunflower Seed",
          amount: 0.2,
        },
      })
    ).toThrow("Invalid amount");
  });

  it("does not craft an item that is not in stock", () => {
    expect(() =>
      seedBought({
        state: {
          ...GAME_STATE,
          stock: {
            "Sunflower Seed": new Decimal(0),
          },
        },
        action: {
          type: "seed.bought",
          item: "Sunflower Seed",
          amount: 1,
        },
      })
    ).toThrow("Not enough stock");
  });

  it("does not craft seed if there is not enough funds", () => {
    expect(() =>
      seedBought({
        state: {
          ...GAME_STATE,
          balance: new Decimal(0),
        },
        action: {
          type: "seed.bought",
          item: "Sunflower Seed",
          amount: 1,
        },
      })
    ).toThrow("Insufficient tokens");
  });

  it("burns the SFL on purchase", () => {
    const balance = new Decimal(1);
    const state = seedBought({
      state: {
        ...GAME_STATE,
        balance,
      },
      action: {
        type: "seed.bought",
        item: "Sunflower Seed",
        amount: 1,
      },
    });

    expect(state.balance).toEqual(
      balance.minus(SEEDS()["Sunflower Seed"].tokenAmount as Decimal)
    );
  });

  it("mints the newly bought seed", () => {
    const balance = new Decimal(1);
    const item = "Sunflower Seed";
    const amount = 1;
    const state = seedBought({
      state: {
        ...GAME_STATE,
        balance,
      },
      action: {
        item,
        amount,
        type: "seed.bought",
      },
    });

    const oldAmount = GAME_STATE.inventory[item] ?? new Decimal(0);

    expect(state.inventory[item]).toEqual(oldAmount.add(amount));
  });

  it("purchases a seed that requires level 2", () => {
    const balance = new Decimal(1);
    const item = "Pumpkin Seed";
    const amount = 1;
    const state = seedBought({
      state: {
        ...GAME_STATE,
        balance,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: 200,
        },
      },
      action: {
        item,
        amount,
        type: "seed.bought",
      },
    });

    const oldAmount = GAME_STATE.inventory[item] ?? new Decimal(0);

    expect(state.balance).toEqual(
      balance.minus(SEEDS()[item].tokenAmount as Decimal)
    );
    expect(state.inventory[item]).toEqual(oldAmount.add(amount));
  });

  it("crafts seed in bulk given sufficient balance", () => {
    const balance = new Decimal(1);
    const item = "Pumpkin Seed";
    const amount = 10;
    const state = seedBought({
      state: {
        ...GAME_STATE,
        balance,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: 200,
        },
      },
      action: {
        item,
        amount,
        type: "seed.bought",
      },
    });

    const oldAmount = GAME_STATE.inventory[item] ?? new Decimal(0);

    expect(state.balance).toEqual(
      balance.minus(SEEDS()[item].tokenAmount?.mul(amount) as Decimal)
    );
    expect(state.inventory[item]).toEqual(oldAmount.add(amount));
  });

  it("throws an error if the player doesnt have a bumpkin", async () => {
    expect(() =>
      seedBought({
        state: {
          ...GAME_STATE,
          bumpkin: undefined,
        },
        action: {
          type: "seed.bought",
          item: "Sunflower Seed",
          amount: 1,
        },
      })
    ).toThrow("Bumpkin not found");
  });

  it("increments the sfl spent activity ", () => {
    const state = seedBought({
      state: {
        ...GAME_STATE,
        balance: new Decimal(1),
      },
      action: {
        type: "seed.bought",
        item: "Sunflower Seed",
        amount: 1,
      },
    });
    expect(state.bumpkin?.activity?.["SFL Spent"]).toEqual(
      SEEDS()["Sunflower Seed"].tokenAmount?.toNumber()
    );
  });

  it("increments the seed bought activity ", () => {
    const amount = 1;
    const state = seedBought({
      state: {
        ...GAME_STATE,
        balance: new Decimal(1),
      },
      action: {
        type: "seed.bought",
        item: "Sunflower Seed",
        amount,
      },
    });
    expect(state.bumpkin?.activity?.["Sunflower Seed Bought"]).toEqual(amount);
  });
});
