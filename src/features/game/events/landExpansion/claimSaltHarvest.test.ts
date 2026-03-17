import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import {
  BASE_SALT_YIELD,
  SALT_HARVEST_DURATION,
  getStoredSaltCharges,
} from "features/game/types/salt";
import {
  CLAIM_SALT_HARVEST_ERRORS,
  claimSaltHarvest,
} from "./claimSaltHarvest";
import { startSaltHarvest } from "./startSaltHarvest";

const now = new Date("2026-03-17T00:00:00.000Z").getTime();

describe("claimSaltHarvest", () => {
  it("requires the salt node to exist", () => {
    expect(() =>
      claimSaltHarvest({
        state: INITIAL_FARM,
        action: { type: "saltHarvest.claimed", id: "1" },
        createdAt: now,
      }),
    ).toThrow(CLAIM_SALT_HARVEST_ERRORS.SALT_NODE_NOT_FOUND);
  });

  it("requires at least one ready slot", () => {
    expect(() =>
      claimSaltHarvest({
        state: {
          ...INITIAL_FARM,
          saltFarm: {
            level: 1,
            nodes: {
              1: {
                createdAt: 0,
                salt: {
                  lastUpdatedAt: now,
                  storedCharges: 1,
                  harvesting: {
                    slots: [
                      {
                        startedAt: now,
                        readyAt: now + SALT_HARVEST_DURATION,
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        action: { type: "saltHarvest.claimed", id: "1" },
        createdAt: now,
      }),
    ).toThrow(CLAIM_SALT_HARVEST_ERRORS.NO_SALT_READY);
  });

  it("claims all ready slots and keeps unready slots", () => {
    const state = claimSaltHarvest({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Salt: new Decimal(0),
        },
        saltFarm: {
          level: 1,
          nodes: {
            1: {
              createdAt: 0,
              salt: {
                lastUpdatedAt: now,
                storedCharges: 1,
                harvesting: {
                  slots: [
                    {
                      startedAt: now - SALT_HARVEST_DURATION * 2,
                      readyAt: now - SALT_HARVEST_DURATION,
                    },
                    {
                      startedAt: now - SALT_HARVEST_DURATION,
                      readyAt: now,
                    },
                    {
                      startedAt: now,
                      readyAt: now + SALT_HARVEST_DURATION,
                    },
                  ],
                },
              },
            },
          },
        },
      },
      action: { type: "saltHarvest.claimed", id: "1" },
      createdAt: now,
    });

    expect(state.inventory.Salt).toEqual(new Decimal(BASE_SALT_YIELD * 2));
    expect(state.saltFarm.nodes["1"].salt.harvesting?.slots).toEqual([
      {
        startedAt: now,
        readyAt: now + SALT_HARVEST_DURATION,
      },
    ]);
  });

  it("resumes full-charge regeneration after first slot completion", () => {
    const started = startSaltHarvest({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          "Salt Rake": new Decimal(10),
          Salt: new Decimal(0),
        },
        saltFarm: {
          level: 1,
          nodes: {
            1: {
              createdAt: 0,
              salt: {
                lastUpdatedAt: now,
                storedCharges: 3,
              },
            },
          },
        },
      },
      action: { type: "saltHarvest.started", id: "1", rakes: 1 },
      createdAt: now,
    });

    const claimed = claimSaltHarvest({
      state: started,
      action: { type: "saltHarvest.claimed", id: "1" },
      createdAt: now + 8 * 60 * 60 * 1000,
    });

    expect(claimed.inventory.Salt).toEqual(new Decimal(BASE_SALT_YIELD));
    expect(
      getStoredSaltCharges(
        claimed.saltFarm.nodes["1"],
        now + 8 * 60 * 60 * 1000,
      ),
    ).toBe(3);
  });
});
