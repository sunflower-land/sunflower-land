import {
  buyResetSkill,
  ResetItem,
} from "features/game/events/landExpansion/buyResetSkills";
import { TEST_FARM } from "features/game/lib/constants";
import Decimal from "decimal.js-light";

describe("buyResetSkill", () => {
  it("Does not reset skills without sufficient balance", () => {
    expect(() =>
      buyResetSkill({
        state: {
          ...TEST_FARM,
          balance: new Decimal(0),
        },
        action: {
          type: "reset.skill",
          sfl: new Decimal(100),
        },
      })
    ).toThrow("Insufficient tokens");
  });

  it("Burns the SFL on purchase", () => {
    const state = buyResetSkill({
      state: {
        ...TEST_FARM,
        balance: new Decimal(150),
      },
      action: {
        type: "reset.skill",
        sfl: new Decimal(100),
      },
    });

    console.log("State Balance" + state.balance);

    expect(ResetItem.sfl?.toNumber()).toEqual(
      state.bumpkin?.activity?.["SFL Spent"]
    );
  });

  it("throws an error if the player doesnt have a bumpkin", async () => {
    expect(() =>
      buyResetSkill({
        state: {
          ...TEST_FARM,
          bumpkin: undefined,
        },
        action: {
          type: "reset.skill",
          sfl: new Decimal(100),
        },
      })
    ).toThrow("Bumpkin not found");
  });
});
