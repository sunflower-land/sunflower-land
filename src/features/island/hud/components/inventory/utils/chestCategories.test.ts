import { TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import { getChestCategories } from "./chestCategories";

describe("getChestCategories", () => {
  const state: GameState = { ...TEST_FARM };

  it("splits temporary boosts (totems, hourglasses, shrines) from permanent boosts", () => {
    const categories = getChestCategories(state, [
      "Basic Scarecrow",
      "Time Warp Totem",
      "Gourmet Hourglass",
      "Fox Shrine",
    ]);

    const boosts = categories.find((c) => c.id === "boosts");
    const temporaryBoosts = categories.find((c) => c.id === "temporaryBoosts");

    expect(boosts?.items).toEqual(["Basic Scarecrow"]);
    expect(temporaryBoosts?.items).toEqual(
      expect.arrayContaining([
        "Time Warp Totem",
        "Gourmet Hourglass",
        "Fox Shrine",
      ]),
    );
    expect(temporaryBoosts?.items).toHaveLength(3);
  });

  it("does not double-count temporary boosts under decorations or permanent boosts", () => {
    const categories = getChestCategories(state, ["Time Warp Totem"]);

    const boosts = categories.find((c) => c.id === "boosts");
    const decorations = categories.find((c) => c.id === "decorations");

    expect(boosts?.items).not.toContain("Time Warp Totem");
    expect(decorations?.items).not.toContain("Time Warp Totem");
  });

  it("returns an empty temporaryBoosts category when there are none", () => {
    const categories = getChestCategories(state, ["Basic Scarecrow"]);

    const temporaryBoosts = categories.find((c) => c.id === "temporaryBoosts");

    expect(temporaryBoosts?.items).toEqual([]);
  });

  it("groups letter tiles into their own category", () => {
    const categories = getChestCategories(state, [
      "Letter A Tile",
      "Letter F Tile",
      "Letter M Tile",
      "Basic Scarecrow",
    ]);

    const letterTiles = categories.find((c) => c.id === "letterTiles");
    const decorations = categories.find((c) => c.id === "decorations");

    expect(letterTiles?.items).toEqual(
      expect.arrayContaining([
        "Letter A Tile",
        "Letter F Tile",
        "Letter M Tile",
      ]),
    );
    expect(letterTiles?.items).toHaveLength(3);
    expect(decorations?.items).not.toContain("Letter A Tile");
  });
});
