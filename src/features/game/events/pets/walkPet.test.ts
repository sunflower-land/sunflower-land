import { INITIAL_FARM } from "features/game/lib/constants";
import { getPetTraits } from "features/pets/data/getPetTraits";
import { walkPet } from "./walkPet";

describe("walkPet", () => {
  it("throws an error if pet is not found", () => {
    expect(() => {
      walkPet({
        state: { ...INITIAL_FARM },
        action: { type: "pet.walked", petId: 1 },
      });
    }).toThrow("Pet not found");
  });

  it("unsets the pet from walking if it is already walking", () => {
    const state = walkPet({
      state: {
        ...INITIAL_FARM,
        pets: {
          nfts: {
            1: {
              id: 1,
              name: "Pet #1",
              walking: true,
              traits: getPetTraits(1),
              requests: {
                food: [],
                fedAt: Date.now(),
              },
              energy: 100,
              experience: 100,
              pettedAt: Date.now(),
            },
          },
        },
      },
      action: { type: "pet.walked", petId: 1 },
    });
    expect(state.pets?.nfts?.[1]?.walking).toBe(false);
  });

  it("sets the pet to walking and unsets the current walking pet", () => {
    const state = walkPet({
      state: {
        ...INITIAL_FARM,
        pets: {
          nfts: {
            1: {
              id: 1,
              name: "Pet #1",
              walking: false,
              traits: getPetTraits(1),
              requests: {
                food: [],
                fedAt: Date.now(),
              },
              energy: 100,
              experience: 100,
              pettedAt: Date.now(),
            },
            2: {
              id: 2,
              name: "Pet #2",
              walking: true,
              traits: getPetTraits(2),
              requests: {
                food: [],
                fedAt: Date.now(),
              },
              energy: 100,
              experience: 100,
              pettedAt: Date.now(),
            },
          },
        },
      },
      action: { type: "pet.walked", petId: 1 },
    });
    expect(state.pets?.nfts?.[1]?.walking).toBe(true);
    expect(state.pets?.nfts?.[2]?.walking).toBe(false);
  });
});
