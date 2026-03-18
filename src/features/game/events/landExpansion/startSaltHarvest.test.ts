import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import {
  MAX_STORED_SALT_CHARGES_PER_NODE,
  SALT_CHARGE_GENERATION_TIME,
  SALT_HARVEST_DURATION,
  getStoredSaltCharges,
} from "features/game/types/salt";
import {
  START_SALT_HARVEST_ERRORS,
  startSaltHarvest,
} from "./startSaltHarvest";

const now = new Date("2026-03-17T00:00:00.000Z").getTime();

describe("startSaltHarvest", () => {
  it("requires the salt node to exist", () => {
    expect(() =>
      startSaltHarvest({
        state: INITIAL_FARM,
        action: {
          type: "saltHarvest.started",
          id: "1",
          rakes: 1,
        },
        createdAt: now,
      }),
    ).toThrow(START_SALT_HARVEST_ERRORS.SALT_NODE_NOT_FOUND);
  });

  it("requires a positive integer rake count", () => {
    expect(() =>
      startSaltHarvest({
        state: {
          ...INITIAL_FARM,
          saltFarm: {
            level: 1,
            nodes: {
              1: {
                createdAt: 0,
                coordinates: { x: 0, y: 0 },
                salt: {
                  lastUpdatedAt: now,
                  storedCharges: 1,
                },
              },
            },
          },
          inventory: {
            ...INITIAL_FARM.inventory,
            "Salt Rake": new Decimal(10),
          },
        },
        action: {
          type: "saltHarvest.started",
          id: "1",
          rakes: 0,
        },
        createdAt: now,
      }),
    ).toThrow(START_SALT_HARVEST_ERRORS.INVALID_RAKE_COUNT);
  });

  it("requires enough stored charges", () => {
    expect(() =>
      startSaltHarvest({
        state: {
          ...INITIAL_FARM,
          saltFarm: {
            level: 1,
            nodes: {
              1: {
                createdAt: 0,
                coordinates: { x: 0, y: 0 },
                salt: {
                  lastUpdatedAt: now,
                  storedCharges: 0,
                },
              },
            },
          },
          inventory: {
            ...INITIAL_FARM.inventory,
            "Salt Rake": new Decimal(10),
          },
        },
        action: {
          type: "saltHarvest.started",
          id: "1",
          rakes: 1,
        },
        createdAt: now,
      }),
    ).toThrow(START_SALT_HARVEST_ERRORS.NOT_ENOUGH_CHARGES);
  });

  it("requires enough salt rakes", () => {
    expect(() =>
      startSaltHarvest({
        state: {
          ...INITIAL_FARM,
          saltFarm: {
            level: 1,
            nodes: {
              1: {
                createdAt: 0,
                coordinates: { x: 0, y: 0 },
                salt: {
                  lastUpdatedAt: now,
                  storedCharges: 1,
                },
              },
            },
          },
          inventory: {
            ...INITIAL_FARM.inventory,
            "Salt Rake": new Decimal(0),
          },
        },
        action: {
          type: "saltHarvest.started",
          id: "1",
          rakes: 1,
        },
        createdAt: now,
      }),
    ).toThrow(START_SALT_HARVEST_ERRORS.NOT_ENOUGH_SALT_RAKES);
  });

  it("queues sequential slots and consumes charges/rakes", () => {
    const state = startSaltHarvest({
      state: {
        ...INITIAL_FARM,
        vip: { bundles: [], expiresAt: now + 24 * 60 * 60 * 1000 },
        saltFarm: {
          level: 1,
          nodes: {
            1: {
              createdAt: 0,
              coordinates: { x: 0, y: 0 },
              salt: {
                lastUpdatedAt: now,
                storedCharges: 3,
              },
            },
          },
        },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Salt Rake": new Decimal(10),
        },
      },
      action: {
        type: "saltHarvest.started",
        id: "1",
        rakes: 3,
      },
      createdAt: now,
    });

    expect(state.inventory["Salt Rake"]).toEqual(new Decimal(7));
    expect(state.saltFarm.nodes["1"].salt.storedCharges).toBe(0);
    expect(state.saltFarm.nodes["1"].salt.harvesting?.slots).toEqual([
      { startedAt: now, readyAt: now + SALT_HARVEST_DURATION },
      {
        startedAt: now + SALT_HARVEST_DURATION,
        readyAt: now + SALT_HARVEST_DURATION * 2,
      },
      {
        startedAt: now + SALT_HARVEST_DURATION * 2,
        readyAt: now + SALT_HARVEST_DURATION * 3,
      },
    ]);
  });

  it("blocks non-VIP from placing multiple rakes", () => {
    expect(() =>
      startSaltHarvest({
        state: {
          ...INITIAL_FARM,
          saltFarm: {
            level: 1,
            nodes: {
              1: {
                createdAt: 0,
                coordinates: { x: 0, y: 0 },
                salt: {
                  lastUpdatedAt: now,
                  storedCharges: 3,
                },
              },
            },
          },
          inventory: {
            ...INITIAL_FARM.inventory,
            "Salt Rake": new Decimal(10),
          },
        },
        action: { type: "saltHarvest.started", id: "1", rakes: 2 },
        createdAt: now,
      }),
    ).toThrow(START_SALT_HARVEST_ERRORS.NON_VIP_SINGLE_RAKE_ONLY);
  });

  it("supports adding rakes while harvest is active", () => {
    const inProgress = startSaltHarvest({
      state: {
        ...INITIAL_FARM,
        vip: { bundles: [], expiresAt: now + 24 * 60 * 60 * 1000 },
        saltFarm: {
          level: 1,
          nodes: {
            1: {
              createdAt: 0,
              coordinates: { x: 0, y: 0 },
              salt: {
                lastUpdatedAt: now,
                storedCharges: 3,
              },
            },
          },
        },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Salt Rake": new Decimal(10),
        },
      },
      action: { type: "saltHarvest.started", id: "1", rakes: 2 },
      createdAt: now,
    });

    const updated = startSaltHarvest({
      state: inProgress,
      action: { type: "saltHarvest.started", id: "1", rakes: 1 },
      createdAt: now + 10 * 60 * 1000,
    });

    expect(updated.saltFarm.nodes["1"].salt.harvesting?.slots).toHaveLength(3);
    expect(updated.saltFarm.nodes["1"].salt.harvesting?.slots[2]).toEqual({
      startedAt: now + SALT_HARVEST_DURATION * 2,
      readyAt: now + SALT_HARVEST_DURATION * 3,
    });
  });

  it("blocks non-VIP from placing another rake while one exists", () => {
    const inProgress = startSaltHarvest({
      state: {
        ...INITIAL_FARM,
        saltFarm: {
          level: 1,
          nodes: {
            1: {
              createdAt: 0,
              coordinates: { x: 0, y: 0 },
              salt: {
                lastUpdatedAt: now,
                storedCharges: 2,
              },
            },
          },
        },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Salt Rake": new Decimal(10),
        },
      },
      action: { type: "saltHarvest.started", id: "1", rakes: 1 },
      createdAt: now,
    });

    expect(() =>
      startSaltHarvest({
        state: inProgress,
        action: { type: "saltHarvest.started", id: "1", rakes: 1 },
        createdAt: now + 10 * 60 * 1000,
      }),
    ).toThrow(START_SALT_HARVEST_ERRORS.NON_VIP_ACTIVE_HARVEST_EXISTS);
  });

  it("allows VIP to place multiple rakes at once", () => {
    const state = startSaltHarvest({
      state: {
        ...INITIAL_FARM,
        vip: { bundles: [], expiresAt: now + 24 * 60 * 60 * 1000 },
        saltFarm: {
          level: 1,
          nodes: {
            1: {
              createdAt: 0,
              coordinates: { x: 0, y: 0 },
              salt: {
                lastUpdatedAt: now,
                storedCharges: 3,
              },
            },
          },
        },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Salt Rake": new Decimal(10),
        },
      },
      action: { type: "saltHarvest.started", id: "1", rakes: 3 },
      createdAt: now,
    });

    expect(state.saltFarm.nodes["1"].salt.harvesting?.slots).toHaveLength(3);
  });

  it("blocks VIP from placing more than 4 active rakes", () => {
    expect(() =>
      startSaltHarvest({
        state: {
          ...INITIAL_FARM,
          vip: { bundles: [], expiresAt: now + 24 * 60 * 60 * 1000 },
          saltFarm: {
            level: 1,
            nodes: {
              1: {
                createdAt: 0,
                coordinates: { x: 0, y: 0 },
                salt: {
                  lastUpdatedAt: now,
                  storedCharges: 5,
                },
              },
            },
          },
          inventory: {
            ...INITIAL_FARM.inventory,
            "Salt Rake": new Decimal(10),
          },
        },
        action: { type: "saltHarvest.started", id: "1", rakes: 5 },
        createdAt: now,
      }),
    ).toThrow(START_SALT_HARVEST_ERRORS.VIP_MAX_RAKES_EXCEEDED);
  });

  it("blocks VIP from placing a 5th active rake slot", () => {
    expect(() =>
      startSaltHarvest({
        state: {
          ...INITIAL_FARM,
          vip: { bundles: [], expiresAt: now + 24 * 60 * 60 * 1000 },
          saltFarm: {
            level: 1,
            nodes: {
              1: {
                createdAt: 0,
                coordinates: { x: 0, y: 0 },
                salt: {
                  lastUpdatedAt: now,
                  storedCharges: 1,
                  harvesting: {
                    slots: [
                      {
                        startedAt: now - SALT_HARVEST_DURATION * 4,
                        readyAt: now - SALT_HARVEST_DURATION * 3,
                      },
                      {
                        startedAt: now - SALT_HARVEST_DURATION * 3,
                        readyAt: now - SALT_HARVEST_DURATION * 2,
                      },
                      {
                        startedAt: now - SALT_HARVEST_DURATION * 2,
                        readyAt: now - SALT_HARVEST_DURATION,
                      },
                      {
                        startedAt: now - SALT_HARVEST_DURATION,
                        readyAt: now + SALT_HARVEST_DURATION,
                      },
                    ],
                  },
                },
              },
            },
          },
          inventory: {
            ...INITIAL_FARM.inventory,
            "Salt Rake": new Decimal(10),
          },
        },
        action: { type: "saltHarvest.started", id: "1", rakes: 1 },
        createdAt: now,
      }),
    ).toThrow(START_SALT_HARVEST_ERRORS.VIP_MAX_RAKES_EXCEEDED);
  });

  it("pauses regeneration when harvest starts from full stored charges", () => {
    const state = startSaltHarvest({
      state: {
        ...INITIAL_FARM,
        saltFarm: {
          level: 1,
          nodes: {
            1: {
              createdAt: 0,
              coordinates: { x: 0, y: 0 },
              salt: {
                lastUpdatedAt: now,
                storedCharges: MAX_STORED_SALT_CHARGES_PER_NODE,
              },
            },
          },
        },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Salt Rake": new Decimal(10),
        },
      },
      action: { type: "saltHarvest.started", id: "1", rakes: 1 },
      createdAt: now,
    });

    expect(
      state.saltFarm.nodes["1"].salt.harvesting?.regenerationPausedUntil,
    ).toBe(now + SALT_HARVEST_DURATION);
    expect(getStoredSaltCharges(state.saltFarm.nodes["1"], now)).toBe(2);
    expect(
      getStoredSaltCharges(state.saltFarm.nodes["1"], now + 6 * 60 * 60 * 1000),
    ).toBe(2);
    expect(
      getStoredSaltCharges(state.saltFarm.nodes["1"], now + 8 * 60 * 60 * 1000),
    ).toBe(3);
  });

  it("does not pause regeneration when starting below full charges", () => {
    const state = startSaltHarvest({
      state: {
        ...INITIAL_FARM,
        saltFarm: {
          level: 1,
          nodes: {
            1: {
              createdAt: 0,
              coordinates: { x: 0, y: 0 },
              salt: {
                lastUpdatedAt: now,
                storedCharges: 2,
              },
            },
          },
        },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Salt Rake": new Decimal(10),
        },
      },
      action: { type: "saltHarvest.started", id: "1", rakes: 1 },
      createdAt: now,
    });

    expect(
      state.saltFarm.nodes["1"].salt.harvesting?.regenerationPausedUntil,
    ).toBe(undefined);
    expect(
      getStoredSaltCharges(
        state.saltFarm.nodes["1"],
        now + SALT_CHARGE_GENERATION_TIME - 1,
      ),
    ).toBe(1);
    expect(
      getStoredSaltCharges(
        state.saltFarm.nodes["1"],
        now + SALT_CHARGE_GENERATION_TIME,
      ),
    ).toBe(2);
  });
});
