import {
  isTemporaryCollectibleActive,
  isCollectibleBuilt,
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
                createdAt: Date.now() - 3 * 60 * 60 * 1000,
                readyAt: Date.now() + 10000,
              },
            ],
          },
        },
      },
      name: "Time Warp Totem",
    });

    expect(isBuilt).toBe(false);
  });

  it("returns false if collectible is not placed", () => {
    const isBuilt = isTemporaryCollectibleActive({
      game: {
        ...TEST_FARM,
      },
      name: "Time Warp Totem",
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
    });

    expect(isBuilt).toBe(false);
  });

  it("returns false if collectible is not placed", () => {
    const isBuilt = isTemporaryCollectibleActive({
      game: {
        ...TEST_FARM,
      },
      name: "Super Totem",
    });

    expect(isBuilt).toBe(false);
  });
});
