import { INITIAL_FARM } from "features/game/lib/constants";
import { neglectPet } from "./neglectPet";

describe("neglectPet", () => {
  const now = Date.now();
  it("throws an error if pet is not found", () => {
    expect(() =>
      neglectPet({
        state: { ...INITIAL_FARM },
        action: { type: "pet.neglected", petId: "Barkley" },
        createdAt: now,
      }),
    ).toThrow("Pet not found");
  });
  it("throws an error if pet is not in neglected state", () => {
    expect(() =>
      neglectPet({
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
        action: { type: "pet.neglected", petId: "Barkley" },
        createdAt: now,
      }),
    ).toThrow("Pet is not in neglected state");
  });
  it("should remove xp if pet is in neglected state", () => {
    const state = neglectPet({
      state: {
        ...INITIAL_FARM,
        pets: {
          common: {
            Barkley: {
              name: "Barkley",
              requests: { food: [], fedAt: now - 4 * 24 * 60 * 60 * 1000 },
              energy: 1000,
              experience: 1000,
              pettedAt: now,
            },
          },
        },
      },
      action: { type: "pet.neglected", petId: "Barkley" },
      createdAt: now,
    });

    expect(state.pets?.common?.Barkley?.experience).toBe(500);
    expect(state.pets?.common?.Barkley?.energy).toBe(1000);
    expect(state.pets?.common?.Barkley?.requests.fedAt).toBe(now);
  });
});
