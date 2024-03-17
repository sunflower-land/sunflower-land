import Decimal from "decimal.js-light";
import { enterRaffle } from "./enterRaffle";
import { TEST_FARM } from "features/game/lib/constants";

describe("enterRaffle", () => {
  it("should throw an error if the player does not have a prize ticket", () => {
    expect(() =>
      enterRaffle({
        state: {
          ...TEST_FARM,
        },
        action: {
          type: "raffle.entered",
        },
      })
    ).toThrowError("Missing Treasure Key");
  });

  it("enters raffle for correct month", () => {
    const now = new Date("2024-03-17");

    const state = enterRaffle({
      state: {
        ...TEST_FARM,
        inventory: {
          "Prize Ticket": new Decimal(1),
        },
        pumpkinPlaza: {
          raffle: {
            entries: {
              "2024-02": 12,
              "2024-03": 3,
            },
          },
        },
      },
      action: {
        type: "raffle.entered",
      },
      createdAt: now.getTime(),
    });

    expect(state.pumpkinPlaza.raffle?.entries).toEqual({
      "2024-02": 12,
      "2024-03": 4, // Incremented
    });
  });

  it("uses ticket", () => {
    const now = new Date("2024-03-17");

    const state = enterRaffle({
      state: {
        ...TEST_FARM,
        inventory: {
          "Prize Ticket": new Decimal(3),
          Sunflower: new Decimal(10),
        },
      },
      action: {
        type: "raffle.entered",
      },
      createdAt: now.getTime(),
    });

    expect(state.inventory).toEqual({
      "Prize Ticket": new Decimal(2),
      Sunflower: new Decimal(10),
    });
  });
});
