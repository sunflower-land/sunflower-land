import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { REMOVE_BUD_ERRORS, removeBud } from "./removeBud";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  balance: new Decimal(0),
};

describe("removeBud", () => {
  it("does not remove non-existent bud", () => {
    expect(() =>
      removeBud({
        state: {
          ...GAME_STATE,
        },
        action: {
          type: "bud.removed",
          id: "1",
        },
      })
    ).toThrow(REMOVE_BUD_ERRORS.INVALID_BUD);
  });

  it("does not remove a bud that is not placed", () => {
    expect(() =>
      removeBud({
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
          type: "bud.removed",
          id: "1",
        },
      })
    ).toThrow(REMOVE_BUD_ERRORS.BUD_NOT_PLACED);
  });

  it("removes a bud", () => {
    const gameState = removeBud({
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
        type: "bud.removed",
        id: "1",
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
