import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { MOVE_NFT_ERRORS, moveBud } from "./moveNFT";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  balance: new Decimal(0),
  inventory: {
    "Rusty Shovel": new Decimal(1),
  },
};

describe("moveBud", () => {
  it("does not move non-existent bud ", () => {
    expect(() =>
      moveBud({
        state: {
          ...GAME_STATE,
        },
        action: {
          type: "nft.moved",
          id: "1",
          coordinates: { x: 2, y: 2 },
          nft: "Bud",
          location: "farm",
        },
      }),
    ).toThrow(MOVE_NFT_ERRORS.NO_NFT);
  });

  it("does not move a bud that is not placed", () => {
    expect(() =>
      moveBud({
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
          type: "nft.moved",
          id: "1",
          coordinates: { x: 2, y: 2 },
          nft: "Bud",
          location: "farm",
        },
      }),
    ).toThrow(MOVE_NFT_ERRORS.NFT_NOT_PLACED);
  });

  it("moves a bud", () => {
    const gameState = moveBud({
      state: {
        ...GAME_STATE,
        buds: {
          1: {
            aura: "Basic",
            colour: "Beige",
            ears: "Ears",
            stem: "3 Leaf Clover",
            type: "Beach",
            coordinates: { x: 4, y: 4 },
          },
        },
      },
      action: {
        type: "nft.moved",
        id: "1",
        coordinates: { x: 2, y: 2 },
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
      coordinates: { x: 2, y: 2 },
    });
  });
});
