import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import {
  BASE_SALT_YIELD,
  MAX_STORED_SALT_CHARGES_PER_NODE,
  SALT_CHARGE_GENERATION_TIME,
} from "features/game/types/salt";
import { HARVEST_SALT_ERRORS, harvestSalt } from "./harvestSalt";

const now = Date.now();

describe("harvestSalt", () => {
  it("consumes one rake and one stored charge, then grants salt instantly", () => {
    const state = harvestSalt({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Salt: new Decimal(0),
          "Salt Rake": new Decimal(2),
        },
        saltFarm: {
          ...INITIAL_FARM.saltFarm,
          nodes: {
            "0": {
              createdAt: now - 1000,
              coordinates: { x: 0, y: 0 },
              salt: {
                storedCharges: 2,
                nextChargeAt: now + 10_000,
              },
            },
          },
        },
      },
      action: { type: "salt.harvested", id: "0" },
      createdAt: now,
      farmId: 1,
    });

    expect(state.inventory["Salt Rake"]).toEqual(new Decimal(1));
    expect(state.inventory["Salt"]).toEqual(new Decimal(BASE_SALT_YIELD));
    expect(state.saltFarm.nodes["0"].salt.storedCharges).toBe(1);
    expect(state.saltFarm.nodes["0"].salt.harvesting).toBeUndefined();
  });

  it("auto-converts ready legacy slots and clears legacy queue data", () => {
    const state = harvestSalt({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Salt: new Decimal(0),
          "Salt Rake": new Decimal(3),
        },
        saltFarm: {
          ...INITIAL_FARM.saltFarm,
          nodes: {
            "0": {
              createdAt: now - 1000,
              coordinates: { x: 0, y: 0 },
              salt: {
                storedCharges: 1,
                nextChargeAt: now + 10_000,
                harvesting: {
                  slots: [
                    { startedAt: now - 5000, readyAt: now - 1000 },
                    { startedAt: now - 1000, readyAt: now + 5000 },
                  ],
                },
              },
            },
          },
        },
      },
      action: { type: "salt.harvested", id: "0" },
      createdAt: now,
      farmId: 1,
    });

    expect(state.inventory["Salt Rake"]).toEqual(new Decimal(2));
    expect(state.inventory["Salt"]).toEqual(new Decimal(BASE_SALT_YIELD * 3));
    expect(state.saltFarm.nodes["0"].salt.harvesting).toBeUndefined();
    expect(state.saltFarm.nodes["0"].salt.storedCharges).toBe(0);
  });

  it("preserves cooldown boundary when harvesting a non-full node", () => {
    const preservedBoundary = now + 10_000;

    const state = harvestSalt({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Salt: new Decimal(0),
          "Salt Rake": new Decimal(2),
        },
        saltFarm: {
          ...INITIAL_FARM.saltFarm,
          nodes: {
            "0": {
              createdAt: now - 1000,
              coordinates: { x: 0, y: 0 },
              salt: {
                storedCharges: 2,
                nextChargeAt: preservedBoundary,
              },
            },
          },
        },
      },
      action: { type: "salt.harvested", id: "0" },
      createdAt: now,
      farmId: 1,
    });

    expect(state.saltFarm.nodes["0"].salt.nextChargeAt).toEqual(
      preservedBoundary,
    );
  });

  it("resets cooldown from harvest time when harvesting a full node", () => {
    const previousBoundary = now + 10_000;

    const state = harvestSalt({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Salt: new Decimal(0),
          "Salt Rake": new Decimal(2),
        },
        saltFarm: {
          ...INITIAL_FARM.saltFarm,
          nodes: {
            "0": {
              createdAt: now - 1000,
              coordinates: { x: 0, y: 0 },
              salt: {
                storedCharges: 3,
                nextChargeAt: previousBoundary,
              },
            },
          },
        },
      },
      action: { type: "salt.harvested", id: "0" },
      createdAt: now,
      farmId: 1,
    });

    expect(state.saltFarm.nodes["0"].salt.nextChargeAt).toEqual(
      now + SALT_CHARGE_GENERATION_TIME,
    );
  });

  it("throws when there are no charges to consume", () => {
    expect(() =>
      harvestSalt({
        state: {
          ...INITIAL_FARM,
          inventory: {
            ...INITIAL_FARM.inventory,
            "Salt Rake": new Decimal(1),
          },
          saltFarm: {
            ...INITIAL_FARM.saltFarm,
            nodes: {
              "0": {
                createdAt: now - 1000,
                coordinates: { x: 0, y: 0 },
                salt: {
                  storedCharges: 0,
                  nextChargeAt: now + 10_000,
                },
              },
            },
          },
        },
        action: { type: "salt.harvested", id: "0" },
        createdAt: now,
        farmId: 1,
      }),
    ).toThrow(HARVEST_SALT_ERRORS.NOT_ENOUGH_CHARGES);
  });

  it("grants +2 salt per harvest with Wide Rakes skill", () => {
    const state = harvestSalt({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Salt: new Decimal(0),
          "Salt Rake": new Decimal(2),
        },
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          skills: { "Wide Rakes": 1 },
        },
        saltFarm: {
          ...INITIAL_FARM.saltFarm,
          nodes: {
            "0": {
              createdAt: now - 1000,
              coordinates: { x: 0, y: 0 },
              salt: {
                storedCharges: 2,
                nextChargeAt: now + 10_000,
              },
            },
          },
        },
      },
      action: { type: "salt.harvested", id: "0" },
      createdAt: now,
      farmId: 1,
    });

    expect(state.inventory["Salt"]).toEqual(new Decimal(BASE_SALT_YIELD + 2));
    expect(state.saltFarm.nodes["0"].salt.storedCharges).toBe(1);
  });

  describe("Sea Blessed", () => {
    it("does not recharge all nodes without the skill", () => {
      const state = harvestSalt({
        state: {
          ...INITIAL_FARM,
          inventory: {
            ...INITIAL_FARM.inventory,
            Salt: new Decimal(0),
            "Salt Rake": new Decimal(1),
          },
          saltFarm: {
            ...INITIAL_FARM.saltFarm,
            nodes: {
              "0": {
                createdAt: now - 1000,
                coordinates: { x: 0, y: 0 },
                salt: { storedCharges: 1, nextChargeAt: now + 10_000 },
              },
              "1": {
                createdAt: now - 1000,
                coordinates: { x: 1, y: 0 },
                salt: { storedCharges: 0, nextChargeAt: now + 10_000 },
              },
            },
          },
        },
        action: { type: "salt.harvested", id: "0" },
        createdAt: now,
        farmId: 1,
      });

      expect(state.saltFarm.nodes["1"].salt.storedCharges).toBe(0);
    });

    it("recharges all nodes on PRNG hit with Sea Blessed", () => {
      const state = harvestSalt({
        state: {
          ...INITIAL_FARM,
          inventory: {
            ...INITIAL_FARM.inventory,
            Salt: new Decimal(0),
            "Salt Rake": new Decimal(1),
          },
          bumpkin: {
            ...INITIAL_FARM.bumpkin,
            skills: { "Sea Blessed": 1 },
          },
          farmActivity: {
            ...INITIAL_FARM.farmActivity,
            "Salt Harvested": 44,
          },
          saltFarm: {
            ...INITIAL_FARM.saltFarm,
            nodes: {
              "0": {
                createdAt: now - 1000,
                coordinates: { x: 0, y: 0 },
                salt: { storedCharges: 1, nextChargeAt: now + 10_000 },
              },
              "1": {
                createdAt: now - 1000,
                coordinates: { x: 1, y: 0 },
                salt: { storedCharges: 0, nextChargeAt: now + 50_000 },
              },
            },
          },
        },
        action: { type: "salt.harvested", id: "0" },
        createdAt: now,
        farmId: 1,
      });

      expect(state.saltFarm.nodes["0"].salt.storedCharges).toBe(
        MAX_STORED_SALT_CHARGES_PER_NODE,
      );
      expect(state.saltFarm.nodes["1"].salt.storedCharges).toBe(
        MAX_STORED_SALT_CHARGES_PER_NODE,
      );
    });

    it("does not recharge on PRNG miss with Sea Blessed", () => {
      const state = harvestSalt({
        state: {
          ...INITIAL_FARM,
          inventory: {
            ...INITIAL_FARM.inventory,
            Salt: new Decimal(0),
            "Salt Rake": new Decimal(1),
          },
          bumpkin: {
            ...INITIAL_FARM.bumpkin,
            skills: { "Sea Blessed": 1 },
          },
          saltFarm: {
            ...INITIAL_FARM.saltFarm,
            nodes: {
              "0": {
                createdAt: now - 1000,
                coordinates: { x: 0, y: 0 },
                salt: { storedCharges: 1, nextChargeAt: now + 10_000 },
              },
              "1": {
                createdAt: now - 1000,
                coordinates: { x: 1, y: 0 },
                salt: { storedCharges: 0, nextChargeAt: now + 50_000 },
              },
            },
          },
        },
        action: { type: "salt.harvested", id: "0" },
        createdAt: now,
        farmId: 1,
      });

      expect(state.saltFarm.nodes["0"].salt.storedCharges).toBe(0);
      expect(state.saltFarm.nodes["1"].salt.storedCharges).toBe(0);
    });
  });
});
