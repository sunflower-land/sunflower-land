import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import {
  MAX_STORED_SALT_CHARGES_PER_NODE,
  SALT_CHARGE_GENERATION_TIME,
  SALT_HARVEST_DURATION,
  getDisplaySaltCharges,
  getSaltChargeGenerationTime,
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
                  nextChargeAt: now + SALT_CHARGE_GENERATION_TIME,
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
                  nextChargeAt: now + SALT_CHARGE_GENERATION_TIME,
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
                  nextChargeAt: now + SALT_CHARGE_GENERATION_TIME,
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
                nextChargeAt: now + SALT_CHARGE_GENERATION_TIME,
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
                  nextChargeAt: now + SALT_CHARGE_GENERATION_TIME,
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
                nextChargeAt: now + SALT_CHARGE_GENERATION_TIME,
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

    const secondCreatedAt = now + 10 * 60 * 1000;
    const updated = startSaltHarvest({
      state: inProgress,
      action: { type: "saltHarvest.started", id: "1", rakes: 1 },
      createdAt: secondCreatedAt,
    });

    expect(updated.saltFarm.nodes["1"].salt.harvesting?.slots).toHaveLength(3);
    const lastReadyBeforeAdd = now + SALT_HARVEST_DURATION * 2;
    const thirdStartedAt = Math.max(secondCreatedAt, lastReadyBeforeAdd);
    expect(updated.saltFarm.nodes["1"].salt.harvesting?.slots[2]).toEqual({
      startedAt: thirdStartedAt,
      readyAt: thirdStartedAt + SALT_HARVEST_DURATION,
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
                nextChargeAt: now + SALT_CHARGE_GENERATION_TIME,
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
                nextChargeAt: now + SALT_CHARGE_GENERATION_TIME,
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
                  nextChargeAt: now + SALT_CHARGE_GENERATION_TIME,
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
                  nextChargeAt: now + SALT_CHARGE_GENERATION_TIME,
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
    const chargeInterval = getSaltChargeGenerationTime({
      gameState: {
        ...INITIAL_FARM,
        saltFarm: { level: 1, nodes: {} },
      } as GameState,
    });
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
                nextChargeAt: now + chargeInterval,
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

    expect(state.saltFarm.nodes["1"].salt.harvesting?.slots).toHaveLength(1);
    expect(state.saltFarm.nodes["1"].salt.harvesting?.slots?.[0].readyAt).toBe(
      now + SALT_HARVEST_DURATION,
    );
    expect(getStoredSaltCharges(state.saltFarm.nodes["1"], now)).toBe(2);
    const syncOpts = {
      chargeIntervalMs: getSaltChargeGenerationTime({ gameState: state }),
    };
    const interval = syncOpts.chargeIntervalMs;
    const pauseEnd = now + SALT_HARVEST_DURATION;
    expect(
      getStoredSaltCharges(
        state.saltFarm.nodes["1"],
        pauseEnd + Math.floor(interval / 2),
        syncOpts,
      ),
    ).toBe(2);
    expect(
      getStoredSaltCharges(
        state.saltFarm.nodes["1"],
        pauseEnd + interval + 1,
        syncOpts,
      ),
    ).toBe(3);
  });

  it("does not pause regeneration when starting below full charges", () => {
    const chargeInterval = getSaltChargeGenerationTime({
      gameState: {
        ...INITIAL_FARM,
        saltFarm: { level: 1, nodes: {} },
      } as GameState,
    });
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
                nextChargeAt: now + chargeInterval,
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

    const syncOpts = {
      chargeIntervalMs: getSaltChargeGenerationTime({ gameState: state }),
    };
    expect(
      getStoredSaltCharges(
        state.saltFarm.nodes["1"],
        now + chargeInterval - 1,
        syncOpts,
      ),
    ).toBe(1);
    expect(
      getStoredSaltCharges(
        state.saltFarm.nodes["1"],
        now + chargeInterval,
        syncOpts,
      ),
    ).toBe(2);
  });

  it("resumes regeneration from first slot ready even before claim", () => {
    const chargeInterval = getSaltChargeGenerationTime({
      gameState: {
        ...INITIAL_FARM,
        vip: { bundles: [], expiresAt: now + 24 * 60 * 60 * 1000 },
        saltFarm: { level: 1, nodes: {} },
        inventory: {
          ...INITIAL_FARM.inventory,
          "Salt Rake": new Decimal(10),
        },
      },
    });
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
                nextChargeAt: now + chargeInterval,
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

    expect(getStoredSaltCharges(state.saltFarm.nodes["1"], now)).toBe(0);
    const syncOpts = {
      chargeIntervalMs: getSaltChargeGenerationTime({ gameState: state }),
    };
    const interval = syncOpts.chargeIntervalMs;
    const pauseEnd = now + SALT_HARVEST_DURATION;
    expect(
      getStoredSaltCharges(
        state.saltFarm.nodes["1"],
        pauseEnd + interval + 1,
        syncOpts,
      ),
    ).toBe(1);
  });

  it("uses materialized charges at the regen boundary (synced source)", () => {
    const chargeInterval = getSaltChargeGenerationTime({
      gameState: {
        ...INITIAL_FARM,
        saltFarm: { level: 1, nodes: {} },
      } as GameState,
    });

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
                nextChargeAt: now,
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
      action: { type: "saltHarvest.started", id: "1", rakes: 2 },
      createdAt: now,
    });

    expect(state.saltFarm.nodes["1"].salt.storedCharges).toBe(0);
    expect(state.saltFarm.nodes["1"].salt.harvesting?.slots).toHaveLength(2);
  });

  it("does not re-pause regeneration when VIP adds rakes after it resumed", () => {
    const started = startSaltHarvest({
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
                nextChargeAt: now + SALT_CHARGE_GENERATION_TIME,
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
      action: { type: "saltHarvest.started", id: "1", rakes: 1 },
      createdAt: now,
    });

    const addedLater = startSaltHarvest({
      state: started,
      action: { type: "saltHarvest.started", id: "1", rakes: 1 },
      createdAt: now + 8 * 60 * 60 * 1000,
    });

    const later = now + 15 * 60 * 60 * 1000;
    const node = addedLater.saltFarm.nodes["1"];
    expect(getDisplaySaltCharges(node, later)).toBe(
      MAX_STORED_SALT_CHARGES_PER_NODE,
    );
    expect(getStoredSaltCharges(node, later)).toBeGreaterThanOrEqual(
      MAX_STORED_SALT_CHARGES_PER_NODE,
    );
  });
});
