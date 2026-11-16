import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type { GameState, Mushroom } from "features/game/types/game";
import { pickMushroom } from "./pickMushroom";

describe("pickMushroom", () => {
  let state: GameState;

  beforeEach(() => {
    state = {
      ...TEST_FARM,
      mushrooms: {
        spawnedAt: 0,
        mushrooms: {
          "1": { x: 1, y: 1, name: "Wild Mushroom" },
          "2": { x: 2, y: 2, name: "Wild Mushroom" },
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
        createdAt: Date.now(),
      }),
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
      createdAt: Date.now(),
    });

    expect(() =>
      pickMushroom({
        state: newState,
        action: {
          type: "mushroom.picked",
          id,
        },
        createdAt: Date.now(),
      }),
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
      createdAt: Date.now(),
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
      createdAt: Date.now(),
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
      createdAt: Date.now(),
    });

    const newState2 = pickMushroom({
      state: newState,
      action: {
        type: "mushroom.picked",
        id: "2",
      },
      createdAt: Date.now(),
    });

    expect(newState2.inventory["Wild Mushroom"]).toStrictEqual(new Decimal(2));
  });

  describe("yield", () => {
    const PLACED = [
      { id: "1", createdAt: 0, coordinates: { x: 0, y: 0 }, readyAt: 0 },
    ];

    it("works out the yield at pick time from the current boosts", () => {
      const newState = pickMushroom({
        state: { ...state, collectibles: { "Mushroom House": PLACED } },
        action: { type: "mushroom.picked", id: "1" },
        createdAt: Date.now(),
      });

      expect(newState.inventory["Wild Mushroom"]).toStrictEqual(
        new Decimal(1.2),
      );
    });

    it("ignores an amount that was stored on the mushroom at spawn", () => {
      const legacy = { x: 1, y: 1, name: "Wild Mushroom", amount: 5 };

      const newState = pickMushroom({
        state: {
          ...state,
          mushrooms: {
            spawnedAt: 0,
            mushrooms: { "1": legacy as unknown as Mushroom },
          },
        },
        action: { type: "mushroom.picked", id: "1" },
        createdAt: Date.now(),
      });

      expect(newState.inventory["Wild Mushroom"]).toStrictEqual(new Decimal(1));
    });

    it("boosts Magic Mushrooms with a Magic Mushroom stem bud", () => {
      const newState = pickMushroom({
        state: {
          ...state,
          mushrooms: {
            spawnedAt: 0,
            mushrooms: { "1": { x: 1, y: 1, name: "Magic Mushroom" } },
          },
          buds: {
            1: {
              type: "Plaza",
              colour: "Blue",
              ears: "No Ears",
              aura: "No Aura",
              stem: "Magic Mushroom",
              coordinates: { x: 0, y: 0 },
            },
          },
        },
        action: { type: "mushroom.picked", id: "1" },
        createdAt: Date.now(),
      });

      expect(newState.inventory["Magic Mushroom"]).toStrictEqual(
        new Decimal(1.2),
      );
    });

    it("records the boosts used at pick time", () => {
      const createdAt = Date.now();

      const newState = pickMushroom({
        state: { ...state, collectibles: { "Mushroom House": PLACED } },
        action: { type: "mushroom.picked", id: "1" },
        createdAt,
      });

      expect(newState.boostsUsedAt?.["Mushroom House"]).toEqual(createdAt);
    });
  });
});
