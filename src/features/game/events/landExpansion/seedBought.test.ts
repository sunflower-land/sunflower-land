import "lib/__mocks__/configMock.ts";
import Decimal from "decimal.js-light";

import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { CropSeedName, CROP_SEEDS } from "features/game/types/crops";
import { GameState } from "features/game/types/game";

import { seedBought } from "./seedBought";

const GAME_STATE: GameState = TEST_FARM;

describe("seedBought", () => {
  const dateNow = Date.now();

  it("throws an error if item is not a seed", () => {
    expect(() =>
      seedBought({
        state: GAME_STATE,
        action: {
          type: "seed.bought",
          item: "Goblin Key" as CropSeedName,
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
            experience: 0,
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
      balance.minus(CROP_SEEDS()["Sunflower Seed"].tokenAmount as Decimal)
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
      balance.minus(CROP_SEEDS()[item].tokenAmount as Decimal)
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
      balance.minus(CROP_SEEDS()[item].tokenAmount?.mul(amount) as Decimal)
    );
    expect(state.inventory[item]).toEqual(oldAmount.add(amount));
  });

  it("throws an error if the player doesn't have a bumpkin", async () => {
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
      CROP_SEEDS()["Sunflower Seed"].tokenAmount?.toNumber()
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

  it("purchases seeds for free when Kuebiko is placed and ready", () => {
    const state = seedBought({
      state: {
        ...GAME_STATE,
        balance: new Decimal(1),
        inventory: {
          ...GAME_STATE.inventory,
          "Sunflower Seed": new Decimal(0),
        },
        collectibles: {
          Kuebiko: [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 1, y: 1 },
              // Ready at < now
              readyAt: dateNow - 5 * 60 * 1000,
            },
          ],
        },
      },
      action: {
        item: "Sunflower Seed",
        amount: 1,
        type: "seed.bought",
      },
    });

    expect(state.balance).toEqual(new Decimal(1));
    expect(state.inventory["Sunflower Seed"]).toEqual(new Decimal(1));
  });
  it("purchases sunflower seeds for free when Sunflower Shield is equipped", () => {
    const SHIELD_STATE: GameState = {
      ...TEST_FARM,
      bumpkin: {
        ...INITIAL_BUMPKIN,
        equipped: {
          ...INITIAL_BUMPKIN.equipped,
          secondaryTool: "Sunflower Shield",
        },
      },
    };

    const state = seedBought({
      state: {
        ...SHIELD_STATE,
        balance: new Decimal(1),
        inventory: {
          ...GAME_STATE.inventory,
          "Sunflower Seed": new Decimal(0),
        },
        collectibles: {},
      },
      action: {
        item: "Sunflower Seed",
        amount: 1,
        type: "seed.bought",
      },
    });

    expect(state.balance).toEqual(new Decimal(1));
    expect(state.inventory["Sunflower Seed"]).toEqual(new Decimal(1));
  });

  it("will not purchase seeds for free if Kuebiko is just in inventory", () => {
    const state = seedBought({
      state: {
        ...GAME_STATE,
        balance: new Decimal(1),
        inventory: {
          ...GAME_STATE.inventory,
          "Sunflower Seed": new Decimal(0),
          Kuebiko: new Decimal(1),
        },
      },
      action: {
        item: "Sunflower Seed",
        amount: 1,
        type: "seed.bought",
      },
    });

    expect(state.balance).not.toEqual(new Decimal(1));
  });

  it("mints a fruit seee", () => {
    const balance = new Decimal(1);
    const item = "Blueberry Seed";
    const amount = 1;
    const state = seedBought({
      state: {
        ...GAME_STATE,
        balance,
        bumpkin: {
          ...INITIAL_BUMPKIN,

          experience: 100000000,
        },
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

  it("purchases flower seeds for free when Hungry Caterpillar is placed and ready", () => {
    const state = seedBought({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...INITIAL_BUMPKIN,
          experience: 100000000,
        },
        balance: new Decimal(1),
        inventory: {
          ...GAME_STATE.inventory,
          "Sunflower Seed": new Decimal(0),
        },
        collectibles: {
          "Hungry Caterpillar": [
            {
              id: "123",
              createdAt: dateNow,
              coordinates: { x: 1, y: 1 },
              // Ready at < now
              readyAt: dateNow - 5 * 60 * 1000,
            },
          ],
        },
      },
      action: {
        item: "Lily Seed",
        amount: 1,
        type: "seed.bought",
      },
    });

    expect(state.balance).toEqual(new Decimal(1));
    expect(state.inventory["Lily Seed"]).toEqual(new Decimal(1));
  });
});
