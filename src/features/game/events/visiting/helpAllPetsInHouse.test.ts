import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import type { PetName } from "features/game/types/pets";
import { helpAllPetsInHouse } from "./helpAllPetsInHouse";

const baseVisitor: GameState = { ...INITIAL_FARM };

const basePet = {
  experience: 0,
  energy: 0,
  pettedAt: 0,
  requests: { food: [], fedAt: 0 },
};

const petHousePlaced = {
  "Pet House": [
    {
      id: "ph",
      createdAt: 0,
      readyAt: 0,
      coordinates: { x: 1, y: 1 },
    },
  ],
};

describe("helpAllPetsInHouse", () => {
  const now = Date.now();

  it("throws when help limit is already reached", () => {
    expect(() =>
      helpAllPetsInHouse({
        state: {
          ...INITIAL_FARM,
          buildings: petHousePlaced,
          pets: {
            common: { Barkley: { ...basePet, name: "Barkley" as PetName } },
          },
          petHouse: {
            level: 1,
            pets: {
              Barkley: [
                { id: "1", createdAt: now, coordinates: { x: 0, y: 0 } },
              ],
            },
          },
        },
        visitorState: baseVisitor,
        action: { type: "pet.helpAllPetsInHouse", totalHelpedToday: 10 },
        createdAt: now,
      }),
    ).toThrow("Help limit reached");
  });

  it("throws when Pet House building is not placed", () => {
    expect(() =>
      helpAllPetsInHouse({
        state: {
          ...INITIAL_FARM,
          pets: {
            common: { Barkley: { ...basePet, name: "Barkley" as PetName } },
          },
          petHouse: {
            level: 1,
            pets: {
              Barkley: [
                { id: "1", createdAt: now, coordinates: { x: 0, y: 0 } },
              ],
            },
          },
        },
        visitorState: baseVisitor,
        action: { type: "pet.helpAllPetsInHouse", totalHelpedToday: 0 },
        createdAt: now,
      }),
    ).toThrow("Pet House is not placed");
  });

  it("awards XP and marks all common pets in pet house as visited", () => {
    const [state] = helpAllPetsInHouse({
      state: {
        ...INITIAL_FARM,
        buildings: petHousePlaced,
        pets: {
          common: {
            Barkley: { ...basePet, name: "Barkley" as PetName },
            Meowchi: { ...basePet, name: "Meowchi" as PetName },
          },
        },
        petHouse: {
          level: 1,
          pets: {
            Barkley: [{ id: "1", createdAt: now, coordinates: { x: 0, y: 0 } }],
            Meowchi: [{ id: "2", createdAt: now, coordinates: { x: 1, y: 0 } }],
          },
        },
      },
      visitorState: baseVisitor,
      action: { type: "pet.helpAllPetsInHouse", totalHelpedToday: 0 },
      createdAt: now,
    });

    expect(state.pets?.common?.Barkley?.experience).toEqual(5);
    expect(state.pets?.common?.Barkley?.visitedAt).toEqual(now);
    expect(state.pets?.common?.Meowchi?.experience).toEqual(5);
    expect(state.pets?.common?.Meowchi?.visitedAt).toEqual(now);
  });

  it("skips pets already visited today", () => {
    const [state] = helpAllPetsInHouse({
      state: {
        ...INITIAL_FARM,
        buildings: petHousePlaced,
        pets: {
          common: {
            Barkley: {
              ...basePet,
              name: "Barkley" as PetName,
              visitedAt: now - 1000,
            },
            Meowchi: { ...basePet, name: "Meowchi" as PetName },
          },
        },
        petHouse: {
          level: 1,
          pets: {
            Barkley: [{ id: "1", createdAt: now, coordinates: { x: 0, y: 0 } }],
            Meowchi: [{ id: "2", createdAt: now, coordinates: { x: 1, y: 0 } }],
          },
        },
      },
      visitorState: baseVisitor,
      action: { type: "pet.helpAllPetsInHouse", totalHelpedToday: 0 },
      createdAt: now,
    });

    expect(state.pets?.common?.Barkley?.experience).toEqual(0);
    expect(state.pets?.common?.Meowchi?.experience).toEqual(5);
    expect(state.pets?.common?.Meowchi?.visitedAt).toEqual(now);
  });

  it("awards XP and marks NFT pets in pet house as visited", () => {
    const [state] = helpAllPetsInHouse({
      state: {
        ...INITIAL_FARM,
        buildings: petHousePlaced,
        pets: {
          nfts: {
            1: {
              ...basePet,
              id: 1,
              name: "Pet #1",
              coordinates: { x: 0, y: 0 },
              location: "petHouse" as const,
            },
          },
        },
      },
      visitorState: baseVisitor,
      action: { type: "pet.helpAllPetsInHouse", totalHelpedToday: 0 },
      createdAt: now,
    });

    expect(state.pets?.nfts?.[1]?.experience).toEqual(5);
    expect(state.pets?.nfts?.[1]?.visitedAt).toEqual(now);
  });

  it("skips NFT pets not in the pet house", () => {
    const [state] = helpAllPetsInHouse({
      state: {
        ...INITIAL_FARM,
        buildings: petHousePlaced,
        pets: {
          nfts: {
            1: {
              ...basePet,
              id: 1,
              name: "Pet #1",
              coordinates: { x: 0, y: 0 },
              location: "farm" as const,
            },
          },
        },
      },
      visitorState: baseVisitor,
      action: { type: "pet.helpAllPetsInHouse", totalHelpedToday: 0 },
      createdAt: now,
    });

    expect(state.pets?.nfts?.[1]?.visitedAt).toBeUndefined();
  });

  it("helps all pets in house even when totalHelpedToday is close to the limit", () => {
    const stateWithManyPets = {
      ...INITIAL_FARM,
      inventory: {
        ...INITIAL_FARM.inventory,
        "Pet House": new Decimal(1),
      },
      buildings: petHousePlaced,
      pets: {
        common: {
          Barkley: { ...basePet, name: "Barkley" as PetName },
          Meowchi: { ...basePet, name: "Meowchi" as PetName },
        },
      },
      petHouse: {
        level: 1,
        pets: {
          Barkley: [{ id: "1", createdAt: now, coordinates: { x: 0, y: 0 } }],
          Meowchi: [{ id: "2", createdAt: now, coordinates: { x: 1, y: 0 } }],
        },
      },
    };

    // totalHelpedToday is stale on the client (same as individual pet.visitingPets calls),
    // so all pets in the house should be helped in a single click regardless of proximity to limit.
    const [state] = helpAllPetsInHouse({
      state: stateWithManyPets,
      visitorState: baseVisitor,
      action: { type: "pet.helpAllPetsInHouse", totalHelpedToday: 4 },
      createdAt: now,
    });

    expect(state.pets?.common?.Barkley?.visitedAt).toEqual(now);
    expect(state.pets?.common?.Meowchi?.visitedAt).toEqual(now);
  });
});
