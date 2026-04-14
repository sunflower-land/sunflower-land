import Decimal from "decimal.js-light";
import { buyFarmhand } from "./buyFarmHand";
import { TEST_FARM } from "features/game/lib/constants";
import { BB_TO_GEM_RATIO } from "features/game/types/game";

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

  it("requires a player has Gem", () => {
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
    ).toThrow("Insufficient Gems");
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
          Gem: new Decimal(25 * BB_TO_GEM_RATIO),
        },
        island: {
          type: "spring",
        },
      },
    });

    expect(state.inventory["Gem"]).toEqual(new Decimal(15 * BB_TO_GEM_RATIO));
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

  it("buys a second farm hand", () => {
    let state = buyFarmhand({
      action: {
        type: "farmHand.bought",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          Gem: new Decimal(50 * BB_TO_GEM_RATIO),
        },
        island: {
          type: "spring",
        },
      },
    });

    expect(state.inventory["Gem"]).toEqual(new Decimal(40 * BB_TO_GEM_RATIO));

    state = buyFarmhand({
      action: {
        type: "farmHand.bought",
      },
      state,
    });

    expect(state.inventory["Gem"]).toEqual(new Decimal(25 * BB_TO_GEM_RATIO));
  });
});
