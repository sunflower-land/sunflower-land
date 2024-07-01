import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { GARBAGE, GarbageName } from "features/game/types/garbage";
import { sellGarbage } from "./garbageSold";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  bumpkin: INITIAL_BUMPKIN,
};

describe("garbageSold", () => {
  it("throws an error is bumpkin is not present", () => {
    expect(() =>
      sellGarbage({
        state: {
          ...TEST_FARM,
          bumpkin: undefined,
        },
        action: {
          type: "garbage.sold",
          item: "Solar Flare Ticket",
          amount: 1,
        },
      }),
    ).toThrow("You do not have a Bumpkin");
  });

  it("does not sell a non treasure item", () => {
    expect(() =>
      sellGarbage({
        state: GAME_STATE,
        action: {
          type: "garbage.sold",
          item: "Sunflower" as GarbageName,
          amount: 1,
        },
      }),
    ).toThrow("Not for sale");
  });

  it("does not sell an unusual amount", () => {
    expect(() =>
      sellGarbage({
        state: {
          ...GAME_STATE,
          inventory: {
            "Solar Flare Ticket": new Decimal(5),
          },
        },
        action: {
          type: "garbage.sold",
          item: "Solar Flare Ticket",
          amount: 1.5,
        },
      }),
    ).toThrow("Invalid amount");
  });

  it("does not sell a missing item", () => {
    expect(() =>
      sellGarbage({
        state: GAME_STATE,
        action: {
          type: "garbage.sold",
          item: "Solar Flare Ticket",
          amount: 1,
        },
      }),
    ).toThrow("Insufficient quantity to sell");
  });

  it("sells a treasure", () => {
    const state = sellGarbage({
      state: {
        ...GAME_STATE,
        inventory: {
          "Solar Flare Ticket": new Decimal(5),
        },
      },
      action: {
        type: "garbage.sold",
        item: "Solar Flare Ticket",
        amount: 1,
      },
    });

    expect(state.inventory["Solar Flare Ticket"]).toEqual(new Decimal(4));
    expect(state.coins).toEqual(
      GAME_STATE.coins + GARBAGE["Solar Flare Ticket"].sellPrice,
    );
  });

  it("sell the treasure in bulk given sufficient quantity", () => {
    const state = sellGarbage({
      state: {
        ...GAME_STATE,
        inventory: {
          "Solar Flare Ticket": new Decimal(5),
        },
      },
      action: {
        type: "garbage.sold",
        item: "Solar Flare Ticket",
        amount: 4,
      },
    });

    expect(state.inventory["Solar Flare Ticket"]).toEqual(new Decimal(1));
    expect(state.coins).toEqual(
      GAME_STATE.coins + GARBAGE["Solar Flare Ticket"].sellPrice * 4,
    );
  });

  it("does not sell the treasure in bulk given insufficient quantity", () => {
    expect(() =>
      sellGarbage({
        state: {
          ...GAME_STATE,
          inventory: {
            "Solar Flare Ticket": new Decimal(1),
          },
        },
        action: {
          type: "garbage.sold",
          item: "Solar Flare Ticket",
          amount: 4,
        },
      }),
    ).toThrow("Insufficient quantity to sell");
  });

  it("increments the coins earned activity ", () => {
    const state = sellGarbage({
      state: {
        ...GAME_STATE,
        inventory: {
          "Solar Flare Ticket": new Decimal(5),
        },
      },
      action: {
        type: "garbage.sold",
        item: "Solar Flare Ticket",
        amount: 1,
      },
    });
    expect(state.bumpkin?.activity?.["Coins Earned"]).toEqual(
      GARBAGE["Solar Flare Ticket"].sellPrice,
    );
  });

  it("increments the treasure sold activity ", () => {
    const amount = 1;
    const state = sellGarbage({
      state: {
        ...GAME_STATE,
        inventory: {
          "Solar Flare Ticket": new Decimal(5),
        },
      },
      action: {
        type: "garbage.sold",
        item: "Solar Flare Ticket",
        amount,
      },
    });
    expect(state.bumpkin?.activity?.["Solar Flare Ticket Sold"]).toEqual(
      amount,
    );
  });
});
