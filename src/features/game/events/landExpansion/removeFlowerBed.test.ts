import { INITIAL_FARM } from "features/game/lib/constants";
import { Beehive, GameState } from "features/game/types/game";
import { REMOVE_FLOWER_BED_ERRORS, removeFlowerBed } from "./removeFlowerBed";
const now = Date.now();

const GAME_STATE: GameState = {
  ...INITIAL_FARM,
  flowers: {
    discovered: {},
    flowerBeds: {
      "0": { createdAt: now },
      "2": { createdAt: now, x: 1, y: 0 },
    },
  },
};

const DEFAULT_BEEHIVE: Beehive = {
  swarm: false,
  x: 3,
  y: 3,
  honey: { updatedAt: now, produced: 0 },
  flowers: [],
};

describe("removeFlowerBed", () => {
  it("throws if flower bed not found", () => {
    expect(() =>
      removeFlowerBed({
        state: GAME_STATE,
        action: { type: "flowerBed.removed", id: "1" },
        createdAt: now,
      }),
    ).toThrow(REMOVE_FLOWER_BED_ERRORS.FLOWER_BED_NOT_FOUND);
  });

  it("throws if flower bed not placed", () => {
    expect(() =>
      removeFlowerBed({
        state: GAME_STATE,
        action: { type: "flowerBed.removed", id: "0" },
        createdAt: now,
      }),
    ).toThrow(REMOVE_FLOWER_BED_ERRORS.FLOWER_BED_NOT_PLACED);
  });

  it("removes flower bed", () => {
    const state = removeFlowerBed({
      state: GAME_STATE,
      action: { type: "flowerBed.removed", id: "2" },
      createdAt: now,
    });
    expect(state.flowers.flowerBeds["2"].x).toBeUndefined();
    expect(state.flowers.flowerBeds["2"].y).toBeUndefined();
  });

  it("sets removedAt time", () => {
    const state = removeFlowerBed({
      state: GAME_STATE,
      action: { type: "flowerBed.removed", id: "2" },
      createdAt: now,
    });
    expect(state.flowers.flowerBeds["2"].removedAt).toBeDefined();
  });
  it("removes the flower from the beehive", () => {
    const state = removeFlowerBed({
      state: {
        ...GAME_STATE,
        beehives: {
          "2": {
            ...DEFAULT_BEEHIVE,
            flowers: [
              {
                id: "2",
                attachedAt: now,
                attachedUntil: now + 24 * 60 * 60 * 1000,
              },
            ],
          },
        },
        flowers: {
          discovered: {},
          flowerBeds: {
            "0": { createdAt: now },
            "2": {
              createdAt: now,
              x: 1,
              y: 0,
              flower: {
                name: "Red Pansy",
                plantedAt: now,
              },
            },
          },
        },
      },
      action: { type: "flowerBed.removed", id: "2" },
      createdAt: now,
    });
    expect(state.beehives["2"].flowers).toEqual([]);
  });
});
