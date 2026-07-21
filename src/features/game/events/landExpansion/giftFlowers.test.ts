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
      }),
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
      }),
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
      }),
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

  it("gives a normal friendship points for a flower not on their list", () => {
    const state = giftFlowers({
      state: {
        ...TEST_FARM,
        inventory: {
          "Blue Cosmos": new Decimal(2),
        },
      },
      action: {
        flower: "Blue Cosmos",
        type: "flowers.gifted",
        bumpkin: "betty",
      },
    });

    expect(state.npcs?.betty?.friendship?.points).toEqual(3);
  });

  it("gives a bonus for a flower they desire", () => {
    const state = giftFlowers({
      state: {
        ...TEST_FARM,
        inventory: {
          "Red Pansy": new Decimal(1),
        },
      },
      action: {
        flower: "Red Pansy",
        type: "flowers.gifted",
        bumpkin: "betty",
      },
    });

    expect(state.npcs?.betty?.friendship?.points).toEqual(8);
  });

  it("gives +2 relationship from flowers with Blossom Bonding Skill", () => {
    const state = giftFlowers({
      state: {
        ...TEST_FARM,
        bumpkin: {
          ...TEST_FARM.bumpkin,
          skills: {
            "Blossom Bonding": 1,
          },
        },
        inventory: {
          "Red Pansy": new Decimal(1),
        },
      },
      action: {
        flower: "Red Pansy",
        type: "flowers.gifted",
        bumpkin: "betty",
      },
    });

    expect(state.npcs?.betty?.friendship?.points).toEqual(10);
  });

  describe("Blossom Bonding ranks", () => {
    const giftWithRank = (rank: number) =>
      giftFlowers({
        state: {
          ...TEST_FARM,
          bumpkin: {
            ...TEST_FARM.bumpkin,
            skills: { "Blossom Bonding": rank },
          },
          inventory: {
            "Red Pansy": new Decimal(1),
          },
        },
        action: {
          flower: "Red Pansy",
          type: "flowers.gifted",
          bumpkin: "betty",
        },
      });

    it("gives +3 relationship points at rank 2", () => {
      expect(giftWithRank(2).npcs?.betty?.friendship?.points).toEqual(11);
    });

    it("gives +4 relationship points at rank 3", () => {
      expect(giftWithRank(3).npcs?.betty?.friendship?.points).toEqual(12);
    });
  });
});
