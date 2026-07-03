import {
  isTemporaryCollectibleActive,
  isCollectibleBuilt,
  getExpiryCooldown,
  EXPIRY_COOLDOWNS,
} from "./collectibleBuilt";
import { TEST_FARM } from "./constants";
import { CONFIG } from "lib/config";
import type { GameState } from "features/game/types/game";

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
                // Older than the (flag-on) Time Warp Totem window so it reads as expired.
                createdAt: Date.now() - 5 * 60 * 60 * 1000,
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

describe("getExpiryCooldown", () => {
  const setNetwork = (network: "mainnet" | "amoy") =>
    ((CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = network);
  const originalNetwork = CONFIG.NETWORK;
  // Restore after every test so the suite stays order-independent (tests below
  // set their own network explicitly).
  afterEach(() => setNetwork(originalNetwork));

  it("returns the rebalanced durations under SPEED_BOOSTS", () => {
    setNetwork("amoy");

    expect(getExpiryCooldown("Harvest Hourglass", TEST_FARM)).toBe(
      9 * 60 * 60 * 1000,
    );
    expect(getExpiryCooldown("Ore Hourglass", TEST_FARM)).toBe(
      5 * 60 * 60 * 1000,
    );
    expect(getExpiryCooldown("Orchard Hourglass", TEST_FARM)).toBe(
      8 * 60 * 60 * 1000,
    );
    expect(getExpiryCooldown("Blossom Hourglass", TEST_FARM)).toBe(
      12 * 60 * 60 * 1000,
    );
    expect(getExpiryCooldown("Gourmet Hourglass", TEST_FARM)).toBe(
      6 * 60 * 60 * 1000,
    );
    expect(getExpiryCooldown("Time Warp Totem", TEST_FARM)).toBe(
      4 * 60 * 60 * 1000,
    );

    // Unchanged boosters fall through to the legacy value.
    expect(getExpiryCooldown("Timber Hourglass", TEST_FARM)).toBe(
      EXPIRY_COOLDOWNS["Timber Hourglass"],
    );
    expect(getExpiryCooldown("Sparrow Shrine", TEST_FARM)).toBe(
      EXPIRY_COOLDOWNS["Sparrow Shrine"],
    );
  });

  it("keeps the legacy durations when SPEED_BOOSTS is off", () => {
    setNetwork("mainnet");
    const game = { ...TEST_FARM, username: "not-a-team-member" };

    expect(getExpiryCooldown("Harvest Hourglass", game)).toBe(
      EXPIRY_COOLDOWNS["Harvest Hourglass"],
    );
    expect(getExpiryCooldown("Blossom Hourglass", game)).toBe(
      EXPIRY_COOLDOWNS["Blossom Hourglass"],
    );
    expect(getExpiryCooldown("Time Warp Totem", game)).toBe(
      EXPIRY_COOLDOWNS["Time Warp Totem"],
    );
  });

  // The cooldown is derived from CURRENT feature access, not persisted at placement
  // time, so an account with SPEED_BOOSTS access reads its already-placed boosters at
  // the rebalanced durations (a benign one-time extension — intended).
  it("retroactively re-times already-placed boosters when the flag flips", () => {
    // A Time Warp Totem placed 3h ago: past the legacy 2h lifetime, inside the 4h one.
    const totemGame: GameState = {
      ...TEST_FARM,
      collectibles: {
        "Time Warp Totem": [
          {
            id: "1",
            coordinates: { x: 0, y: 0 },
            createdAt: Date.now() - 3 * 60 * 60 * 1000,
            readyAt: Date.now() - 3 * 60 * 60 * 1000,
          },
        ],
      },
    };

    setNetwork("mainnet");
    expect(
      isTemporaryCollectibleActive({
        name: "Time Warp Totem",
        game: totemGame,
      }),
    ).toBe(false); // legacy 2h lifetime → expired

    setNetwork("amoy");
    expect(
      isTemporaryCollectibleActive({
        name: "Time Warp Totem",
        game: totemGame,
      }),
    ).toBe(true); // rebalanced 4h lifetime → still active
  });
});
