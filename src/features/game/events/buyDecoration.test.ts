import Decimal from "decimal.js-light";
import { TEST_FARM } from "../lib/constants";
import { DecorationName, DECORATIONS } from "../types/decorations";
import { GameState } from "../types/game";
import { buyDecoration } from "./buyDecoration";

const GAME_STATE: GameState = TEST_FARM;

describe("buyDecoration", () => {
  it("throws an error if item is not a decoration", () => {
    expect(() =>
      buyDecoration({
        state: GAME_STATE,
        action: {
          type: "decoration.bought",
          item: "Goblin Key" as DecorationName,
        },
      })
    ).toThrow("This item is not a decoration");
  });

  it("does not craft decoration if there is not enough funds", () => {
    expect(() =>
      buyDecoration({
        state: {
          ...GAME_STATE,
          balance: new Decimal(0),
        },
        action: {
          type: "decoration.bought",
          item: "Potted Sunflower",
        },
      })
    ).toThrow("Insufficient tokens");
  });

  it("does not craft decoration if requirments are not met", () => {
    expect(() =>
      buyDecoration({
        state: {
          ...GAME_STATE,
          balance: new Decimal(100),
          inventory: {},
        },
        action: {
          type: "decoration.bought",
          item: "Potted Sunflower",
        },
      })
    ).toThrow("Insufficient ingredient: Sunflower");
  });

  it("burns the SFL on purchase", () => {
    const balance = new Decimal(140);
    const state = buyDecoration({
      state: {
        ...GAME_STATE,
        balance,
        inventory: {
          Sunflower: new Decimal(150),
        },
      },
      action: {
        type: "decoration.bought",
        item: "Potted Sunflower",
      },
    });

    expect(state.balance).toEqual(
      balance.minus(DECORATIONS()["Potted Sunflower"].sfl as Decimal)
    );
  });

  it("mints the newly bought decoration", () => {
    const balance = new Decimal(150);
    const item = "Potted Sunflower";
    const state = buyDecoration({
      state: {
        ...GAME_STATE,
        balance,
        inventory: {
          Sunflower: new Decimal(150),
        },
      },
      action: {
        item,
        type: "decoration.bought",
      },
    });

    const oldAmount = GAME_STATE.inventory[item] ?? new Decimal(0);

    expect(state.inventory[item]).toEqual(oldAmount.add(1));
  });

  it("throws an error if the player doesnt have a bumpkin", async () => {
    expect(() =>
      buyDecoration({
        state: {
          ...GAME_STATE,
          bumpkin: undefined,
        },
        action: {
          type: "decoration.bought",
          item: "Potted Sunflower",
        },
      })
    ).toThrow("Bumpkin not found");
  });

  it("increments the sfl spent activity ", () => {
    const state = buyDecoration({
      state: {
        ...GAME_STATE,
        balance: new Decimal(150),
        inventory: {
          Sunflower: new Decimal(150),
        },
      },
      action: {
        type: "decoration.bought",
        item: "Potted Sunflower",
      },
    });
    expect(state.bumpkin?.activity?.["SFL Spent"]).toEqual(
      DECORATIONS()["Potted Sunflower"].sfl?.toNumber()
    );
  });

  it("increments the decoration bought activity ", () => {
    const state = buyDecoration({
      state: {
        ...GAME_STATE,
        balance: new Decimal(1),
        inventory: {
          Sunflower: new Decimal(150),
        },
      },
      action: {
        type: "decoration.bought",
        item: "Potted Sunflower",
      },
    });
    expect(state.bumpkin?.activity?.["Potted Sunflower Bought"]).toEqual(1);
  });
});
