import { Beehive, FlowerBed } from "features/game/types/game";
import { REMOVE_BEEHIVE_ERRORS, removeBeehive } from "./removeBeehive";
import { TEST_FARM } from "features/game/lib/constants";
import Decimal from "decimal.js-light";
import { FLOWER_SEEDS } from "features/game/types/flowers";
import { DEFAULT_HONEY_PRODUCTION_TIME } from "features/game/lib/updateBeehives";

describe("removeBeehive", () => {
  const now = Date.now();

  const FLOWER_GROW_TIME = FLOWER_SEEDS()["Sunpetal Seed"].plantSeconds * 1000;

  const DEFAULT_BEEHIVE: Beehive = {
    x: 3,
    y: 3,
    swarm: false,
    height: 1,
    width: 1,
    honey: { updatedAt: 0, produced: 0 },
    flowers: [],
  };

  const DEFAULT_FLOWER_BED: FlowerBed = {
    createdAt: now,
    x: 0,
    y: 0,
    height: 1,
    width: 2,
    flower: {
      name: "Red Pansy",
      amount: 1,
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

  it("it harvests any honey that the beehive has produced", () => {
    const beehiveId = "1";
    const halfHoneyProduced = DEFAULT_HONEY_PRODUCTION_TIME / 2;

    const state = removeBeehive({
      state: {
        ...TEST_FARM,
        inventory: {
          Beehive: new Decimal(1),
          Honey: new Decimal(0),
        },
        beehives: {
          [beehiveId]: {
            ...DEFAULT_BEEHIVE,
            honey: {
              updatedAt: 0,
              produced: halfHoneyProduced,
            },
          },
        },
      },
      action: {
        id: beehiveId,
        type: "beehive.removed",
      },
    });

    expect(state.beehives[beehiveId]).toBeUndefined();
    expect(state.inventory.Honey).toEqual(new Decimal(0.5));
  });

  it("removes a beehive", () => {
    const beehiveId = "1";

    const state = removeBeehive({
      state: {
        ...TEST_FARM,
        inventory: {
          Beehive: new Decimal(1),
        },
        beehives: {
          [beehiveId]: DEFAULT_BEEHIVE,
        },
      },
      action: {
        id: beehiveId,
        type: "beehive.removed",
      },
    });

    expect(state.beehives[beehiveId]).toBeUndefined();
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
    });

    expect(state.beehives[beehive1Id]).toBeUndefined();
    expect(state.beehives[beehive2Id].flowers).toHaveLength(1);
  });
});
