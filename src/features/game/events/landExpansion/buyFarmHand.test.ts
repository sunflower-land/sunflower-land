import Decimal from "decimal.js-light";
import { buyFarmhand } from "./buyFarmHand";
import { TEST_FARM } from "features/game/lib/constants";

describe("buyFarmHand", () => {
  it("requires a player has space for a farm hand", () => {
    expect(() =>
      buyFarmhand({
        action: {
          type: "farmHand.bought",
        },
        state: {
          ...TEST_FARM,
          farmHands: {
            bumpkins: {
              1: {
                equipped: {
                  background: "Farm Background",
                  body: "Beige Farmer Potion",
                  hair: "Basic Hair",
                  shoes: "Black Farmer Boots",
                  tool: "Farmer Pitchfork",
                  shirt: "Yellow Farmer Shirt",
                  pants: "Farmer Overalls",
                },
              },
            },
          },
        },
      }),
    ).toThrow("No space for a farm hand");
  });

  it("requires a player has block buck", () => {
    expect(() =>
      buyFarmhand({
        action: {
          type: "farmHand.bought",
        },
        state: {
          ...TEST_FARM,
          island: {
            type: "spring",
          },
        },
      }),
    ).toThrow("Insufficient Block Bucks");
  });

  it("uses a Farmhand Coupon", () => {
    const state = buyFarmhand({
      action: {
        type: "farmHand.bought",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Farmhand Coupon": new Decimal(1),
        },
        island: {
          type: "spring",
        },
      },
    });

    expect(state.inventory["Farmhand Coupon"]).toEqual(new Decimal(0));
    expect(Object.keys(state.farmHands.bumpkins)).toHaveLength(1);
  });

  it("buys a farm hand", () => {
    const state = buyFarmhand({
      action: {
        type: "farmHand.bought",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Block Buck": new Decimal(25),
        },
        island: {
          type: "spring",
        },
      },
    });

    expect(state.inventory["Block Buck"]).toEqual(new Decimal(10));
    expect(state.farmHands.bumpkins).toEqual({
      "1": {
        equipped: {
          background: "Farm Background",
          body: "Beige Farmer Potion",
          hair: "Basic Hair",
          shoes: "Black Farmer Boots",
          tool: "Farmer Pitchfork",
          shirt: "Yellow Farmer Shirt",
          pants: "Farmer Overalls",
        },
      },
    });
  });
});
