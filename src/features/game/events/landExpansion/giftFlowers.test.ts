import { TEST_FARM } from "features/game/lib/constants";
import { giftFlowers } from "./giftFlowers";
import Decimal from "decimal.js-light";

describe("giftBumpkin", () => {
  it("requires gift is a flower", () => {
    expect(() =>
      giftFlowers({
        state: TEST_FARM,
        action: {
          flower: "Wood" as any,
          type: "flowers.gifted",
          bumpkin: "betty",
        },
      })
    ).toThrow("Item is not a flower");
  });

  it("requires player has flower", () => {
    expect(() =>
      giftFlowers({
        state: TEST_FARM,
        action: {
          flower: "Celestial Frostbloom",
          type: "flowers.gifted",
          bumpkin: "betty",
        },
      })
    ).toThrow("Player is missing flower");
  });

  it("ensures bumpkin accepts gifts", () => {
    expect(() =>
      giftFlowers({
        state: TEST_FARM,
        action: {
          flower: "Celestial Frostbloom",
          type: "flowers.gifted",
          bumpkin: "craig",
        },
      })
    ).toThrow("Bumpkin does not accept gifts");
  });

  it("subtracts flower", () => {
    const state = giftFlowers({
      state: {
        ...TEST_FARM,
        inventory: {
          "Celestial Frostbloom": new Decimal(2),
        },
      },
      action: {
        flower: "Celestial Frostbloom",
        type: "flowers.gifted",
        bumpkin: "betty",
      },
    });

    expect(state.inventory["Celestial Frostbloom"]).toEqual(new Decimal(1));
  });

  it("gives a small friendship bonus for a flower not on their list", () => {
    const state = giftFlowers({
      state: {
        ...TEST_FARM,
        inventory: {
          "Celestial Frostbloom": new Decimal(2),
        },
      },
      action: {
        flower: "Celestial Frostbloom",
        type: "flowers.gifted",
        bumpkin: "betty",
      },
    });

    expect(state.npcs?.betty?.friendship?.points).toEqual(1);
  });

  it("gives a medium friendship bonus for average flower", () => {
    const state = giftFlowers({
      state: {
        ...TEST_FARM,
        inventory: {
          "White Cosmos": new Decimal(1),
        },
      },
      action: {
        flower: "White Cosmos",
        type: "flowers.gifted",
        bumpkin: "betty",
      },
    });

    expect(state.npcs?.betty?.friendship?.points).toEqual(3);
  });
  it("gives a large friendship bonus for good flower", () => {
    const state = giftFlowers({
      state: {
        ...TEST_FARM,
        inventory: {
          "Blue Daffodil": new Decimal(1),
        },
      },
      action: {
        flower: "Blue Daffodil",
        type: "flowers.gifted",
        bumpkin: "betty",
      },
    });

    expect(state.npcs?.betty?.friendship?.points).toEqual(15);
  });
});
