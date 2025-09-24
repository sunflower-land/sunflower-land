import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { REMOVE_NFT_ERRORS, removeNFT } from "./removeNFT";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  balance: new Decimal(0),
};

describe("removeNFT", () => {
  it("does not remove non-existent bud", () => {
    expect(() =>
      removeNFT({
        state: {
          ...GAME_STATE,
        },
        action: {
          type: "nft.removed",
          id: "1",
          nft: "Bud",
          location: "farm",
        },
      }),
    ).toThrow(REMOVE_NFT_ERRORS.INVALID_NFT);
  });

  it("does not remove a bud that is not placed", () => {
    expect(() =>
      removeNFT({
        state: {
          ...GAME_STATE,
          buds: {
            1: {
              aura: "Basic",
              colour: "Beige",
              ears: "Ears",
              stem: "3 Leaf Clover",
              type: "Beach",
            },
          },
        },
        action: {
          type: "nft.removed",
          id: "1",
          nft: "Bud",
          location: "farm",
        },
      }),
    ).toThrow(REMOVE_NFT_ERRORS.NFT_NOT_PLACED);
  });

  it.skip("prevents removing a bud if stem buff is active", () => {
    expect(() =>
      removeNFT({
        state: {
          ...GAME_STATE,
          crops: {
            ["1"]: {
              createdAt: Date.now(),
              x: 0,
              y: 0,
              crop: {
                name: "Carrot",
                plantedAt: Date.now(),
                id: "1",
              },
            },
          },
          buds: {
            1: {
              aura: "Basic",
              colour: "Beige",
              ears: "Ears",
              stem: "3 Leaf Clover",
              type: "Beach",
              coordinates: {
                x: 1,
                y: 1,
              },
            },
          },
        },
        action: {
          type: "nft.removed",
          id: "1",
          nft: "Bud",
          location: "farm",
        },
      }),
    ).toThrowError("Crops are growing");
  });

  it.skip("prevents removing a bud if type buff is active", () => {
    expect(() =>
      removeNFT({
        state: {
          ...GAME_STATE,
          fruitPatches: {
            ["1"]: {
              createdAt: Date.now(),
              x: 0,
              y: 0,
              fruit: {
                harvestedAt: Date.now(),
                harvestsLeft: 1,
                name: "Apple",
                plantedAt: Date.now(),
              },
            },
          },
          buds: {
            1: {
              aura: "Basic",
              colour: "Beige",
              ears: "Ears",
              stem: "Axe Head",
              type: "Beach",
              coordinates: {
                x: 1,
                y: 1,
              },
            },
          },
        },
        action: {
          type: "nft.removed",
          id: "1",
          nft: "Bud",
          location: "farm",
        },
      }),
    ).toThrowError("Fruits are growing");
  });

  it("removes a bud", () => {
    const gameState = removeNFT({
      state: {
        ...GAME_STATE,

        buds: {
          1: {
            aura: "Basic",
            colour: "Beige",
            ears: "Ears",
            stem: "3 Leaf Clover",
            type: "Beach",
            coordinates: {
              x: 1,
              y: 1,
            },
          },
        },
      },
      action: {
        type: "nft.removed",
        id: "1",
        nft: "Bud",
        location: "farm",
      },
    });

    expect(gameState.buds?.[1]).toEqual({
      aura: "Basic",
      colour: "Beige",
      ears: "Ears",
      stem: "3 Leaf Clover",
      type: "Beach",
    });
  });
});
