import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { pickMushroom } from "./pickMushroom";

describe("pickMushroom", () => {
  let state: GameState;

  beforeEach(() => {
    state = {
      ...TEST_FARM,
      mushrooms: {
        spawnedAt: 0,
        mushrooms: {
          "1": { x: 1, y: 1, amount: 1, name: "Wild Mushroom" },
          "2": { x: 2, y: 2, amount: 1, name: "Wild Mushroom" },
        },
      },
    };
  });

  it("throws an error if the mushroom doesn't exist", () => {
    const errorId = "errorId";

    expect(() =>
      pickMushroom({
        state: state,
        action: {
          type: "mushroom.picked",
          id: errorId,
        },
      })
    ).toThrow(`Mushroom not found: ${errorId}`);
  });

  it("prevents the same mushroom from being picked twice", () => {
    const id = "1";

    const newState = pickMushroom({
      state,
      action: {
        type: "mushroom.picked",
        id,
      },
    });

    expect(() =>
      pickMushroom({
        state: newState,
        action: {
          type: "mushroom.picked",
          id,
        },
      })
    ).toThrow(`Mushroom not found: ${id}`);
  });

  it("removes the mushroom from the state", () => {
    const id = "1";

    const newState = pickMushroom({
      state,
      action: {
        type: "mushroom.picked",
        id,
      },
    });

    expect(newState.mushrooms?.mushrooms[id]).toBeUndefined();
  });

  it("adds the mushroom to the inventory", () => {
    const id = "1";

    const newState = pickMushroom({
      state,
      action: {
        type: "mushroom.picked",
        id,
      },
    });

    expect(newState.inventory["Wild Mushroom"]).toStrictEqual(new Decimal(1));
  });

  it("picks multiple mushrooms", () => {
    const id = "1";

    const newState = pickMushroom({
      state,
      action: {
        type: "mushroom.picked",
        id,
      },
    });

    const newState2 = pickMushroom({
      state: newState,
      action: {
        type: "mushroom.picked",
        id: "2",
      },
    });

    expect(newState2.inventory["Wild Mushroom"]).toStrictEqual(new Decimal(2));
  });
});
