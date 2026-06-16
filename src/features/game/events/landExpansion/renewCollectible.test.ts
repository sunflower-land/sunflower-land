import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { EXPIRY_COOLDOWNS } from "features/game/lib/collectibleBuilt";
import { renewCollectible } from "./renewCollectible";

describe("renewCollectible", () => {
  const now = Date.now();

  it("renews an expired Time Warp Totem in place", () => {
    const expiredCreatedAt = now - EXPIRY_COOLDOWNS["Time Warp Totem"];

    const state = renewCollectible({
      state: {
        ...TEST_FARM,
        inventory: {
          "Time Warp Totem": new Decimal(1),
        },
        collectibles: {
          "Time Warp Totem": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              createdAt: expiredCreatedAt,
            },
          ],
        },
      },
      action: {
        type: "collectible.renewed",
        name: "Time Warp Totem",
        location: "farm",
        id: "1",
      },
      createdAt: now,
    });

    expect(state.inventory["Time Warp Totem"]).toEqual(new Decimal(0));
    expect(state.collectibles["Time Warp Totem"]?.[0].createdAt).toBe(now);
  });

  it("does not renew an active Time Warp Totem", () => {
    expect(() =>
      renewCollectible({
        state: {
          ...TEST_FARM,
          inventory: {
            "Time Warp Totem": new Decimal(1),
          },
          collectibles: {
            "Time Warp Totem": [
              {
                id: "1",
                coordinates: { x: 0, y: 0 },
                createdAt: now,
              },
            ],
          },
        },
        action: {
          type: "collectible.renewed",
          name: "Time Warp Totem",
          location: "farm",
          id: "1",
        },
        createdAt: now,
      }),
    ).toThrow("Collectible is still active");
  });

  it("renews a spent weather collectible in place", () => {
    const state = renewCollectible({
      state: {
        ...TEST_FARM,
        coins: 500,
        inventory: {
          Wood: new Decimal(30),
          Leather: new Decimal(5),
        },
        collectibles: {
          "Tornado Pinwheel": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              createdAt: now - 1000,
            },
          ],
        },
      },
      action: {
        type: "collectible.renewed",
        name: "Tornado Pinwheel",
        location: "farm",
        id: "1",
      },
      createdAt: now,
    });

    expect(state.inventory.Wood).toEqual(new Decimal(0));
    expect(state.inventory.Leather).toEqual(new Decimal(0));
    expect(state.coins).toEqual(400);
    expect(
      state.collectibles["Tornado Pinwheel"]?.[0].createdAt,
    ).toBeUndefined();
  });

  it("does not renew a weather collectible that has not been spent", () => {
    expect(() =>
      renewCollectible({
        state: {
          ...TEST_FARM,
          coins: 500,
          inventory: {
            Wood: new Decimal(30),
            Leather: new Decimal(5),
          },
          collectibles: {
            "Tornado Pinwheel": [
              {
                id: "1",
                coordinates: { x: 0, y: 0 },
              },
            ],
          },
        },
        action: {
          type: "collectible.renewed",
          name: "Tornado Pinwheel",
          location: "farm",
          id: "1",
        },
        createdAt: now,
      }),
    ).toThrow("Collectible is still active");
  });

  it("does not renew a weather collectible without weather shop resources", () => {
    expect(() =>
      renewCollectible({
        state: {
          ...TEST_FARM,
          coins: 50,
          inventory: {
            Wood: new Decimal(10),
            Leather: new Decimal(1),
          },
          collectibles: {
            "Tornado Pinwheel": [
              {
                id: "1",
                coordinates: { x: 0, y: 0 },
                createdAt: now - 1000,
              },
            ],
          },
        },
        action: {
          type: "collectible.renewed",
          name: "Tornado Pinwheel",
          location: "farm",
          id: "1",
        },
        createdAt: now,
      }),
    ).toThrow("Insufficient Coins");
  });
});
