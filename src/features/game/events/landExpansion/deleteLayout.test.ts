import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import { saveLayout } from "./saveLayout";
import { deleteLayout } from "./deleteLayout";

const createdAt = 1_700_000_000_000;

const baseFarm: GameState = {
  ...TEST_FARM,
  inventory: {
    ...TEST_FARM.inventory,
    "Basic Land": new Decimal(1),
    "Beta Pass": new Decimal(1),
  },
  layouts: [],
};

const withTwoLayouts = (): GameState => {
  let state = saveLayout({
    state: baseFarm,
    action: { type: "layout.saved", name: "First" },
    createdAt,
  });
  state = saveLayout({
    state,
    action: { type: "layout.saved", name: "Second" },
    createdAt,
  });
  return state;
};

describe("deleteLayout", () => {
  it("removes the layout at the given index and reindexes the rest", () => {
    const result = deleteLayout({
      state: withTwoLayouts(),
      action: { type: "layout.deleted", layoutId: 0 },
    });

    expect(result.layouts).toHaveLength(1);
    expect(result.layouts![0].name).toEqual("Second");
  });

  it("throws when the layout does not exist", () => {
    expect(() =>
      deleteLayout({
        state: withTwoLayouts(),
        action: { type: "layout.deleted", layoutId: 5 },
      }),
    ).toThrow("Layout does not exist");
  });

  it("throws when deleting the protected Ascension Layout", () => {
    const built = withTwoLayouts();
    const state: GameState = {
      ...built,
      layouts: built.layouts!.map((layout, i) =>
        i === 0 ? { ...layout, auto: true } : layout,
      ),
    };
    expect(() =>
      deleteLayout({
        state,
        action: { type: "layout.deleted", layoutId: 0 },
      }),
    ).toThrow("The Ascension Layout cannot be deleted");
  });
});
