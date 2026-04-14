import {
  EXPIRY_COOLDOWNS,
  isTemporaryCollectibleActive,
} from "features/game/lib/collectibleBuilt";
import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { PET_SHRINES } from "features/game/types/pets";
import { renewPetShrine } from "./renewPetShrine";

describe("renewPetShrine", () => {
  const now = Date.now();
  it("requires that the pet shrine is placed", () => {
    expect(() =>
      renewPetShrine({
        state: {
          ...INITIAL_FARM,
          collectibles: {},
        },
        action: {
          type: "petShrine.renewed",
          name: "Fox Shrine",
          location: "farm",
          id: "1",
        },
        createdAt: now,
      }),
    ).toThrow("Invalid collectible");
  });

  it("requires that the pet shrine id matches the one in the state", () => {
    expect(() =>
      renewPetShrine({
        state: {
          ...INITIAL_FARM,
          collectibles: {
            "Fox Shrine": [
              {
                id: "2",
                createdAt: now,
                coordinates: { x: 1, y: 1 },
                readyAt: now,
              },
            ],
          },
        },
        action: {
          type: "petShrine.renewed",
          name: "Fox Shrine",
          location: "farm",
          id: "1",
        },
        createdAt: now,
      }),
    ).toThrow("Collectible does not exist");
  });

  it("requires the pet shrine is not already active", () => {
    expect(() =>
      renewPetShrine({
        state: {
          ...INITIAL_FARM,
          collectibles: {
            "Fox Shrine": [
              {
                id: "1",
                createdAt: now,
                coordinates: { x: 1, y: 1 },
                readyAt: now,
              },
            ],
          },
        },
        action: {
          type: "petShrine.renewed",
          name: "Fox Shrine",
          location: "farm",
          id: "1",
        },
        createdAt: now,
      }),
    ).toThrow("Collectible is still active");
  });

  const foxShrineCreatedAt = now - EXPIRY_COOLDOWNS["Fox Shrine"];

  it("requires that the player has enough ingredients", () => {
    expect(() =>
      renewPetShrine({
        state: {
          ...INITIAL_FARM,
          collectibles: {
            "Fox Shrine": [
              {
                id: "1",
                createdAt: foxShrineCreatedAt,
                coordinates: { x: 1, y: 1 },
                readyAt: foxShrineCreatedAt,
              },
            ],
          },
        },
        action: {
          type: "petShrine.renewed",
          name: "Fox Shrine",
          location: "farm",
          id: "1",
        },
        createdAt: now,
      }),
    ).toThrow("Insufficient ingredient: Acorn");
  });

  it("ensures that the cooldown is renewed", () => {
    const state: GameState = {
      ...INITIAL_FARM,
      collectibles: {
        "Fox Shrine": [
          {
            id: "1",
            createdAt: foxShrineCreatedAt,
            coordinates: { x: 1, y: 1 },
            readyAt: foxShrineCreatedAt,
          },
        ],
      },
      inventory: {
        ...PET_SHRINES["Fox Shrine"].ingredients,
      },
    };

    expect(
      isTemporaryCollectibleActive({ name: "Fox Shrine", game: state }),
    ).toBe(false);

    const newState = renewPetShrine({
      state,
      action: {
        type: "petShrine.renewed",
        name: "Fox Shrine",
        location: "farm",
        id: "1",
      },
      createdAt: now,
    });
    const foxShrine = newState.collectibles["Fox Shrine"]?.find(
      (collectible) => collectible.id === "1",
    );
    expect(foxShrine?.createdAt).toBe(now);

    expect(
      isTemporaryCollectibleActive({ name: "Fox Shrine", game: newState }),
    ).toBe(true);
  });
});
