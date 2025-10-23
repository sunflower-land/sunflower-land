import Decimal from "decimal.js-light";
import { TEST_FARM } from "../../lib/constants";
import { GameState } from "../../types/game";
import { placeNFT } from "./placeNFT";

const GAME_STATE: GameState = TEST_FARM;

describe("Place NFT", () => {
  it("requires the Pet NFT is revealed", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-10-23T00:00:00.000Z"));
    const date = Date.now();

    expect(() =>
      placeNFT({
        state: {
          ...GAME_STATE,
          pets: {
            nfts: {
              1: {
                id: 1,
                name: "Pet #1",
                requests: {
                  food: [],
                  fedAt: date,
                },
                energy: 100,
                experience: 0,
                pettedAt: date,
              },
            },
          },
        },
        action: {
          id: "1",
          type: "nft.placed",
          nft: "Pet",
          coordinates: {
            x: 0,
            y: 0,
          },
          location: "farm",
        },
        createdAt: date,
      }),
    ).toThrow("This Pet NFT is not revealed");

    jest.useRealTimers();
  });

  it("requires the NFT ID is on the game state", () => {
    const date = Date.now();
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
        createdAt: date,
      }),
    ).toThrow("This NFT does not exist");
  });

  it("requires the NFT is not already placed", () => {
    const date = Date.now();
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
        createdAt: date,
      }),
    ).toThrow("This NFT is already placed");
  });

  it("places the NFT", () => {
    const date = Date.now();
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
      createdAt: date,
    });

    expect(state.buds?.[1].coordinates).toStrictEqual({ x: 0, y: 0 });
  });
});
