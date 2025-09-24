import Decimal from "decimal.js-light";
import { TEST_FARM } from "../../lib/constants";
import { GameState } from "../../types/game";
import { placeNFT } from "./placeNFT";

const date = Date.now();
const GAME_STATE: GameState = TEST_FARM;

describe("Place Bud", () => {
  it("requires the bud ID is on the game state", () => {
    expect(() =>
      placeNFT({
        state: {
          ...GAME_STATE,
          inventory: {
            Scarecrow: new Decimal(1),
          },
          buds: {},
        },
        action: {
          id: "1",
          type: "nft.placed",
          nft: "Bud",
          coordinates: {
            x: 0,
            y: 0,
          },
          location: "farm",
        },
      }),
    ).toThrow("This bud does not exist");
  });

  it("requires the bud is not already placed", () => {
    expect(() =>
      placeNFT({
        state: {
          ...GAME_STATE,
          inventory: {
            Scarecrow: new Decimal(1),
          },
          buds: {
            1: {
              aura: "Basic",
              colour: "Green",
              ears: "Ears",
              stem: "3 Leaf Clover",
              type: "Beach",
              coordinates: {
                x: 0,
                y: 0,
              },
            },
          },
        },
        action: {
          id: "1",
          type: "nft.placed",
          nft: "Bud",
          coordinates: {
            x: 0,
            y: 0,
          },
          location: "farm",
        },
      }),
    ).toThrow("This bud is already placed");
  });

  it("places the bud", () => {
    const state = placeNFT({
      state: {
        ...GAME_STATE,
        inventory: {
          "Brazilian Flag": new Decimal(1),
        },
        buds: {
          1: {
            aura: "Basic",
            colour: "Green",
            ears: "Ears",
            stem: "3 Leaf Clover",
            type: "Beach",
          },
        },
      },
      action: {
        id: "1",
        type: "nft.placed",
        nft: "Bud",
        coordinates: {
          x: 0,
          y: 0,
        },
        location: "farm",
      },
    });

    expect(state.buds?.[1].coordinates).toStrictEqual({ x: 0, y: 0 });
  });
});
