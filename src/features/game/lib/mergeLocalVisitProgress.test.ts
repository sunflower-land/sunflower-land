import { INITIAL_FARM } from "./constants";
import type { GameState } from "../types/game";
import type { PetName } from "../types/pets";
import { mergeLocalVisitProgress } from "./mergeLocalVisitProgress";

const basePet = {
  experience: 0,
  energy: 0,
  pettedAt: 0,
  requests: { food: [], fedAt: 0 },
};

describe("mergeLocalVisitProgress", () => {
  it("carries over a pet's local visitedAt when the fresh snapshot has none", () => {
    const localState: GameState = {
      ...INITIAL_FARM,
      pets: {
        common: {
          Barkley: { ...basePet, name: "Barkley" as PetName, visitedAt: 123 },
        },
      },
    };

    const freshState: GameState = {
      ...INITIAL_FARM,
      pets: {
        common: {
          Barkley: { ...basePet, name: "Barkley" as PetName },
        },
      },
    };

    const merged = mergeLocalVisitProgress(freshState, localState);

    expect(merged.pets?.common?.Barkley?.visitedAt).toEqual(123);
  });

  it("does not overwrite a fresh visitedAt with a missing local one", () => {
    const localState: GameState = {
      ...INITIAL_FARM,
      pets: {
        common: {
          Barkley: { ...basePet, name: "Barkley" as PetName },
        },
      },
    };

    const freshState: GameState = {
      ...INITIAL_FARM,
      pets: {
        common: {
          Barkley: { ...basePet, name: "Barkley" as PetName, visitedAt: 456 },
        },
      },
    };

    const merged = mergeLocalVisitProgress(freshState, localState);

    expect(merged.pets?.common?.Barkley?.visitedAt).toEqual(456);
  });

  it("does not regress a fresher server visitedAt with an older local one", () => {
    const localState: GameState = {
      ...INITIAL_FARM,
      pets: {
        common: {
          // Stale local progress from before the visitor's session started.
          Barkley: { ...basePet, name: "Barkley" as PetName, visitedAt: 100 },
        },
      },
    };

    const freshState: GameState = {
      ...INITIAL_FARM,
      pets: {
        common: {
          // Server has a newer help record (e.g. help recorded through
          // another client) than the local one.
          Barkley: { ...basePet, name: "Barkley" as PetName, visitedAt: 999 },
        },
      },
    };

    const merged = mergeLocalVisitProgress(freshState, localState);

    expect(merged.pets?.common?.Barkley?.visitedAt).toEqual(999);
  });

  it("carries over NFT pet visitedAt", () => {
    const localState: GameState = {
      ...INITIAL_FARM,
      pets: {
        nfts: {
          1: {
            ...basePet,
            id: 1,
            name: "Pet #1",
            coordinates: { x: 0, y: 0 },
            location: "petHouse",
            visitedAt: 789,
          },
        },
      },
    };

    const freshState: GameState = {
      ...INITIAL_FARM,
      pets: {
        nfts: {
          1: {
            ...basePet,
            id: 1,
            name: "Pet #1",
            coordinates: { x: 0, y: 0 },
            location: "petHouse",
          },
        },
      },
    };

    const merged = mergeLocalVisitProgress(freshState, localState);

    expect(merged.pets?.nfts?.[1]?.visitedAt).toEqual(789);
  });

  it("carries over a village project's local helpedAt", () => {
    const localState: GameState = {
      ...INITIAL_FARM,
      socialFarming: {
        ...INITIAL_FARM.socialFarming,
        villageProjects: {
          "Farmer's Monument": { cheers: 3, helpedAt: 111 },
        },
      },
    };

    const freshState: GameState = {
      ...INITIAL_FARM,
      socialFarming: {
        ...INITIAL_FARM.socialFarming,
        villageProjects: {
          "Farmer's Monument": { cheers: 2 },
        },
      },
    };

    const merged = mergeLocalVisitProgress(freshState, localState);

    expect(
      merged.socialFarming.villageProjects["Farmer's Monument"]?.helpedAt,
    ).toEqual(111);
    // Fresh cheers count (from server) is preserved, not overwritten.
    expect(
      merged.socialFarming.villageProjects["Farmer's Monument"]?.cheers,
    ).toEqual(2);
  });

  it("does not regress a fresher server helpedAt with an older local one", () => {
    const localState: GameState = {
      ...INITIAL_FARM,
      socialFarming: {
        ...INITIAL_FARM.socialFarming,
        villageProjects: {
          "Farmer's Monument": { cheers: 1, helpedAt: 100 },
        },
      },
    };

    const freshState: GameState = {
      ...INITIAL_FARM,
      socialFarming: {
        ...INITIAL_FARM.socialFarming,
        villageProjects: {
          "Farmer's Monument": { cheers: 4, helpedAt: 999 },
        },
      },
    };

    const merged = mergeLocalVisitProgress(freshState, localState);

    expect(
      merged.socialFarming.villageProjects["Farmer's Monument"]?.helpedAt,
    ).toEqual(999);
  });

  it("leaves pets untouched when there is no local progress to merge", () => {
    const localState: GameState = {
      ...INITIAL_FARM,
      pets: { common: {} },
    };

    const freshState: GameState = {
      ...INITIAL_FARM,
      pets: {
        common: {
          Barkley: { ...basePet, name: "Barkley" as PetName },
        },
      },
    };

    const merged = mergeLocalVisitProgress(freshState, localState);

    expect(merged.pets?.common?.Barkley?.visitedAt).toBeUndefined();
  });
});
