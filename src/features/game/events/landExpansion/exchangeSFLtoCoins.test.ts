import Decimal from "decimal.js-light";
import { PackageId, exchangeSFLtoCoins } from "./exchangeSFLtoCoins";
import { TEST_FARM } from "features/game/lib/constants";

describe("exchangeSFLtoCoins", () => {
  it("throws if you don't have a bumpkin", () => {
    expect(() =>
      exchangeSFLtoCoins({
        state: { ...TEST_FARM, bumpkin: undefined },
        action: { type: "sfl.exchanged", packageId: 1 },
      }),
    ).toThrow("You do not have a Bumpkin");
  });

  it("throws if the packageId is invalid", () => {
    expect(() =>
      exchangeSFLtoCoins({
        state: {
          ...TEST_FARM,
          balance: new Decimal(1),
        },
        action: { type: "sfl.exchanged", packageId: 4 as PackageId },
      }),
    ).toThrow("Invalid packageId");
  });

  it("throws if the player does not have enough sfl", () => {
    expect(() =>
      exchangeSFLtoCoins({
        state: {
          ...TEST_FARM,
          balance: new Decimal(0),
        },
        action: { type: "sfl.exchanged", packageId: 1 },
      }),
    ).toThrow("Not enough SFL");
  });

  it("exchanges 1 sfl for 160 coins", () => {
    const state = exchangeSFLtoCoins({
      state: {
        ...TEST_FARM,
        balance: new Decimal(1),
      },
      action: { type: "sfl.exchanged", packageId: 1 },
    });

    expect(state.balance).toEqual(new Decimal(0));
    expect(state.coins).toEqual(160);
  });

  it("exchanges 30 sfl for 8640 coins", () => {
    const state = exchangeSFLtoCoins({
      state: {
        ...TEST_FARM,
        balance: new Decimal(30),
      },
      action: { type: "sfl.exchanged", packageId: 2 },
    });

    expect(state.balance).toEqual(new Decimal(0));
    expect(state.coins).toEqual(8640);
  });

  it("exchanges 200 sfl for 64000 coins", () => {
    const state = exchangeSFLtoCoins({
      state: {
        ...TEST_FARM,
        balance: new Decimal(200),
      },
      action: { type: "sfl.exchanged", packageId: 3 },
    });

    expect(state.balance).toEqual(new Decimal(0));
    expect(state.coins).toEqual(64000);
  });
});
