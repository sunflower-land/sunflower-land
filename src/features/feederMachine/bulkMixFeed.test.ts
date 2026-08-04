import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import { bulkMixFeed } from "./bulkMixFeed";

describe("bulkMixFeed", () => {
  it("mixes every requested feed in one event", () => {
    const state = bulkMixFeed({
      state: {
        ...INITIAL_FARM,
        inventory: {
          Corn: new Decimal(10),
          Wheat: new Decimal(10),
          Lemon: new Decimal(5),
          Honey: new Decimal(3),
        },
      },
      action: {
        type: "feeds.bulkMixed",
        feeds: [
          { item: "Kernel Blend", amount: 3 },
          { item: "Hay", amount: 2 },
          { item: "Barn Delight", amount: 1 },
        ],
      },
    });

    expect(state.inventory["Kernel Blend"]).toEqual(new Decimal(3));
    expect(state.inventory.Hay).toEqual(new Decimal(2));
    expect(state.inventory["Barn Delight"]).toEqual(new Decimal(1));

    expect(state.inventory.Corn).toEqual(new Decimal(7));
    expect(state.inventory.Wheat).toEqual(new Decimal(8));
    expect(state.inventory.Lemon).toEqual(new Decimal(0));
    expect(state.inventory.Honey).toEqual(new Decimal(0));
  });

  it("tracks the farm activity for each mixed feed", () => {
    const state = bulkMixFeed({
      state: {
        ...INITIAL_FARM,
        farmActivity: {},
        inventory: {
          Corn: new Decimal(10),
          Wheat: new Decimal(10),
        },
      },
      action: {
        type: "feeds.bulkMixed",
        feeds: [
          { item: "Kernel Blend", amount: 3 },
          { item: "Hay", amount: 2 },
        ],
      },
    });

    expect(state.farmActivity["Kernel Blend Mixed"]).toBe(3);
    expect(state.farmActivity["Hay Mixed"]).toBe(2);
  });

  it("applies the player's skills to every feed in the mix", () => {
    const state = bulkMixFeed({
      state: {
        ...INITIAL_FARM,
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          skills: {
            "Kale Mix": 1,
          },
        },
        inventory: {
          Corn: new Decimal(10),
          Wheat: new Decimal(10),
          Barley: new Decimal(10),
          Kale: new Decimal(10),
        },
      },
      action: {
        type: "feeds.bulkMixed",
        feeds: [
          { item: "Mixed Grain", amount: 1 },
          { item: "Kernel Blend", amount: 1 },
        ],
      },
    });

    // Kale Mix swaps the Mixed Grain recipe over to Kale.
    expect(state.inventory.Kale).toEqual(new Decimal(7));
    expect(state.inventory.Wheat).toEqual(new Decimal(10));
    expect(state.inventory.Barley).toEqual(new Decimal(10));
    // Only the Kernel Blend consumed Corn.
    expect(state.inventory.Corn).toEqual(new Decimal(9));
  });

  it("mixes nothing when a later feed is short of ingredients", () => {
    const state: GameState = {
      ...INITIAL_FARM,
      inventory: {
        Corn: new Decimal(10),
        Lemon: new Decimal(1),
        Honey: new Decimal(1),
      },
    };

    expect(() =>
      bulkMixFeed({
        state,
        action: {
          type: "feeds.bulkMixed",
          feeds: [
            { item: "Kernel Blend", amount: 3 },
            { item: "Barn Delight", amount: 1 },
          ],
        },
      }),
    ).toThrow("Insufficient Ingredient: Lemon");

    // The whole event is rejected - the Kernel Blend is not mixed either.
    expect(state.inventory.Corn).toEqual(new Decimal(10));
    expect(state.inventory["Kernel Blend"]).toBeUndefined();
  });

  it("throws if an item is not a feed", () => {
    expect(() =>
      bulkMixFeed({
        state: {
          ...INITIAL_FARM,
          inventory: {
            Corn: new Decimal(10),
          },
        },
        action: {
          type: "feeds.bulkMixed",
          feeds: [
            { item: "Kernel Blend", amount: 1 },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            { item: "Sunflower Seed" as any, amount: 1 },
          ],
        },
      }),
    ).toThrow("Item is not a feed!");
  });

  it("rejects fractional amounts", () => {
    expect(() =>
      bulkMixFeed({
        state: {
          ...INITIAL_FARM,
          inventory: {
            Corn: new Decimal(10),
          },
        },
        action: {
          type: "feeds.bulkMixed",
          feeds: [{ item: "Kernel Blend", amount: 0.5 }],
        },
      }),
    ).toThrow("Invalid bulk mix amount");
  });

  it("rejects zero and oversized amounts", () => {
    const state = {
      ...INITIAL_FARM,
      inventory: {
        Corn: new Decimal(10000),
      },
    };

    expect(() =>
      bulkMixFeed({
        state,
        action: {
          type: "feeds.bulkMixed",
          feeds: [{ item: "Kernel Blend", amount: 0 }],
        },
      }),
    ).toThrow("Invalid bulk mix amount");

    expect(() =>
      bulkMixFeed({
        state,
        action: {
          type: "feeds.bulkMixed",
          feeds: [{ item: "Kernel Blend", amount: 1001 }],
        },
      }),
    ).toThrow("Invalid bulk mix amount");
  });

  it("rejects an empty or oversized list of feeds", () => {
    expect(() =>
      bulkMixFeed({
        state: INITIAL_FARM,
        action: {
          type: "feeds.bulkMixed",
          feeds: [],
        },
      }),
    ).toThrow("Invalid bulk mix entries");

    expect(() =>
      bulkMixFeed({
        state: INITIAL_FARM,
        action: {
          type: "feeds.bulkMixed",
          feeds: new Array(7).fill({ item: "Kernel Blend", amount: 1 }),
        },
      }),
    ).toThrow("Invalid bulk mix entries");
  });
});
