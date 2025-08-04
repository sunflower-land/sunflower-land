import { Beehive, FlowerBed } from "features/game/types/game";
import { REMOVE_BEEHIVE_ERRORS, removeBeehive } from "./removeBeehive";
import { TEST_FARM } from "features/game/lib/constants";
import Decimal from "decimal.js-light";
import { FLOWER_SEEDS } from "features/game/types/flowers";
import { DEFAULT_HONEY_PRODUCTION_TIME } from "features/game/lib/updateBeehives";

describe("removeBeehive", () => {
  const now = Date.now();

  const FLOWER_GROW_TIME = FLOWER_SEEDS["Sunpetal Seed"].plantSeconds * 1000;

  const DEFAULT_BEEHIVE: Beehive = {
    x: 3,
    y: 3,
    swarm: false,
    honey: { updatedAt: 0, produced: 0 },
    flowers: [],
  };

  const DEFAULT_FLOWER_BED: FlowerBed = {
    createdAt: now,
    x: 0,
    y: 0,
    flower: {
      name: "Red Pansy",
      plantedAt: now,
    },
  };

  it("throws an error if beehive is not placed", () => {
    expect(() =>
      removeBeehive({
        state: {
          ...TEST_FARM,
          inventory: {
            Beehive: new Decimal(0),
          },
        },
        action: {
          id: "1234",
          type: "beehive.removed",
        },
      }),
    ).toThrow(REMOVE_BEEHIVE_ERRORS.BEEHIVE_NOT_PLACED);
  });

  it("removes a beehive", () => {
    const beehiveId = "1";
    const now = Date.now();

    const state = removeBeehive({
      state: {
        ...TEST_FARM,
        inventory: {
          Beehive: new Decimal(1),
        },
        flowers: {
          discovered: {},
          flowerBeds: {
            "123": DEFAULT_FLOWER_BED,
          },
        },
        beehives: {
          [beehiveId]: {
            ...DEFAULT_BEEHIVE,
            honey: {
              updatedAt: now,
              produced: DEFAULT_HONEY_PRODUCTION_TIME / 2,
            },
            flowers: [
              {
                id: "123",
                attachedAt: now,
                attachedUntil: now + FLOWER_GROW_TIME,
                rate: 1,
              },
            ],
          },
        },
      },
      action: {
        id: beehiveId,
        type: "beehive.removed",
      },
      createdAt: now,
    });

    expect(state.beehives[beehiveId].x).toBeUndefined();
    expect(state.beehives[beehiveId].y).toBeUndefined();
    expect(state.beehives[beehiveId].removedAt).toEqual(now);
    expect(state.beehives[beehiveId].flowers).toHaveLength(0);
    expect(state.beehives[beehiveId].honey.produced).toEqual(0);
    expect(state.inventory.Honey).toEqual(new Decimal(0.5));
  });

  it("updates beehives", () => {
    const beehive1Id = "1";
    const beehive2Id = "2";
    const flower1Id = "1";
    const tenMinutesAgo = now - 1000 * 60 * 10;

    const state = removeBeehive({
      state: {
        ...TEST_FARM,
        inventory: {
          Beehive: new Decimal(1),
        },
        flowers: {
          discovered: {},
          flowerBeds: {
            [flower1Id]: DEFAULT_FLOWER_BED,
          },
        },
        beehives: {
          [beehive1Id]: {
            ...DEFAULT_BEEHIVE,
            honey: { updatedAt: tenMinutesAgo, produced: 0 },
            flowers: [
              {
                id: flower1Id,
                attachedAt: tenMinutesAgo,
                attachedUntil: FLOWER_GROW_TIME - tenMinutesAgo,
              },
            ],
          },
          [beehive2Id]: {
            ...DEFAULT_BEEHIVE,
            honey: { updatedAt: tenMinutesAgo, produced: 0 },
            flowers: [],
          },
        },
      },
      action: {
        id: beehive1Id,
        type: "beehive.removed",
      },
      createdAt: now,
    });

    expect(state.beehives[beehive1Id]).toEqual({
      swarm: false,
      honey: { updatedAt: tenMinutesAgo, produced: 0 },
      flowers: [],
      removedAt: now,
    });
    expect(state.beehives[beehive2Id].flowers).toHaveLength(1);
  });
});
