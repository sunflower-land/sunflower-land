import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import type { Pet, PetName } from "features/game/types/pets";
import { bulkFetchPets, type BulkFetchPetsAction } from "./bulkFetchPets";

const now = Date.now();

const makePet = (name: PetName, overrides: Partial<Pet> = {}): Pet => ({
  name,
  requests: { food: [], fedAt: now },
  energy: 500,
  experience: 0,
  pettedAt: now,
  ...overrides,
});

describe("bulkFetchPets", () => {
  it("fetches a resource multiple times from a single pet", () => {
    const state: GameState = {
      ...INITIAL_FARM,
      inventory: {},
      pets: { common: { Barkley: makePet("Barkley", { energy: 300 }) } },
    };
    const action: BulkFetchPetsAction = {
      type: "pets.bulkFetch",
      fetches: [{ petId: "Barkley", fetch: "Acorn", amount: 3 }],
    };

    const result = bulkFetchPets({ state, action, createdAt: now });

    expect(result.inventory.Acorn).toEqual(new Decimal(3));
    expect(result.pets?.common?.Barkley?.energy).toEqual(0);
  });

  it("stops fetching once the pet runs out of energy (amount is an upper bound)", () => {
    const state: GameState = {
      ...INITIAL_FARM,
      inventory: {},
      pets: { common: { Barkley: makePet("Barkley", { energy: 250 }) } },
    };
    const action: BulkFetchPetsAction = {
      type: "pets.bulkFetch",
      fetches: [{ petId: "Barkley", fetch: "Acorn", amount: 5 }],
    };

    const result = bulkFetchPets({ state, action, createdAt: now });

    // Acorn costs 100 energy: only 2 of the 5 requested fit into 250 energy.
    expect(result.inventory.Acorn).toEqual(new Decimal(2));
    expect(result.pets?.common?.Barkley?.energy).toEqual(50);
  });

  it("applies fetches across multiple pets", () => {
    const state: GameState = {
      ...INITIAL_FARM,
      inventory: {},
      pets: {
        common: {
          Barkley: makePet("Barkley", { energy: 200 }),
          Meowchi: makePet("Meowchi", { energy: 200 }),
        },
      },
    };
    const action: BulkFetchPetsAction = {
      type: "pets.bulkFetch",
      fetches: [
        { petId: "Barkley", fetch: "Acorn", amount: 2 },
        { petId: "Meowchi", fetch: "Acorn", amount: 2 },
      ],
    };

    const result = bulkFetchPets({ state, action, createdAt: now });

    expect(result.inventory.Acorn).toEqual(new Decimal(4));
    expect(result.pets?.common?.Barkley?.energy).toEqual(0);
    expect(result.pets?.common?.Meowchi?.energy).toEqual(0);
  });

  it("skips invalid entries but still applies valid ones", () => {
    const state: GameState = {
      ...INITIAL_FARM,
      inventory: {},
      pets: { common: { Barkley: makePet("Barkley", { energy: 200 }) } },
    };
    const action: BulkFetchPetsAction = {
      type: "pets.bulkFetch",
      fetches: [
        // Cloudy is a valid pet name but not owned -> fetchPet throws, is swallowed.
        { petId: "Cloudy", fetch: "Acorn", amount: 1 },
        { petId: "Barkley", fetch: "Acorn", amount: 1 },
      ],
    };

    expect(() =>
      bulkFetchPets({ state, action, createdAt: now }),
    ).not.toThrow();

    const result = bulkFetchPets({ state, action, createdAt: now });
    expect(result.inventory.Acorn).toEqual(new Decimal(1));
    expect(result.pets?.common?.Barkley?.energy).toEqual(100);
  });

  it("tracks farm activity for fetched resources", () => {
    const state: GameState = {
      ...INITIAL_FARM,
      inventory: {},
      pets: { common: { Barkley: makePet("Barkley", { energy: 200 }) } },
    };
    const action: BulkFetchPetsAction = {
      type: "pets.bulkFetch",
      fetches: [{ petId: "Barkley", fetch: "Acorn", amount: 2 }],
    };

    const result = bulkFetchPets({ state, action, createdAt: now });

    expect(result.farmActivity["Acorn Fetched"]).toEqual(2);
  });
});
