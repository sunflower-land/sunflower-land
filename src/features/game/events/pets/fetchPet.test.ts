import { INITIAL_FARM } from "features/game/lib/constants";
import { fetchPet } from "./fetchPet";
import Decimal from "decimal.js-light";

describe("fetchPet", () => {
  const now = Date.now();
  it("throws an error if pet is not found", () => {
    expect(() => {
      fetchPet({
        state: { ...INITIAL_FARM },
        action: { type: "pet.fetched", pet: "Barkley", fetch: "Acorn" },
        createdAt: now,
      });
    }).toThrow("Pet not found");
  });
  it("throws an error if pet is napping", () => {
    expect(() => {
      fetchPet({
        state: {
          ...INITIAL_FARM,
          pets: {
            common: {
              Barkley: {
                name: "Barkley",
                requests: { food: [] },
                energy: 100,
                experience: 0,
                pettedAt: now - 2 * 60 * 60 * 1000,
              },
            },
          },
        },
        action: { type: "pet.fetched", pet: "Barkley", fetch: "Acorn" },
        createdAt: now,
      });
    }).toThrow("Pet is napping");
  });

  it("throws an error if pet is neglected", () => {
    expect(() => {
      fetchPet({
        state: {
          ...INITIAL_FARM,
          pets: {
            common: {
              Barkley: {
                name: "Barkley",
                requests: { food: [], fedAt: now - 4 * 24 * 60 * 60 * 1000 },
                energy: 100,
                experience: 0,
                pettedAt: now,
              },
            },
          },
        },
        action: { type: "pet.fetched", pet: "Barkley", fetch: "Acorn" },
        createdAt: now,
      });
    }).toThrow("Pet is neglected");
  });

  it("throws an error if fetch is not found", () => {
    expect(() => {
      fetchPet({
        state: {
          ...INITIAL_FARM,
          pets: {
            common: {
              Barkley: {
                name: "Barkley",
                requests: { food: [] },
                energy: 100,
                experience: 0,
                pettedAt: now,
              },
            },
          },
        },
        action: { type: "pet.fetched", pet: "Barkley", fetch: "Ruffroot" },
        createdAt: now,
      });
    }).toThrow("Fetch not found");
  });
  it("throws an error if pet level doesn't match fetch required level", () => {
    expect(() => {
      fetchPet({
        state: {
          ...INITIAL_FARM,
          pets: {
            common: {
              Barkley: {
                name: "Barkley",
                requests: { food: [] },
                energy: 100,
                experience: 100,
                pettedAt: now,
              },
            },
          },
        },
        action: { type: "pet.fetched", pet: "Barkley", fetch: "Chewed Bone" },
        createdAt: now,
      });
    }).toThrow("Pet level doesn't match fetch required level");
  });
  it("throws an error if pet doesn't have enough energy", () => {
    expect(() => {
      fetchPet({
        state: {
          ...INITIAL_FARM,
          pets: {
            common: {
              Barkley: {
                name: "Barkley",
                requests: { food: [] },
                energy: 0,
                experience: 0,
                pettedAt: now,
              },
            },
          },
        },
        action: { type: "pet.fetched", pet: "Barkley", fetch: "Acorn" },
        createdAt: now,
      });
    }).toThrow("Pet doesn't have enough energy");
  });
  it("fetches the item for the pet and deducts the energy", () => {
    const state = fetchPet({
      state: {
        ...INITIAL_FARM,
        pets: {
          common: {
            Barkley: {
              name: "Barkley",
              requests: { food: [] },
              energy: 100,
              experience: 0,
              pettedAt: now,
            },
          },
        },
      },
      action: { type: "pet.fetched", pet: "Barkley", fetch: "Acorn" },
      createdAt: now,
    });
    const BarkleyData = state.pets?.common?.Barkley;
    expect(BarkleyData?.energy).toBe(0);
    expect(state.inventory["Acorn"]).toEqual(new Decimal(1));
  });
});
