/* eslint-disable no-var */
import { INITIAL_FARM } from "features/game/lib/constants";
import { fetchPet } from "./fetchPet";
import Decimal from "decimal.js-light";
import { KNOWN_IDS } from "features/game/types";
import { prngChance } from "lib/prng";

describe("fetchPet", () => {
  const now = Date.now();
  const farmId = 1;
  it("throws an error if pet is not found", () => {
    expect(() => {
      fetchPet({
        farmId,
        state: { ...INITIAL_FARM },
        action: { type: "pet.fetched", petId: "Barkley", fetch: "Acorn" },
        createdAt: now,
      });
    }).toThrow("Pet not found");
  });
  it("throws an error if pet is napping", () => {
    expect(() => {
      fetchPet({
        farmId,
        state: {
          ...INITIAL_FARM,
          pets: {
            common: {
              Barkley: {
                name: "Barkley",
                requests: { food: [], fedAt: now },
                energy: 100,
                experience: 0,
                pettedAt: now - 2 * 60 * 60 * 1000,
              },
            },
          },
        },
        action: { type: "pet.fetched", petId: "Barkley", fetch: "Acorn" },
        createdAt: now,
      });
    }).toThrow("Pet is napping");
  });

  it("throws an error if pet is neglected", () => {
    expect(() => {
      fetchPet({
        farmId,
        state: {
          ...INITIAL_FARM,
          pets: {
            common: {
              Barkley: {
                name: "Barkley",
                requests: { food: [], fedAt: now - 4 * 24 * 60 * 60 * 1000 },
                energy: 100,
                experience: 10,
                pettedAt: now,
              },
            },
          },
        },
        action: { type: "pet.fetched", petId: "Barkley", fetch: "Acorn" },
        createdAt: now,
      });
    }).toThrow("Pet is neglected");
  });

  it("throws an error if fetch is not found", () => {
    expect(() => {
      fetchPet({
        farmId,
        state: {
          ...INITIAL_FARM,
          pets: {
            common: {
              Barkley: {
                name: "Barkley",
                requests: { food: [], fedAt: now },
                energy: 100,
                experience: 0,
                pettedAt: now,
              },
            },
          },
        },
        action: { type: "pet.fetched", petId: "Barkley", fetch: "Ruffroot" },
        createdAt: now,
      });
    }).toThrow("Fetch not found");
  });
  it("throws an error if pet level doesn't match fetch required level", () => {
    expect(() => {
      fetchPet({
        farmId,
        state: {
          ...INITIAL_FARM,
          pets: {
            common: {
              Barkley: {
                name: "Barkley",
                requests: { food: [], fedAt: now },
                energy: 100,
                experience: 100,
                pettedAt: now,
              },
            },
          },
        },
        action: { type: "pet.fetched", petId: "Barkley", fetch: "Chewed Bone" },
        createdAt: now,
      });
    }).toThrow("Pet level doesn't match fetch required level");
  });
  it("throws an error if pet doesn't have enough energy", () => {
    expect(() => {
      fetchPet({
        farmId,
        state: {
          ...INITIAL_FARM,
          pets: {
            common: {
              Barkley: {
                name: "Barkley",
                requests: { food: [], fedAt: now },
                energy: 0,
                experience: 0,
                pettedAt: now,
              },
            },
          },
        },
        action: { type: "pet.fetched", petId: "Barkley", fetch: "Acorn" },
        createdAt: now,
      });
    }).toThrow("Pet doesn't have enough energy");
  });
  it("fetches the item for the pet and deducts the energy", () => {
    const state = fetchPet({
      farmId,
      state: {
        ...INITIAL_FARM,
        pets: {
          common: {
            Barkley: {
              name: "Barkley",
              requests: { food: [], fedAt: now },
              energy: 100,
              experience: 0,
              pettedAt: now,
            },
          },
        },
      },
      action: { type: "pet.fetched", petId: "Barkley", fetch: "Acorn" },
      createdAt: now,
    });
    const BarkleyData = state.pets?.common?.Barkley;
    expect(BarkleyData?.energy).toBe(0);
    expect(state.inventory["Acorn"]).toEqual(new Decimal(1));
  });

  it("fetches a boost yield", () => {
    function getCounter() {
      let counter = 0;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (
          prngChance({
            farmId,
            itemId: KNOWN_IDS.Acorn,
            counter,
            chance: 10,
            criticalHitName: "Native",
          })
        ) {
          return counter;
        }
        counter++;
      }
    }

    const counter = getCounter();

    const state = fetchPet({
      farmId,
      state: {
        ...INITIAL_FARM,
        pets: {
          common: {
            Barkley: {
              name: "Barkley",
              requests: { food: [], fedAt: now },
              energy: 100,
              experience: 10_500,
              pettedAt: now,
            },
          },
        },
        farmActivity: {
          "Acorn Fetched": counter,
        },
      },
      action: { type: "pet.fetched", petId: "Barkley", fetch: "Acorn" },
      createdAt: now,
    });
    const BarkleyData = state.pets?.common?.Barkley;
    expect(BarkleyData?.energy).toBe(0);
    expect(state.inventory["Acorn"]).toEqual(new Decimal(2));
  });

  it("fetches +1 Acron if Squirrel Onesie is equipped", () => {
    const state = fetchPet({
      state: {
        ...INITIAL_FARM,
        pets: {
          common: {
            Barkley: {
              name: "Barkley",
              requests: { food: [], fedAt: now },
              energy: 100,
              experience: 0,
              pettedAt: now,
            },
          },
        },
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: {
            ...INITIAL_FARM.bumpkin.equipped,
            onesie: "Squirrel Onesie",
          },
        },
      },
      action: { type: "pet.fetched", petId: "Barkley", fetch: "Acorn" },
      farmId,
      createdAt: now,
    });
    expect(state.inventory["Acorn"]).toEqual(new Decimal(2));
  });

  it("increments the counter for the fetch, regardless of the yield", () => {
    const state = fetchPet({
      state: {
        ...INITIAL_FARM,
        pets: {
          common: {
            Barkley: {
              name: "Barkley",
              requests: { food: [], fedAt: now },
              energy: 100,
              experience: 0,
              pettedAt: now,
            },
          },
        },
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: {
            ...INITIAL_FARM.bumpkin.equipped,
            onesie: "Squirrel Onesie",
          },
        },
      },
      action: { type: "pet.fetched", petId: "Barkley", fetch: "Acorn" },
      farmId,
      createdAt: now,
    });

    expect(state.farmActivity["Acorn Fetched"]).toBe(1);
  });
});
