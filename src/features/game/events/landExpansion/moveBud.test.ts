import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { MOVE_BUD_ERRORS, moveBud } from "./moveBud";

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
          type: "bud.moved",
          id: "1",
          coordinates: { x: 2, y: 2 },
        },
      }),
    ).toThrow(MOVE_BUD_ERRORS.NO_BUD);
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
          type: "bud.moved",
          id: "1",
          coordinates: { x: 2, y: 2 },
        },
      }),
    ).toThrow(MOVE_BUD_ERRORS.BUD_NOT_PLACED);
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
        type: "bud.moved",
        id: "1",
        coordinates: { x: 2, y: 2 },
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
