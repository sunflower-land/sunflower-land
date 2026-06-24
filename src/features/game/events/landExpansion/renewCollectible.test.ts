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
});
