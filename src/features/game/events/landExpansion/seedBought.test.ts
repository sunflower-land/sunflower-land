import Decimal from "decimal.js-light";

import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { PLOT_CROP_SEEDS, PlotCropSeedName } from "features/game/types/crops";
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
          item: "Goblin Key" as PlotCropSeedName,
          amount: 1,
        },
      }),
    ).toThrow("This item is not a seed");
  });

  it("does not buy seed if required level is not reached", () => {
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
      }),
    ).toThrow("Inadequate level");
  });

  it("does not buy a seed with an unusual amount", () => {
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
      }),
    ).toThrow("Invalid amount");
  });

  it("does not buy a seed that is not in stock", () => {
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
      }),
    ).toThrow("Not enough stock");
  });

  it("does not buy a seed if there is not enough funds", () => {
    expect(() =>
      seedBought({
        state: {
          ...GAME_STATE,
          coins: 0,
        },
        action: {
          type: "seed.bought",
          item: "Sunflower Seed",
          amount: 1,
        },
      }),
    ).toThrow("Insufficient tokens");
  });

  it("subtracts the coins on purchase", () => {
    const coins = 1;
    const balance = new Decimal(1);
    const state = seedBought({
      state: {
        ...GAME_STATE,
        balance,
        coins,
      },
      action: {
        type: "seed.bought",
        item: "Sunflower Seed",
        amount: 1,
      },
    });

    expect(state.balance).toEqual(balance);
    expect(state.coins).toEqual(coins - PLOT_CROP_SEEDS["Sunflower Seed"].price);
  });

  it("adds the newly bought seed to a players inventory", () => {
    const coins = 1;
    const item = "Sunflower Seed";
    const amount = 1;
    const state = seedBought({
      state: {
        ...GAME_STATE,
        coins,
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
    const coins = 1;
    const item = "Pumpkin Seed";
    const amount = 1;
    const state = seedBought({
      state: {
        ...GAME_STATE,
        coins,
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

    expect(state.coins).toEqual(coins - PLOT_CROP_SEEDS[item].price);
    expect(state.inventory[item]).toEqual(oldAmount.add(amount));
  });

  it("buys seed in bulk given sufficient balance", () => {
    const coins = 100;
    const item = "Pumpkin Seed";
    const amount = 10;
    const state = seedBought({
      state: {
        ...GAME_STATE,
        coins,
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

    expect(state.coins).toEqual(coins - PLOT_CROP_SEEDS[item].price * amount);
    expect(state.inventory[item]).toEqual(oldAmount.add(amount));
  });

  it("increments the coin spent activity ", () => {
    const state = seedBought({
      state: {
        ...GAME_STATE,
        coins: 1,
      },
      action: {
        type: "seed.bought",
        item: "Sunflower Seed",
        amount: 1,
      },
    });
    expect(state.bumpkin?.activity?.["Coins Spent"]).toEqual(
      PLOT_CROP_SEEDS["Sunflower Seed"].price,
    );
  });

  it("increments the seed bought activity ", () => {
    const amount = 1;
    const state = seedBought({
      state: {
        ...GAME_STATE,
        coins: 1,
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
        coins: 1,
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

    expect(state.coins).toEqual(1);
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
        coins: 1,
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

    expect(state.coins).toEqual(1);
    expect(state.inventory["Sunflower Seed"]).toEqual(new Decimal(1));
  });

  it("will not purchase seeds for free if Kuebiko is just in inventory", () => {
    const state = seedBought({
      state: {
        ...GAME_STATE,
        coins: 1,
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

    expect(state.coins).not.toEqual(1);
  });

  it("buys a fruit seed", () => {
    const coins = 100;
    const item = "Blueberry Seed";
    const amount = 1;
    const state = seedBought({
      state: {
        ...GAME_STATE,
        coins,
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
        coins: 100,
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
        island: {
          type: "spring",
        },
      },
      action: {
        item: "Lily Seed",
        amount: 1,
        type: "seed.bought",
      },
    });

    expect(state.coins).toEqual(100);
    expect(state.inventory["Lily Seed"]).toEqual(new Decimal(1));
  });

  it("requires Flower Bed to buy a flower seed", () => {
    expect(() =>
      seedBought({
        state: {
          ...GAME_STATE,
          bumpkin: { ...INITIAL_BUMPKIN, experience: 100000000 },
          coins: Infinity,
          inventory: {
            "Flower Bed": new Decimal(0),
          },
        },
        action: {
          type: "seed.bought",
          item: "Lily Seed",
          amount: 1,
        },
      }),
    ).toThrow("You do not have the planting spot needed to plant this seed");

    expect(() =>
      seedBought({
        state: {
          ...GAME_STATE,
          bumpkin: { ...INITIAL_BUMPKIN, experience: 100000000 },
          coins: Infinity,
          inventory: {
            "Flower Bed": new Decimal(1),
          },
        },
        action: {
          type: "seed.bought",
          item: "Lily Seed",
          amount: 1,
        },
      }),
    ).not.toThrow();
  });

  it("requires Greenhouse to buy a greenhouse crop seed", () => {
    expect(() =>
      seedBought({
        state: {
          ...GAME_STATE,
          bumpkin: { ...INITIAL_BUMPKIN, experience: 100000000 },
          coins: Infinity,
          inventory: {
            Greenhouse: new Decimal(0),
          },
        },
        action: {
          type: "seed.bought",
          item: "Rice Seed",
          amount: 1,
        },
      }),
    ).toThrow("You do not have the planting spot needed to plant this seed");

    expect(() =>
      seedBought({
        state: {
          ...GAME_STATE,
          bumpkin: { ...INITIAL_BUMPKIN, experience: 100000000 },
          coins: Infinity,
          inventory: {
            Greenhouse: new Decimal(1),
          },
        },
        action: {
          type: "seed.bought",
          item: "Rice Seed",
          amount: 1,
        },
      }),
    ).not.toThrow();
  });

  it("requires Greenhouse to buy a greenhouse fruit seed", () => {
    expect(() =>
      seedBought({
        state: {
          ...GAME_STATE,
          bumpkin: { ...INITIAL_BUMPKIN, experience: 100000000 },
          coins: Infinity,
          inventory: {
            Greenhouse: new Decimal(0),
          },
        },
        action: {
          type: "seed.bought",
          item: "Grape Seed",
          amount: 1,
        },
      }),
    ).toThrow("You do not have the planting spot needed to plant this seed");

    expect(() =>
      seedBought({
        state: {
          ...GAME_STATE,
          bumpkin: { ...INITIAL_BUMPKIN, experience: 100000000 },
          inventory: {
            Greenhouse: new Decimal(1),
          },
          coins: Infinity,
        },
        action: {
          type: "seed.bought",
          item: "Grape Seed",
          amount: 1,
        },
      }),
    ).not.toThrow();
  });
  it("requires Fruit Patch to buy a fruit seed", () => {
    expect(() =>
      seedBought({
        state: {
          ...GAME_STATE,
          bumpkin: { ...INITIAL_BUMPKIN, experience: 100000000 },
          coins: Infinity,
          inventory: {
            "Fruit Patch": new Decimal(0),
          },
        },
        action: {
          type: "seed.bought",
          item: "Apple Seed",
          amount: 1,
        },
      }),
    ).toThrow("You do not have the planting spot needed to plant this seed");

    expect(() =>
      seedBought({
        state: {
          ...GAME_STATE,
          bumpkin: { ...INITIAL_BUMPKIN, experience: 100000000 },
          coins: Infinity,
          inventory: {
            "Fruit Patch": new Decimal(1),
          },
        },
        action: {
          type: "seed.bought",
          item: "Apple Seed",
          amount: 1,
        },
      }),
    ).not.toThrow();
  });
  it("requires Fruit Patch to buy a fruit seed", () => {
    expect(() =>
      seedBought({
        state: {
          ...GAME_STATE,
          bumpkin: { ...INITIAL_BUMPKIN, experience: 100000000 },
          coins: Infinity,
          inventory: {
            "Fruit Patch": new Decimal(0),
          },
        },
        action: {
          type: "seed.bought",
          item: "Apple Seed",
          amount: 1,
        },
      }),
    ).toThrow("You do not have the planting spot needed to plant this seed");

    expect(() =>
      seedBought({
        state: {
          ...GAME_STATE,
          bumpkin: { ...INITIAL_BUMPKIN, experience: 100000000 },
          coins: Infinity,
          inventory: {
            "Fruit Patch": new Decimal(1),
          },
        },
        action: {
          type: "seed.bought",
          item: "Apple Seed",
          amount: 1,
        },
      }),
    ).not.toThrow();
  });
});
