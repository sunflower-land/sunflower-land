import { INITIAL_FARM } from "features/game/lib/constants";
import { petPet } from "./petPet";

describe("petPet", () => {
  const now = Date.now();
  it("throws an error if pet is not found", () => {
    expect(() => {
      petPet({
        state: { ...INITIAL_FARM },
        action: { type: "pet.pet", petId: "Barkley" },
        createdAt: now,
      });
    }).toThrow("Pet not found");
  });
  it("throws an error if pet is not napping", () => {
    expect(() => {
      petPet({
        state: {
          ...INITIAL_FARM,
          pets: {
            common: {
              Barkley: {
                pettedAt: now,
                name: "Barkley",
                requests: { food: [], fedAt: now },
                energy: 0,
                experience: 0,
              },
            },
          },
        },
        action: { type: "pet.pet", petId: "Barkley" },
        createdAt: now,
      });
    }).toThrow("Pet is not napping");
  });
  it("rewards xp if pet is napping and updates pettedAt", () => {
    const state = petPet({
      state: {
        ...INITIAL_FARM,
        pets: {
          common: {
            Barkley: {
              pettedAt: now - 2 * 60 * 60 * 1000,
              name: "Barkley",
              requests: { food: [], fedAt: now },
              energy: 0,
              experience: 0,
            },
          },
        },
      },
      action: { type: "pet.pet", petId: "Barkley" },
      createdAt: now,
    });
    expect(state.pets?.common?.Barkley?.experience).toBe(10);
    expect(state.pets?.common?.Barkley?.pettedAt).toBe(now);
  });
});
