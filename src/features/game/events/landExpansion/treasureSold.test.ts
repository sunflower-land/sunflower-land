import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import {
  BeachBountyTreasure,
  BEACH_BOUNTY_TREASURE,
} from "features/game/types/treasure";
import { sellTreasure } from "./treasureSold";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  bumpkin: INITIAL_BUMPKIN,
};

describe("treasureSold", () => {
  it("throws an error is bumpkin is not present", () => {
    expect(() =>
      sellTreasure({
        state: {
          ...TEST_FARM,
          bumpkin: undefined,
        },
        action: {
          type: "treasure.sold",
          item: "Clam Shell",
          amount: 1,
        },
      })
    ).toThrow("You do not have a Bumpkin");
  });

  it("does not sell a non treasure item", () => {
    expect(() =>
      sellTreasure({
        state: GAME_STATE,
        action: {
          type: "treasure.sold",
          item: "Sunflower" as BeachBountyTreasure,
          amount: 1,
        },
      })
    ).toThrow("Not for sale");
  });

  it("does not sell  an unusual amount", () => {
    expect(() =>
      sellTreasure({
        state: {
          ...GAME_STATE,
          inventory: {
            "Clam Shell": new Decimal(5),
          },
        },
        action: {
          type: "treasure.sold",
          item: "Clam Shell",
          amount: 1.5,
        },
      })
    ).toThrow("Invalid amount");
  });

  it("does not sell a missing item", () => {
    expect(() =>
      sellTreasure({
        state: GAME_STATE,
        action: {
          type: "treasure.sold",
          item: "Clam Shell",
          amount: 1,
        },
      })
    ).toThrow("Insufficient quantity to sell");
  });

  it("sells a treasure", () => {
    const state = sellTreasure({
      state: {
        ...GAME_STATE,
        inventory: {
          "Clam Shell": new Decimal(5),
        },
      },
      action: {
        type: "treasure.sold",
        item: "Clam Shell",
        amount: 1,
      },
    });

    expect(state.inventory["Clam Shell"]).toEqual(new Decimal(4));
    expect(state.balance).toEqual(
      GAME_STATE.balance.add(BEACH_BOUNTY_TREASURE["Clam Shell"].sellPrice ?? 0)
    );
  });

  it("sell the treasure in bulk given sufficient quantity", () => {
    const state = sellTreasure({
      state: {
        ...GAME_STATE,
        inventory: {
          "Clam Shell": new Decimal(5),
        },
      },
      action: {
        type: "treasure.sold",
        item: "Clam Shell",
        amount: 4,
      },
    });

    expect(state.inventory["Clam Shell"]).toEqual(new Decimal(1));
    expect(state.balance).toEqual(
      GAME_STATE.balance.add(
        (BEACH_BOUNTY_TREASURE["Clam Shell"].sellPrice ?? 0).mul(4)
      )
    );
  });

  it("does not sell the treasure in bulk given insufficient quantity", () => {
    expect(() =>
      sellTreasure({
        state: {
          ...GAME_STATE,
          inventory: {
            "Clam Shell": new Decimal(1),
          },
        },
        action: {
          type: "treasure.sold",
          item: "Clam Shell",
          amount: 4,
        },
      })
    ).toThrow("Insufficient quantity to sell");
  });

  it("increments the sfl earned activity ", () => {
    const state = sellTreasure({
      state: {
        ...GAME_STATE,
        inventory: {
          "Clam Shell": new Decimal(5),
        },
      },
      action: {
        type: "treasure.sold",
        item: "Clam Shell",
        amount: 1,
      },
    });
    expect(state.bumpkin?.activity?.["SFL Earned"]).toEqual(
      (BEACH_BOUNTY_TREASURE["Clam Shell"].sellPrice ?? 0).toNumber()
    );
  });

  it("increments the treasure sold activity ", () => {
    const amount = 1;
    const state = sellTreasure({
      state: {
        ...GAME_STATE,
        inventory: {
          "Clam Shell": new Decimal(5),
        },
      },
      action: {
        type: "treasure.sold",
        item: "Clam Shell",
        amount,
      },
    });
    expect(state.bumpkin?.activity?.["Clam Shell Sold"]).toEqual(amount);
  });
});
