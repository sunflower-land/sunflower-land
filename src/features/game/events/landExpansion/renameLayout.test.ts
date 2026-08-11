import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import { MAX_LAYOUT_NAME_LENGTH } from "features/game/types/game";
import { saveLayout } from "./saveLayout";
import { renameLayout } from "./renameLayout";

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

const withLayout = (): GameState =>
  saveLayout({
    state: baseFarm,
    action: { type: "layout.saved", name: "Original" },
    createdAt,
  });

describe("renameLayout", () => {
  it("renames a layout and bumps updatedAt", () => {
    const result = renameLayout({
      state: withLayout(),
      action: { type: "layout.renamed", layoutId: 0, name: "  New Name  " },
      createdAt: createdAt + 5000,
    });

    expect(result.layouts![0].name).toEqual("New Name");
    expect(result.layouts![0].updatedAt).toEqual(createdAt + 5000);
    expect(result.layouts![0].createdAt).toEqual(createdAt);
  });

  it("throws when the layout does not exist", () => {
    expect(() =>
      renameLayout({
        state: withLayout(),
        action: { type: "layout.renamed", layoutId: 3, name: "x" },
        createdAt,
      }),
    ).toThrow("Layout does not exist");
  });

  it("throws when renaming the protected Ascension Layout", () => {
    const built = withLayout();
    const state: GameState = {
      ...built,
      layouts: built.layouts!.map((layout) => ({ ...layout, auto: true })),
    };
    expect(() =>
      renameLayout({
        state,
        action: { type: "layout.renamed", layoutId: 0, name: "New Name" },
        createdAt,
      }),
    ).toThrow("The Ascension Layout cannot be renamed");
  });

  it("rejects empty / too-long names", () => {
    expect(() =>
      renameLayout({
        state: withLayout(),
        action: { type: "layout.renamed", layoutId: 0, name: "   " },
        createdAt,
      }),
    ).toThrow("Layout name cannot be empty");

    expect(() =>
      renameLayout({
        state: withLayout(),
        action: {
          type: "layout.renamed",
          layoutId: 0,
          name: "x".repeat(MAX_LAYOUT_NAME_LENGTH + 1),
        },
        createdAt,
      }),
    ).toThrow("Layout name is too long");
  });
});
