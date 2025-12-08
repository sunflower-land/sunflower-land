import { INITIAL_FARM } from "features/game/lib/constants";
import { neglectPet } from "./neglectPet";
import { isPetNeglected } from "features/game/types/pets";

describe("neglectPet", () => {
  describe("isPetNeglected", () => {
    it("returns false if pet is undefined", () => {
      const now = Date.now();
      expect(isPetNeglected(undefined, now)).toBe(false);
    });

    it("returns false if pet has no experience", () => {
      const now = Date.now();
      const pet = {
        name: "Barkley" as const,
        requests: {
          food: [],
          fedAt: now,
        },
        energy: 0,
        experience: 0,
        pettedAt: now,
      };

      expect(isPetNeglected(pet, now)).toBe(false);
    });

    it("returns false if pet has negative experience", () => {
      const now = Date.now();
      const pet = {
        name: "Barkley" as const,
        requests: {
          food: [],
          fedAt: now - 4 * 24 * 60 * 60 * 1000,
        },
        energy: 0,
        experience: -10,
        pettedAt: now,
      };

      expect(isPetNeglected(pet, now)).toBe(false);
    });

    describe("common pets", () => {
      it("returns false if common pet was fed within 3 days", () => {
        const now = new Date("2025-01-10T12:00:00.000Z").getTime();
        const twoDaysAgo = new Date("2025-01-08T12:00:00.000Z").getTime();

        const pet = {
          name: "Barkley" as const,
          requests: {
            food: [],
            fedAt: twoDaysAgo,
          },
          energy: 0,
          experience: 100,
          pettedAt: now,
        };

        expect(isPetNeglected(pet, now)).toBe(false);
      });

      it("returns false if common pet was fed exactly 3 days ago", () => {
        const now = new Date("2025-01-10T12:00:00.000Z").getTime();
        const threeDaysAgo = new Date("2025-01-07T12:00:00.000Z").getTime();

        const pet = {
          name: "Barkley" as const,
          requests: {
            food: [],
            fedAt: threeDaysAgo,
          },
          energy: 0,
          experience: 100,
          pettedAt: now,
        };

        expect(isPetNeglected(pet, now)).toBe(false);
      });

      it("returns true if common pet was fed more than 3 days ago", () => {
        const now = new Date("2025-01-10T12:00:00.000Z").getTime();
        const fourDaysAgo = new Date("2025-01-06T12:00:00.000Z").getTime();

        const pet = {
          name: "Barkley" as const,
          requests: {
            food: [],
            fedAt: fourDaysAgo,
          },
          energy: 0,
          experience: 100,
          pettedAt: now,
        };

        expect(isPetNeglected(pet, now)).toBe(true);
      });

      it("returns true if common pet was fed 4 days ago (crossing day boundary)", () => {
        const now = new Date("2025-01-10T00:00:00.000Z").getTime();
        const fourDaysAgo = new Date("2025-01-06T23:59:59.000Z").getTime();

        const pet = {
          name: "Barkley" as const,
          requests: {
            food: [],
            fedAt: fourDaysAgo,
          },
          energy: 0,
          experience: 100,
          pettedAt: now,
        };

        expect(isPetNeglected(pet, now)).toBe(true);
      });
    });

    describe("NFT pets", () => {
      it("returns false if NFT pet was fed within 7 days", () => {
        const now = new Date("2025-01-10T12:00:00.000Z").getTime();
        const fiveDaysAgo = new Date("2025-01-05T12:00:00.000Z").getTime();

        const pet = {
          id: 1,
          name: "Pet #1" as const,
          requests: {
            food: [],
            fedAt: fiveDaysAgo,
          },
          energy: 0,
          experience: 100,
          pettedAt: now,
        };

        expect(isPetNeglected(pet, now)).toBe(false);
      });

      it("returns false if NFT pet was fed exactly 7 days ago", () => {
        const now = new Date("2025-01-10T12:00:00.000Z").getTime();
        const sevenDaysAgo = new Date("2025-01-03T12:00:00.000Z").getTime();

        const pet = {
          id: 1,
          name: "Pet #1" as const,
          requests: {
            food: [],
            fedAt: sevenDaysAgo,
          },
          energy: 0,
          experience: 100,
          pettedAt: now,
        };

        expect(isPetNeglected(pet, now)).toBe(false);
      });

      it("returns true if NFT pet was fed more than 7 days ago", () => {
        const now = new Date("2025-01-10T12:00:00.000Z").getTime();
        const eightDaysAgo = new Date("2025-01-02T12:00:00.000Z").getTime();

        const pet = {
          id: 1,
          name: "Pet #1" as const,
          requests: {
            food: [],
            fedAt: eightDaysAgo,
          },
          energy: 0,
          experience: 100,
          pettedAt: now,
        };

        expect(isPetNeglected(pet, now)).toBe(true);
      });

      it("returns true if NFT pet was fed 8 days ago (crossing day boundary)", () => {
        const now = new Date("2025-01-10T00:00:00.000Z").getTime();
        const eightDaysAgo = new Date("2025-01-02T23:59:59.000Z").getTime();

        const pet = {
          id: 1,
          name: "Pet #1" as const,
          requests: {
            food: [],
            fedAt: eightDaysAgo,
          },
          energy: 0,
          experience: 100,
          pettedAt: now,
        };

        expect(isPetNeglected(pet, now)).toBe(true);
      });

      it("returns false if NFT pet was last cheered 3 days ago, even if fedAt was more than 7 days ago", () => {
        const now = new Date("2025-01-10T12:00:00.000Z").getTime();
        const threeDaysAgo = new Date("2025-01-07T12:00:00.000Z").getTime();
        const eightDaysAgo = new Date("2025-01-02T12:00:00.000Z").getTime();

        const pet = {
          id: 1,
          name: "Pet #1" as const,
          requests: {
            food: [],
            fedAt: eightDaysAgo,
          },
          energy: 0,
          experience: 100,
          pettedAt: now,
          cheeredAt: threeDaysAgo,
        };
        expect(isPetNeglected(pet, now)).toBe(false);
      });
    });

    it("handles date boundaries correctly (midnight)", () => {
      const now = new Date("2025-01-10T00:00:00.000Z").getTime();
      const fourDaysAgo = new Date("2025-01-06T00:00:00.000Z").getTime();

      const pet = {
        name: "Barkley" as const,
        requests: {
          food: [],
          fedAt: fourDaysAgo,
        },
        energy: 0,
        experience: 100,
        pettedAt: now,
      };

      expect(isPetNeglected(pet, now)).toBe(true);
    });

    it("uses current time when createdAt is not provided", () => {
      const now = Date.now();
      const pet = {
        name: "Barkley" as const,
        requests: {
          food: [],
          fedAt: now - 4 * 24 * 60 * 60 * 1000, // 4 days ago
        },
        energy: 0,
        experience: 100,
        pettedAt: now,
      };

      expect(isPetNeglected(pet, now)).toBe(true);
    });
  });

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
                requests: { food: [], fedAt: now },
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
    expect(state.pets?.common?.Barkley?.cheeredAt).toBe(now);
  });
});
