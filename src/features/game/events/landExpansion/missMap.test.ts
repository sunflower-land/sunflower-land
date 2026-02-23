import { INITIAL_FARM } from "features/game/lib/constants";
import { missMap } from "./missMap";
import { GameState } from "features/game/types/game";

const farm = { ...INITIAL_FARM } as GameState;

describe("missMap", () => {
  it("requires player has casted", () => {
    expect(() =>
      missMap({
        action: { type: "map.missed" },
        state: farm,
      }),
    ).toThrow("Nothing has been casted");
  });

  it("requires maps to be present", () => {
    expect(() =>
      missMap({
        action: { type: "map.missed" },
        state: {
          ...farm,
          fishing: {
            ...farm.fishing,
            wharf: {
              castedAt: 10000010,
              caught: { Anchovy: 1 },
            },
          },
        },
      }),
    ).toThrow("No maps have been found");
  });

  it("removes maps from wharf", () => {
    const state = missMap({
      action: { type: "map.missed" },
      state: {
        ...farm,
        fishing: {
          ...farm.fishing,
          wharf: {
            castedAt: 10000010,
            caught: { Anchovy: 1 },
            maps: { "Starlight Tuna": 1 },
          },
        },
      },
    });

    expect(state.fishing.wharf.maps).toBeUndefined();
  });

  it("tracks Map Missed activity", () => {
    const state = missMap({
      action: { type: "map.missed" },
      state: {
        ...farm,
        fishing: {
          ...farm.fishing,
          wharf: {
            castedAt: 10000010,
            caught: { Anchovy: 1 },
            maps: { "Starlight Tuna": 1 },
          },
        },
      },
    });

    expect(state.farmActivity["Map Missed"]).toEqual(1);
  });

  it("updates boostsUsedAt with Anemone Flower when collectible built", () => {
    const createdAt = 12345;
    const state = missMap({
      action: { type: "map.missed" },
      state: {
        ...farm,
        collectibles: {
          "Anemone Flower": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              readyAt: 0,
            },
          ],
        },
        fishing: {
          ...farm.fishing,
          wharf: {
            castedAt: 10000010,
            caught: { Anchovy: 1 },
            maps: { "Starlight Tuna": 1 },
          },
        },
      },
      createdAt,
    });

    expect(state.boostsUsedAt?.["Anemone Flower"]).toEqual(createdAt);
  });

  it("does not update boostsUsedAt when Anemone Flower not built", () => {
    const state = missMap({
      action: { type: "map.missed" },
      state: {
        ...farm,
        fishing: {
          ...farm.fishing,
          wharf: {
            castedAt: 10000010,
            caught: { Anchovy: 1 },
            maps: { "Starlight Tuna": 1 },
          },
        },
      },
    });

    expect(state.boostsUsedAt?.["Anemone Flower"]).toBeUndefined();
  });
});
