import {
  isTemporaryCollectibleActive,
  isCollectibleBuilt,
  EXPIRY_COOLDOWNS,
} from "./collectibleBuilt";
import { TEST_FARM } from "./constants";

describe("isCollectibleBuilt", () => {
  it("returns true if collectible is ready on island", () => {
    const isBuilt = isCollectibleBuilt({
      game: {
        ...TEST_FARM,
        collectibles: {
          "Abandoned Bear": [
            {
              id: "123",
              coordinates: { x: 1, y: 1 },
              createdAt: Date.now() - 10000,
              readyAt: Date.now() - 10000,
            },
          ],
        },
      },
      name: "Abandoned Bear",
    });

    expect(isBuilt).toBe(true);
  });

  it("returns true if collectible is ready in home", () => {
    const isBuilt = isCollectibleBuilt({
      game: {
        ...TEST_FARM,
        home: {
          collectibles: {
            "Abandoned Bear": [
              {
                id: "123",
                coordinates: { x: 1, y: 1 },
                createdAt: Date.now() - 10000,
                readyAt: Date.now() - 10000,
              },
            ],
          },
        },
      },
      name: "Abandoned Bear",
    });

    expect(isBuilt).toBe(true);
  });

  it("returns false if collectible is placed, but not ready", () => {
    const isBuilt = isCollectibleBuilt({
      game: {
        ...TEST_FARM,
        home: {
          collectibles: {
            "Abandoned Bear": [
              {
                id: "123",
                coordinates: { x: 1, y: 1 },
                createdAt: Date.now() - 10000,
                readyAt: Date.now() + 10000,
              },
            ],
          },
        },
      },
      name: "Abandoned Bear",
    });

    expect(isBuilt).toBe(false);
  });

  it("returns false if collectible is not placed", () => {
    const isBuilt = isCollectibleBuilt({
      game: {
        ...TEST_FARM,
      },
      name: "Abandoned Bear",
    });

    expect(isBuilt).toBe(false);
  });
});

describe("isCollectibleBuilt", () => {
  it("returns true if collectible is active on island", () => {
    const isBuilt = isTemporaryCollectibleActive({
      game: {
        ...TEST_FARM,
        collectibles: {
          "Time Warp Totem": [
            {
              id: "123",
              coordinates: { x: 1, y: 1 },
              createdAt: Date.now() - 10000,
              readyAt: Date.now(),
            },
          ],
        },
      },
      name: "Time Warp Totem",
      now: Date.now(),
    });

    expect(isBuilt).toBe(true);
  });

  it("returns true if collectible is active in home", () => {
    const isBuilt = isTemporaryCollectibleActive({
      game: {
        ...TEST_FARM,
        home: {
          collectibles: {
            "Time Warp Totem": [
              {
                id: "123",
                coordinates: { x: 1, y: 1 },
                createdAt: Date.now() - 10000,
                readyAt: Date.now(),
              },
            ],
          },
        },
      },
      name: "Time Warp Totem",
      now: Date.now(),
    });

    expect(isBuilt).toBe(true);
  });

  it("returns false if collectible is placed, but not active", () => {
    const isBuilt = isTemporaryCollectibleActive({
      game: {
        ...TEST_FARM,
        home: {
          collectibles: {
            "Time Warp Totem": [
              {
                id: "123",
                coordinates: { x: 1, y: 1 },
                // Older than the Time Warp Totem window so it reads as expired.
                createdAt: Date.now() - 5 * 60 * 60 * 1000,
                readyAt: Date.now() + 10000,
              },
            ],
          },
        },
      },
      name: "Time Warp Totem",
      now: Date.now(),
    });

    expect(isBuilt).toBe(false);
  });

  it("returns false if collectible is not placed", () => {
    const isBuilt = isTemporaryCollectibleActive({
      game: {
        ...TEST_FARM,
      },
      name: "Time Warp Totem",

      now: Date.now(),
    });

    expect(isBuilt).toBe(false);
  });
});

describe("Super Totem Built", () => {
  it("returns true if collectible is active on island", () => {
    const isBuilt = isTemporaryCollectibleActive({
      game: {
        ...TEST_FARM,
        collectibles: {
          "Super Totem": [
            {
              id: "123",
              coordinates: { x: 1, y: 1 },
              createdAt: Date.now() - 10000,
              readyAt: Date.now(),
            },
          ],
        },
      },
      name: "Super Totem",
      now: Date.now(),
    });

    expect(isBuilt).toBe(true);
  });

  it("returns true if collectible is active in home", () => {
    const isBuilt = isTemporaryCollectibleActive({
      game: {
        ...TEST_FARM,
        home: {
          collectibles: {
            "Super Totem": [
              {
                id: "123",
                coordinates: { x: 1, y: 1 },
                createdAt: Date.now() - 10000,
                readyAt: Date.now(),
              },
            ],
          },
        },
      },
      name: "Super Totem",
      now: Date.now(),
    });

    expect(isBuilt).toBe(true);
  });

  it("returns false if collectible is placed, but not active", () => {
    const isBuilt = isTemporaryCollectibleActive({
      game: {
        ...TEST_FARM,
        home: {
          collectibles: {
            "Super Totem": [
              {
                id: "123",
                coordinates: { x: 1, y: 1 },
                createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
                readyAt: Date.now() + 10000,
              },
            ],
          },
        },
      },
      name: "Super Totem",
      now: Date.now(),
    });

    expect(isBuilt).toBe(false);
  });

  it("returns false if collectible is not placed", () => {
    const isBuilt = isTemporaryCollectibleActive({
      game: {
        ...TEST_FARM,
      },
      name: "Super Totem",

      now: Date.now(),
    });

    expect(isBuilt).toBe(false);
  });

  it("returns false if a placed weather collectible has been used", () => {
    const isBuilt = isCollectibleBuilt({
      game: {
        ...TEST_FARM,
        collectibles: {
          "Tornado Pinwheel": [
            {
              id: "123",
              coordinates: { x: 1, y: 1 },
              readyAt: Date.now() - 10000,
              used: true,
            },
          ],
        },
      },
      name: "Tornado Pinwheel",
    });

    expect(isBuilt).toBe(false);
  });
});

describe("EXPIRY_COOLDOWNS", () => {
  it("pins the boost durations", () => {
    expect(EXPIRY_COOLDOWNS["Harvest Hourglass"]).toBe(9 * 60 * 60 * 1000);
    expect(EXPIRY_COOLDOWNS["Ore Hourglass"]).toBe(5 * 60 * 60 * 1000);
    expect(EXPIRY_COOLDOWNS["Orchard Hourglass"]).toBe(8 * 60 * 60 * 1000);
    expect(EXPIRY_COOLDOWNS["Blossom Hourglass"]).toBe(12 * 60 * 60 * 1000);
    expect(EXPIRY_COOLDOWNS["Gourmet Hourglass"]).toBe(6 * 60 * 60 * 1000);
    expect(EXPIRY_COOLDOWNS["Time Warp Totem"]).toBe(4 * 60 * 60 * 1000);

    // Unchanged boosters keep their original durations.
    expect(EXPIRY_COOLDOWNS["Timber Hourglass"]).toBe(4 * 60 * 60 * 1000);
    expect(EXPIRY_COOLDOWNS["Sparrow Shrine"]).toBe(7 * 24 * 60 * 60 * 1000);
  });
});
