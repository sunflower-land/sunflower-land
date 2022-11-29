import Decimal from "decimal.js-light";

import { TEST_FARM } from "features/game/lib/constants";
import { BeanName, BEANS } from "features/game/types/beans";
import { GameState } from "features/game/types/game";

import { beanBought } from "./buyBean";

const GAME_STATE: GameState = TEST_FARM;

describe("beanBought", () => {
  const dateNow = Date.now();

  it("throws an error if item is not a bean", () => {
    expect(() =>
      beanBought({
        state: GAME_STATE,
        action: {
          type: "bean.bought",
          bean: "Goblin Key" as BeanName,
        },
      })
    ).toThrow("This item is not a bean");
  });

  it("does not craft an item that is not in stock", () => {
    expect(() =>
      beanBought({
        state: {
          ...GAME_STATE,
          stock: {
            "Magic Bean": new Decimal(0),
          },
        },
        action: {
          type: "bean.bought",
          bean: "Magic Bean",
        },
      })
    ).toThrow("Not enough stock");
  });

  it("does not craft seed if there is not enough funds", () => {
    expect(() =>
      beanBought({
        state: {
          ...GAME_STATE,
          balance: new Decimal(0),
        },
        action: {
          type: "bean.bought",
          bean: "Magic Bean",
        },
      })
    ).toThrow("Insufficient SFL");
  });

  it("does not craft seed if there is not enough ingredients", () => {
    expect(() =>
      beanBought({
        state: {
          ...GAME_STATE,
          balance: new Decimal(100),
        },
        action: {
          type: "bean.bought",
          bean: "Magic Bean",
        },
      })
    ).toThrow("Insufficient Wood");
  });

  it("burns the SFL on purchase", () => {
    const balance = new Decimal(1);
    const state = beanBought({
      state: {
        ...GAME_STATE,
        inventory: {
          Wood: new Decimal(500),
          Stone: new Decimal(500),
        },
        balance,
      },
      action: {
        type: "bean.bought",
        bean: "Magic Bean",
      },
    });

    expect(state.balance).toEqual(
      balance.minus(BEANS()["Magic Bean"].sfl as Decimal)
    );
  });

  it("burns the ingredients on purchase", () => {
    const balance = new Decimal(1);
    const state = beanBought({
      state: {
        ...GAME_STATE,
        inventory: {
          Wood: new Decimal(500),
          Stone: new Decimal(500),
        },
        balance,
      },
      action: {
        type: "bean.bought",
        bean: "Magic Bean",
      },
    });

    expect(state.balance).toEqual(
      balance.minus(BEANS()["Magic Bean"].sfl as Decimal)
    );

    expect(state.inventory.Wood).toEqual(new Decimal(470));
  });

  it("mints the newly bought bean", () => {
    const balance = new Decimal(1);
    const bean = "Magic Bean";
    const amount = 1;
    const state = beanBought({
      state: {
        ...GAME_STATE,
        balance,
        inventory: {
          Wood: new Decimal(500),
          Stone: new Decimal(500),
        },
      },
      action: {
        bean,
        type: "bean.bought",
      },
    });

    const oldAmount = GAME_STATE.inventory[bean] ?? new Decimal(0);

    expect(state.inventory[bean]).toEqual(oldAmount.add(amount));
  });

  it("decrease the stock on purchase", () => {
    const balance = new Decimal(1);
    const bean = "Magic Bean";
    const amount = 1;
    const state = beanBought({
      state: {
        ...GAME_STATE,
        balance,
        inventory: {
          Wood: new Decimal(500),
          Stone: new Decimal(500),
        },
      },
      action: {
        bean,
        type: "bean.bought",
      },
    });

    const oldStock = GAME_STATE.stock[bean] ?? new Decimal(0);

    expect(state.stock[bean]).toEqual(oldStock.minus(amount));
  });

  it("increments the sfl spent activity ", () => {
    const state = beanBought({
      state: {
        ...GAME_STATE,
        balance: new Decimal(1),
        inventory: {
          Wood: new Decimal(500),
          Stone: new Decimal(500),
        },
      },
      action: {
        type: "bean.bought",
        bean: "Magic Bean",
      },
    });
    expect(state.bumpkin?.activity?.["SFL Spent"]).toEqual(
      BEANS()["Magic Bean"].sfl?.toNumber()
    );
  });

  it("increments the bean bought activity ", () => {
    const amount = 1;
    const state = beanBought({
      state: {
        ...GAME_STATE,
        balance: new Decimal(1),
        inventory: {
          Wood: new Decimal(500),
          Stone: new Decimal(500),
        },
      },
      action: {
        type: "bean.bought",
        bean: "Magic Bean",
      },
    });
    expect(state.bumpkin?.activity?.["Magic Bean Bought"]).toEqual(amount);
  });
});
