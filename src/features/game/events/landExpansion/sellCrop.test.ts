import Decimal from "decimal.js-light";
import { GameState } from "../../types/game";
import { CropName, PLOT_CROPS } from "../../types/crops";
import { sellCrop } from "./sellCrop";
import { INITIAL_BUMPKIN, TEST_FARM } from "../../lib/constants";
import { PATCH_FRUIT } from "features/game/types/fruits";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  bumpkin: INITIAL_BUMPKIN,
  balance: new Decimal(0),
  inventory: {},
  createdAt: new Date("2023-04-04").getTime(),
};

describe("sell", () => {
  it("does not sell a non sellable item", () => {
    expect(() =>
      sellCrop({
        state: GAME_STATE,
        action: {
          type: "crop.sold",
          crop: "Axe" as CropName,
          amount: 1,
        },
      }),
    ).toThrow("Not for sale");
  });

  it("does not sell an unusual amount", () => {
    expect(() =>
      sellCrop({
        state: {
          ...GAME_STATE,
          inventory: {
            Sunflower: new Decimal(5),
          },
        },
        action: {
          type: "crop.sold",
          crop: "Sunflower",
          amount: 0,
        },
      }),
    ).toThrow("Invalid amount");
  });

  it("does not sell an item that the player doesn't have", () => {
    expect(() =>
      sellCrop({
        state: GAME_STATE,
        action: {
          type: "crop.sold",
          crop: "Sunflower",
          amount: 1,
        },
      }),
    ).toThrow("Insufficient quantity to sell");
  });

  it("sells an item", () => {
    const state = sellCrop({
      state: {
        ...GAME_STATE,
        inventory: {
          Sunflower: new Decimal(5),
          "Basic Land": new Decimal(5),
        },
      },
      action: {
        type: "crop.sold",
        crop: "Sunflower",
        amount: 1,
      },
    });

    expect(state.inventory.Sunflower).toEqual(new Decimal(4));
    expect(state.coins).toEqual(GAME_STATE.coins + PLOT_CROPS.Sunflower.sellPrice);
  });

  it("sell an item in bulk given sufficient quantity", () => {
    const state = sellCrop({
      state: {
        ...GAME_STATE,
        inventory: {
          Sunflower: new Decimal(11),
          "Basic Land": new Decimal(10),
        },
      },
      action: {
        type: "crop.sold",
        crop: "Sunflower",
        amount: 10,
      },
    });

    expect(state.inventory.Sunflower).toEqual(new Decimal(1));
    expect(state.coins).toEqual(
      GAME_STATE.coins + PLOT_CROPS.Sunflower.sellPrice * 10,
    );
  });

  it("does not sell an item in bulk if the player does not have enough", () => {
    expect(() =>
      sellCrop({
        state: {
          ...GAME_STATE,
          inventory: {
            Sunflower: new Decimal(2),
          },
        },
        action: {
          type: "crop.sold",
          crop: "Sunflower",
          amount: 10,
        },
      }),
    ).toThrow("Insufficient quantity to sell");
  });

  it("sells a cauliflower for a normal price", () => {
    const state = sellCrop({
      state: {
        ...GAME_STATE,
        coins: 0,
        inventory: {
          Cauliflower: new Decimal(1),
        },
      },
      action: {
        type: "crop.sold",
        crop: "Cauliflower",
        amount: 1,
      },
    });

    expect(state.coins).toEqual(PLOT_CROPS.Cauliflower.sellPrice);
  });

  it("increments coins earned when cauliflower is sold", () => {
    const state = sellCrop({
      state: {
        ...GAME_STATE,
        inventory: {
          Cauliflower: new Decimal(1),
        },
      },
      action: {
        type: "crop.sold",
        crop: "Cauliflower",
        amount: 1,
      },
    });

    expect(state.bumpkin?.activity?.["Coins Earned"]).toEqual(
      PLOT_CROPS.Cauliflower.sellPrice,
    );
  });

  it("sells an apple for a normal price", () => {
    const state = sellCrop({
      state: {
        ...GAME_STATE,
        inventory: {
          Apple: new Decimal(1),
        },
      },
      action: {
        type: "crop.sold",
        crop: "Apple",
        amount: 1,
      },
    });

    expect(state.coins).toEqual(PATCH_FRUIT().Apple.sellPrice);
  });

  it("increments the crop sold activity ", () => {
    const amount = 1;
    const state = sellCrop({
      state: {
        ...GAME_STATE,
        inventory: {
          Apple: new Decimal(1),
        },
      },
      action: {
        type: "crop.sold",
        crop: "Apple",
        amount,
      },
    });
    expect(state.bumpkin?.activity?.["Apple Sold"]).toEqual(amount);
  });

  it("sells tomato for two times the normal price during La Tomatina", () => {
    const now = new Date().getTime();

    const coins = 1;
    const state = sellCrop({
      state: {
        ...GAME_STATE,
        coins,
        inventory: {
          Tomato: new Decimal(1),
        },
        specialEvents: {
          current: {
            "La Tomatina": {
              text: "La Tomatina",
              endAt: now + 1000,
              startAt: now,
              isEligible: true,
              requiresWallet: false,
              tasks: [],
              bonus: {
                Tomato: {
                  saleMultiplier: 2,
                },
              },
            },
          },
          history: {},
        },
        createdAt: now,
      },
      action: {
        type: "crop.sold",
        crop: "Tomato",
        amount: 1,
      },
    });

    expect(state.coins).toEqual(coins + PATCH_FRUIT().Tomato.sellPrice * 2);
  });

  it("add 10% more profit on crops sell if the player has Coin Swindler skill", () => {
    const coins = 1;
    const state = sellCrop({
      state: {
        ...GAME_STATE,
        coins,
        inventory: {
          Sunflower: new Decimal(1),
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: {
            "Coin Swindler": 1,
          },
        },
      },
      action: {
        type: "crop.sold",
        crop: "Sunflower",
        amount: 1,
      },
    });

    expect(state.coins).toEqual(coins + PLOT_CROPS.Sunflower.sellPrice * 1.1);
  });

  it("does not add 10% more profit if it is not a crop", () => {
    const coins = 1;
    const state = sellCrop({
      state: {
        ...GAME_STATE,
        coins,
        inventory: {
          Tomato: new Decimal(1),
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: {
            "Coin Swindler": 1,
          },
        },
      },
      action: {
        type: "crop.sold",
        crop: "Tomato",
        amount: 1,
      },
    });

    expect(state.coins).toEqual(coins + PATCH_FRUIT().Tomato.sellPrice);
  });

  it("does not add 10% more profit if the player does not have Coin Swindler skill", () => {
    const coins = 1;
    const state = sellCrop({
      state: {
        ...GAME_STATE,
        coins,
        inventory: {
          Sunflower: new Decimal(1),
        },
        bumpkin: {
          ...INITIAL_BUMPKIN,
          skills: {},
        },
      },
      action: {
        type: "crop.sold",
        crop: "Sunflower",
        amount: 1,
      },
    });

    expect(state.coins).toEqual(coins + PLOT_CROPS.Sunflower.sellPrice);
  });
});
