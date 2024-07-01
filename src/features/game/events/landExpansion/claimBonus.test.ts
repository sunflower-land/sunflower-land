import Decimal from "decimal.js-light";
import { claimBonus } from "./claimBonus";
import { TEST_FARM } from "features/game/lib/constants";
import { BonusName } from "features/game/types/bonuses";

describe("claimBonus", () => {
  const dateNow = Date.now();

  it("throws if no bonus is available", () => {
    expect(() =>
      claimBonus({
        state: {
          ...TEST_FARM,
          airdrops: [],
        },
        action: {
          type: "bonus.claimed",
          name: "no-existent" as BonusName,
        },
        createdAt: dateNow,
      }),
    ).toThrow("No bonus exist");
  });

  it("does not claim a bonus that is already claimed", () => {
    expect(() =>
      claimBonus({
        state: {
          ...TEST_FARM,
          inventory: {},
          wardrobe: {
            "Companion Cap": 1,
          },
        },
        action: {
          type: "bonus.claimed",
          name: "discord-signup",
        },
        createdAt: dateNow,
      }),
    ).toThrow("Bonus already claimed");
  });

  it("claims the bonus", () => {
    const state = claimBonus({
      state: {
        ...TEST_FARM,
        inventory: {},
      },
      action: {
        type: "bonus.claimed",
        name: "discord-signup",
      },
      createdAt: dateNow,
    });

    expect(state.inventory).toEqual({
      Axe: new Decimal(5),
      "Community Coin": new Decimal(1),
    });

    expect(state.wardrobe["Companion Cap"]).toEqual(1);
  });
});
