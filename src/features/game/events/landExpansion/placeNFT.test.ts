import Decimal from "decimal.js-light";
import { TEST_FARM } from "../../lib/constants";
import { GameState } from "../../types/game";
import { placeNFT } from "./placeNFT";

const GAME_STATE: GameState = TEST_FARM;

describe("Place NFT", () => {
  it("requires the Pet NFT is revealed", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-10-23T00:00:00.000Z"));
    const date = Date.now();

    expect(() =>
      placeNFT({
        state: {
          ...GAME_STATE,
          pets: {
            nfts: {
              1: {
                id: 1,
                name: "Pet #1",
                requests: {
                  food: [],
                  fedAt: date,
                },
                energy: 100,
                experience: 0,
                pettedAt: date,
              },
            },
          },
        },
        action: {
          id: "1",
          type: "nft.placed",
          nft: "Pet",
          coordinates: {
            x: 0,
            y: 0,
          },
          location: "farm",
        },
        createdAt: date,
      }),
    ).toThrow("This Pet NFT is not revealed");

    jest.useRealTimers();
  });

  it("requires the NFT ID is on the game state", () => {
    const date = Date.now();
    expect(() =>
      placeNFT({
        state: {
          ...GAME_STATE,
          inventory: {
            Scarecrow: new Decimal(1),
          },
          buds: {},
        },
        action: {
          id: "1",
          type: "nft.placed",
          nft: "Bud",
          coordinates: {
            x: 0,
            y: 0,
          },
          location: "farm",
        },
        createdAt: date,
      }),
    ).toThrow("This NFT does not exist");
  });

  it("requires the NFT is not already placed", () => {
    const date = Date.now();
    expect(() =>
      placeNFT({
        state: {
          ...GAME_STATE,
          inventory: {
            Scarecrow: new Decimal(1),
          },
          buds: {
            1: {
              aura: "Basic",
              colour: "Green",
              ears: "Ears",
              stem: "3 Leaf Clover",
              type: "Beach",
              coordinates: {
                x: 0,
                y: 0,
              },
            },
          },
        },
        action: {
          id: "1",
          type: "nft.placed",
          nft: "Bud",
          coordinates: {
            x: 0,
            y: 0,
          },
          location: "farm",
        },
        createdAt: date,
      }),
    ).toThrow("This NFT is already placed");
  });

  it("places the NFT", () => {
    const date = Date.now();
    const state = placeNFT({
      state: {
        ...GAME_STATE,
        inventory: {
          "Brazilian Flag": new Decimal(1),
        },
        buds: {
          1: {
            aura: "Basic",
            colour: "Green",
            ears: "Ears",
            stem: "3 Leaf Clover",
            type: "Beach",
          },
        },
      },
      action: {
        id: "1",
        type: "nft.placed",
        nft: "Bud",
        coordinates: {
          x: 0,
          y: 0,
        },
        location: "farm",
      },
      createdAt: date,
    });

    expect(state.buds?.[1].coordinates).toStrictEqual({ x: 0, y: 0 });
  });

  describe("Pet House NFT Capacity", () => {
    it("throws error when pet house is at capacity for NFT pets (level 1)", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2025-11-15T00:00:00.000Z"));
      const date = Date.now();

      expect(() =>
        placeNFT({
          state: {
            ...GAME_STATE,
            petHouse: {
              level: 1,
              pets: {},
            },
            pets: {
              nfts: {
                // 1 NFT pet already placed (level 1 capacity)
                1: {
                  id: 1,
                  name: "Pet #1",
                  requests: { food: [], fedAt: date },
                  energy: 100,
                  experience: 0,
                  pettedAt: date,
                  coordinates: { x: 0, y: 0 },
                  location: "petHouse",
                },
                // Trying to place this one
                2: {
                  id: 2,
                  name: "Pet #2",
                  requests: { food: [], fedAt: date },
                  energy: 100,
                  experience: 0,
                  pettedAt: date,
                },
              },
            },
          },
          action: {
            id: "2",
            type: "nft.placed",
            nft: "Pet",
            coordinates: { x: 2, y: 0 },
            location: "petHouse",
          },
          createdAt: date,
        }),
      ).toThrow("Pet house is at capacity for NFT pets");

      jest.useRealTimers();
    });

    it("allows placing NFT pets when under capacity", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2025-11-15T00:00:00.000Z"));
      const date = Date.now();

      const state = placeNFT({
        state: {
          ...GAME_STATE,
          petHouse: {
            level: 1,
            pets: {},
          },
          pets: {
            nfts: {
              // No NFT pets placed yet (level 1 allows 1)
              1: {
                id: 1,
                name: "Pet #1",
                requests: { food: [], fedAt: date },
                energy: 100,
                experience: 0,
                pettedAt: date,
              },
            },
          },
        },
        action: {
          id: "1",
          type: "nft.placed",
          nft: "Pet",
          coordinates: { x: 0, y: 0 },
          location: "petHouse",
        },
        createdAt: date,
      });

      expect(state.pets?.nfts?.[1].coordinates).toStrictEqual({ x: 0, y: 0 });
      expect(state.pets?.nfts?.[1].location).toBe("petHouse");

      jest.useRealTimers();
    });

    it("allows more NFT pets with higher pet house level", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2025-11-15T00:00:00.000Z"));
      const date = Date.now();

      const state = placeNFT({
        state: {
          ...GAME_STATE,
          petHouse: {
            level: 2, // Level 2 allows 4 NFT pets
            pets: {},
          },
          pets: {
            nfts: {
              // 1 NFT pet already placed
              1: {
                id: 1,
                name: "Pet #1",
                requests: { food: [], fedAt: date },
                energy: 100,
                experience: 0,
                pettedAt: date,
                coordinates: { x: 0, y: 0 },
                location: "petHouse",
              },
              // Placing this one
              2: {
                id: 2,
                name: "Pet #2",
                requests: { food: [], fedAt: date },
                energy: 100,
                experience: 0,
                pettedAt: date,
              },
            },
          },
        },
        action: {
          id: "2",
          type: "nft.placed",
          nft: "Pet",
          coordinates: { x: 2, y: 0 },
          location: "petHouse",
        },
        createdAt: date,
      });

      expect(state.pets?.nfts?.[2].coordinates).toStrictEqual({ x: 2, y: 0 });
      expect(state.pets?.nfts?.[2].location).toBe("petHouse");

      jest.useRealTimers();
    });

    it("throws error when placing second NFT pet of same type in pet house", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2025-11-15T00:00:00.000Z"));
      const date = Date.now();

      expect(() =>
        placeNFT({
          state: {
            ...GAME_STATE,
            petHouse: {
              level: 3, // Level 3 allows 7 NFT pets
              pets: {},
            },
            pets: {
              nfts: {
                // Dragon already placed in pet house
                1: {
                  id: 1,
                  name: "Pet #1",
                  requests: { food: [], fedAt: date },
                  energy: 100,
                  experience: 0,
                  pettedAt: date,
                  traits: {
                    type: "Dragon",
                    fur: "Green",
                    accessory: "Halo",
                    bib: "Baby Bib",
                    aura: "No Aura",
                  },
                  coordinates: { x: 0, y: 0 },
                  location: "petHouse",
                },
                // Second Dragon (same type) - trying to place
                2: {
                  id: 2,
                  name: "Pet #2",
                  requests: { food: [], fedAt: date },
                  energy: 100,
                  experience: 0,
                  pettedAt: date,
                  traits: {
                    type: "Dragon",
                    fur: "Green",
                    accessory: "Halo",
                    bib: "Baby Bib",
                    aura: "No Aura",
                  },
                },
              },
            },
          },
          action: {
            id: "2",
            type: "nft.placed",
            nft: "Pet",
            coordinates: { x: 2, y: 0 },
            location: "petHouse",
          },
          createdAt: date,
        }),
      ).toThrow("A pet of this type is already placed in the pet house");

      jest.useRealTimers();
    });

    it("allows placing NFT pets of different types in pet house", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2025-11-15T00:00:00.000Z"));
      const date = Date.now();

      const state = placeNFT({
        state: {
          ...GAME_STATE,
          petHouse: {
            level: 3,
            pets: {},
          },
          pets: {
            nfts: {
              // Dragon already placed in pet house
              1: {
                id: 1,
                name: "Pet #1",
                requests: { food: [], fedAt: date },
                energy: 100,
                experience: 0,
                pettedAt: date,
                traits: {
                  type: "Dragon",
                  fur: "Green",
                  accessory: "Halo",
                  bib: "Baby Bib",
                  aura: "No Aura",
                },
                coordinates: { x: 0, y: 0 },
                location: "petHouse",
              },
              // Ram (different type) - placing
              2: {
                id: 2,
                name: "Pet #2",
                requests: { food: [], fedAt: date },
                energy: 100,
                experience: 0,
                pettedAt: date,
                traits: {
                  type: "Ram",
                  fur: "Green",
                  accessory: "Halo",
                  bib: "Baby Bib",
                  aura: "No Aura",
                },
              },
            },
          },
        },
        action: {
          id: "2",
          type: "nft.placed",
          nft: "Pet",
          coordinates: { x: 2, y: 0 },
          location: "petHouse",
        },
        createdAt: date,
      });

      expect(state.pets?.nfts?.[2].coordinates).toStrictEqual({ x: 2, y: 0 });
      expect(state.pets?.nfts?.[2].location).toBe("petHouse");

      jest.useRealTimers();
    });

    it("does not check capacity when placing NFT pet on farm", () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date("2025-11-15T00:00:00.000Z"));
      const date = Date.now();

      const state = placeNFT({
        state: {
          ...GAME_STATE,
          petHouse: {
            level: 1,
            pets: {},
          },
          pets: {
            nfts: {
              // 1 NFT pet already placed in pet house (at capacity)
              1: {
                id: 1,
                name: "Pet #1",
                requests: { food: [], fedAt: date },
                energy: 100,
                experience: 0,
                pettedAt: date,
                coordinates: { x: 0, y: 0 },
                location: "petHouse",
              },
              // Placing on farm should work
              2: {
                id: 2,
                name: "Pet #2",
                requests: { food: [], fedAt: date },
                energy: 100,
                experience: 0,
                pettedAt: date,
              },
            },
          },
        },
        action: {
          id: "2",
          type: "nft.placed",
          nft: "Pet",
          coordinates: { x: 10, y: 10 },
          location: "farm",
        },
        createdAt: date,
      });

      expect(state.pets?.nfts?.[2].coordinates).toStrictEqual({ x: 10, y: 10 });
      expect(state.pets?.nfts?.[2].location).toBe("farm");

      jest.useRealTimers();
    });
  });
});
