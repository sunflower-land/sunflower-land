import Decimal from "decimal.js-light";
import { ClutterName } from "features/game/types/clutter";
import { GameState } from "features/game/types/game";
import { INITIAL_FARM } from "features/game/lib/constants";
import { burnClutter } from "./burnClutter";

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
};

describe("burnClutter", () => {
  it("does not burn a non-clutter item", () => {
    expect(() =>
      burnClutter({
        state: GAME_STATE,
        action: {
          type: "clutter.burned",
          item: "Sunflower" as ClutterName,
          amount: 1,
        },
      }),
    ).toThrow("Can't be thrown into the incinerator");
  });

  it("does not burn an unusual amount", () => {
    expect(() =>
      burnClutter({
        state: {
          ...GAME_STATE,
          inventory: {
            Trash: new Decimal(10),
          },
        },
        action: {
          type: "clutter.burned",
          item: "Trash",
          amount: 1.5,
        },
      }),
    ).toThrow("Invalid amount");
  });

  it("does not burn an amount that doesn't match the sell unit", () => {
    expect(() =>
      burnClutter({
        state: {
          ...GAME_STATE,
          inventory: {
            Trash: new Decimal(10),
          },
        },
        action: {
          type: "clutter.burned",
          item: "Trash",
          amount: 7, // Not divisible by sellUnit (10)
        },
      }),
    ).toThrow("Invalid amount");
  });

  it("does not burn a missing item", () => {
    expect(() =>
      burnClutter({
        state: GAME_STATE,
        action: {
          type: "clutter.burned",
          item: "Trash",
          amount: 10,
        },
      }),
    ).toThrow("Item not in inventory");
  });

  it("does not burn insufficient quantity", () => {
    expect(() =>
      burnClutter({
        state: {
          ...GAME_STATE,
          inventory: {
            Trash: new Decimal(5),
          },
        },
        action: {
          type: "clutter.burned",
          item: "Trash",
          amount: 10,
        },
      }),
    ).toThrow("Insufficient quantity to burn");
  });

  it("burns trash and gives cheer", () => {
    const state = burnClutter({
      state: {
        ...GAME_STATE,
        inventory: {
          Trash: new Decimal(20),
        },
      },
      action: {
        type: "clutter.burned",
        item: "Trash",
        amount: 10,
      },
    });

    expect(state.inventory["Trash"]).toEqual(new Decimal(10));
    expect(state.inventory["Cheer"]).toEqual(new Decimal(1));
  });

  it("burns dung and gives cheer", () => {
    const state = burnClutter({
      state: {
        ...GAME_STATE,
        inventory: {
          Dung: new Decimal(60),
        },
      },
      action: {
        type: "clutter.burned",
        item: "Dung",
        amount: 30,
      },
    });

    expect(state.inventory["Dung"]).toEqual(new Decimal(30));
    expect(state.inventory["Cheer"]).toEqual(new Decimal(1));
  });

  it("burns weed and gives cheer", () => {
    const state = burnClutter({
      state: {
        ...GAME_STATE,
        inventory: {
          Weed: new Decimal(10),
        },
      },
      action: {
        type: "clutter.burned",
        item: "Weed",
        amount: 5,
      },
    });

    expect(state.inventory["Weed"]).toEqual(new Decimal(5));
    expect(state.inventory["Cheer"]).toEqual(new Decimal(1));
  });

  it("burns pests and gives cheer", () => {
    const state = burnClutter({
      state: {
        ...GAME_STATE,
        inventory: {
          Rat: new Decimal(3),
        },
      },
      action: {
        type: "clutter.burned",
        item: "Rat",
        amount: 2,
      },
    });

    expect(state.inventory["Rat"]).toEqual(new Decimal(1));
    expect(state.inventory["Cheer"]).toEqual(new Decimal(2));
  });

  it("burns clutter in bulk given sufficient quantity", () => {
    const state = burnClutter({
      state: {
        ...GAME_STATE,
        inventory: {
          Trash: new Decimal(50),
        },
      },
      action: {
        type: "clutter.burned",
        item: "Trash",
        amount: 40,
      },
    });

    expect(state.inventory["Trash"]).toEqual(new Decimal(10));
    expect(state.inventory["Cheer"]).toEqual(new Decimal(4));
  });

  it("does not burn clutter in bulk given insufficient quantity", () => {
    expect(() =>
      burnClutter({
        state: {
          ...GAME_STATE,
          inventory: {
            Trash: new Decimal(10),
          },
        },
        action: {
          type: "clutter.burned",
          item: "Trash",
          amount: 40,
        },
      }),
    ).toThrow("Insufficient quantity to burn");
  });

  it("accumulates cheer when burning multiple times", () => {
    const state = burnClutter({
      state: {
        ...GAME_STATE,
        inventory: {
          Trash: new Decimal(30),
          Cheer: new Decimal(2),
        },
      },
      action: {
        type: "clutter.burned",
        item: "Trash",
        amount: 20,
      },
    });

    expect(state.inventory["Trash"]).toEqual(new Decimal(10));
    expect(state.inventory["Cheer"]).toEqual(new Decimal(4));
  });

  it("handles zero cheer in inventory", () => {
    const state = burnClutter({
      state: {
        ...GAME_STATE,
        inventory: {
          Trash: new Decimal(10),
        },
      },
      action: {
        type: "clutter.burned",
        item: "Trash",
        amount: 10,
      },
    });

    expect(state.inventory["Trash"]).toEqual(new Decimal(0));
    expect(state.inventory["Cheer"]).toEqual(new Decimal(1));
  });
});
