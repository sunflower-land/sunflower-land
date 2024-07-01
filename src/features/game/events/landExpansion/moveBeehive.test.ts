import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { MOVE_BEEHIVE_ERRORS, moveBeehive } from "./moveBeehive";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  balance: new Decimal(0),
  inventory: {
    "Rusty Shovel": new Decimal(1),
  },
};

describe("moveBeehive", () => {
  it("does not move a beehive that is not placed", () => {
    expect(() =>
      moveBeehive({
        state: {
          ...GAME_STATE,
        },
        action: {
          type: "beehive.moved",
          id: "1234",
          coordinates: { x: 2, y: 2 },
        },
      }),
    ).toThrow(MOVE_BEEHIVE_ERRORS.BEEHIVE_NOT_PLACED);
  });

  it("moves a beehive", () => {
    const gameState = moveBeehive({
      state: {
        ...GAME_STATE,
        beehives: {
          "1234": {
            swarm: false,
            height: 1,
            width: 1,
            honey: {
              updatedAt: 0,
              produced: 0,
            },
            flowers: [],
            x: 4,
            y: 4,
          },
        },
      },
      action: {
        type: "beehive.moved",
        id: "1234",
        coordinates: { x: 2, y: 2 },
      },
    });

    expect(gameState.beehives["1234"]).toMatchObject({
      honey: {
        updatedAt: 0,
        produced: 0,
      },
      flowers: [],
      x: 2,
      y: 2,
    });
  });
});
