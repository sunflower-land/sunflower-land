import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { helpPets } from "./helpPets";

const baseVisitor: GameState = {
  ...INITIAL_FARM,
};

const basePet = {
  experience: 0,
  energy: 0,
  pettedAt: 0,
  requests: { food: [], fedAt: 0 },
};

describe("helpPets", () => {
  const now = Date.now();

  it("awards XP for a common pet placed on the farm", () => {
    const [state] = helpPets({
      state: {
        ...INITIAL_FARM,
        collectibles: {
          Barkley: [
            {
              id: "1",
              createdAt: now,
              coordinates: { x: 0, y: 0 },
              readyAt: now,
            },
          ],
        },
        pets: {
          common: {
            Barkley: { ...basePet, name: "Barkley" },
          },
        },
      },
      visitorState: baseVisitor,
      action: { type: "pet.visitingPets", pet: "Barkley", totalHelpedToday: 0 },
      createdAt: now,
    });

    expect(state.pets?.common?.Barkley?.experience).toEqual(5);
  });

  it("throws when helping a common pet that only lives in a missing Pet House", () => {
    expect(() =>
      helpPets({
        state: {
          ...INITIAL_FARM,
          inventory: {
            ...INITIAL_FARM.inventory,
            Barkley: new Decimal(1),
          },
          pets: {
            common: {
              Barkley: { ...basePet, name: "Barkley" },
            },
          },
          petHouse: {
            level: 1,
            pets: {
              Barkley: [
                { id: "1", createdAt: now, coordinates: { x: 0, y: 0 } },
              ],
            },
          },
          // No buildings["Pet House"]
        },
        visitorState: baseVisitor,
        action: {
          type: "pet.visitingPets",
          pet: "Barkley",
          totalHelpedToday: 0,
        },
        createdAt: now,
      }),
    ).toThrow("Pet House is not placed");
  });

  it("awards XP for a common pet in the Pet House when the Pet House is placed", () => {
    const [state] = helpPets({
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Barkley: new Decimal(1),
          "Pet House": new Decimal(1),
        },
        buildings: {
          "Pet House": [
            {
              id: "ph",
              createdAt: now,
              readyAt: now,
              coordinates: { x: 1, y: 1 },
            },
          ],
        },
        pets: {
          common: {
            Barkley: { ...basePet, name: "Barkley" },
          },
        },
        petHouse: {
          level: 1,
          pets: {
            Barkley: [{ id: "1", createdAt: now, coordinates: { x: 0, y: 0 } }],
          },
        },
      },
      visitorState: baseVisitor,
      action: { type: "pet.visitingPets", pet: "Barkley", totalHelpedToday: 0 },
      createdAt: now,
    });

    expect(state.pets?.common?.Barkley?.experience).toEqual(5);
  });

  it("throws when helping an NFT pet inside a missing Pet House", () => {
    expect(() =>
      helpPets({
        state: {
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
        },
        visitorState: baseVisitor,
        action: { type: "pet.visitingPets", pet: 1, totalHelpedToday: 0 },
        createdAt: now,
      }),
    ).toThrow("Pet House is not placed");
  });
});
