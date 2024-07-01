import Decimal from "decimal.js-light";
import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { tradeTentacle } from "./tradeTentacle";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  collectibles: { ...TEST_FARM, "Catch the Kraken Banner": [] },
  bumpkin: INITIAL_BUMPKIN,
};

describe("tradeTentacle", () => {
  it("throws an error if bumpkin is not present", () => {
    expect(() =>
      tradeTentacle({
        state: {
          ...TEST_FARM,
          bumpkin: undefined,
        },
        action: {
          type: "shelly.tradeTentacle",
        },
      }),
    ).toThrow("You do not have a Bumpkin");
  });

  it("does not trade inexistent Tentacle", () => {
    expect(() =>
      tradeTentacle({
        state: {
          ...GAME_STATE,
          inventory: { ...GAME_STATE.inventory, "Kraken Tentacle": undefined },
          npcs: { shelly: { deliveryCount: 0 } },
        },
        action: {
          type: "shelly.tradeTentacle",
        },
      }),
    ).toThrow("Insufficient quantity to trade");
  });

  it("does not trade placed Tentacle", () => {
    expect(() =>
      tradeTentacle({
        state: {
          ...GAME_STATE,
          inventory: {
            ...GAME_STATE.inventory,
            "Kraken Tentacle": new Decimal(1),
          },
          npcs: { shelly: { deliveryCount: 0 } },
          collectibles: {
            "Kraken Tentacle": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                id: "12",
                readyAt: 0,
              },
            ],
          },
        },
        action: {
          type: "shelly.tradeTentacle",
        },
      }),
    ).toThrow("Insufficient quantity to trade");
  });

  it("trades a tentacle", () => {
    const state = tradeTentacle({
      state: {
        ...GAME_STATE,
        inventory: {
          "Kraken Tentacle": new Decimal(5),
        },
        npcs: { shelly: { deliveryCount: 0 } },
      },
      action: {
        type: "shelly.tradeTentacle",
      },
    });

    expect(state.inventory["Kraken Tentacle"]).toEqual(new Decimal(4));
    expect(state.inventory["Mermaid Scale"]).toEqual(new Decimal(10));
  });

  it("Applies the +2 scales boost with Banner", () => {
    const state = tradeTentacle({
      state: {
        ...GAME_STATE,
        inventory: {
          "Kraken Tentacle": new Decimal(5),
          "Catch the Kraken Banner": new Decimal(1),
        },
        npcs: { shelly: { deliveryCount: 0 } },
        collectibles: {
          "Catch the Kraken Banner": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "12",
              readyAt: 0,
            },
          ],
        },
      },
      action: {
        type: "shelly.tradeTentacle",
      },
    });

    expect(state.inventory["Mermaid Scale"]).toEqual(new Decimal(12));
  });

  it("increments the tentacle traded activity", () => {
    const state = tradeTentacle({
      state: {
        ...GAME_STATE,
        inventory: {
          "Kraken Tentacle": new Decimal(5),
        },
        npcs: { shelly: { deliveryCount: 0 } },
      },
      action: {
        type: "shelly.tradeTentacle",
      },
    });
    expect(state.bumpkin?.activity?.["Kraken Tentacle Traded"]).toEqual(1);
  });
});
