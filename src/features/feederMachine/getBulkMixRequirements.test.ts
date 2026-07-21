import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import type { Animal } from "features/game/types/game";
import { getBulkMixRequirements } from "./getBulkMixRequirements";

describe("getBulkMixRequirements", () => {
  const animal = ({
    state,
    type,
  }: {
    state: Animal["state"];
    type: Animal["type"];
  }): Animal => ({
    id: "0",
    type,
    createdAt: 0,
    state,
    experience: 0,
    asleepAt: 0,
    awakeAt: 0,
    lovedAt: 0,
    item: "Petting Hand",
  });

  const chicken = (state: Animal["state"]) =>
    animal({ state, type: "Chicken" });

  it("includes awake animals that are sad after a feed but still need food", () => {
    const { requests, missingRequests, requirements } = getBulkMixRequirements(
      {
        ...INITIAL_FARM,
        inventory: {},
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            "0": chicken("sad"),
          },
        },
      },
      "Hen House",
    );

    expect(requests["Kernel Blend"]).toEqual(new Decimal(1));
    expect(missingRequests["Kernel Blend"]).toEqual(new Decimal(1));
    expect(requirements.ingredients.Corn).toEqual(new Decimal(1));
    expect(requirements.coins).toBe(0);
  });

  it("does not request feed for ready animals", () => {
    const { requests, missingRequests } = getBulkMixRequirements(
      {
        ...INITIAL_FARM,
        inventory: {
          "Mixed Grain": new Decimal(100),
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            "0": chicken("ready"),
          },
        },
      },
      "Hen House",
    );

    expect(requests).toEqual({});
    expect(missingRequests).toEqual({});
  });

  it("calculates barn feed requirements", () => {
    const { requests, missingRequests, requirements } = getBulkMixRequirements(
      {
        ...INITIAL_FARM,
        inventory: {},
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            "0": animal({ state: "idle", type: "Cow" }),
          },
        },
      },
      "Barn",
    );

    expect(requests["Kernel Blend"]).toEqual(new Decimal(15));
    expect(missingRequests["Kernel Blend"]).toEqual(new Decimal(15));
    expect(requirements.ingredients.Corn).toEqual(new Decimal(15));
    expect(requirements.coins).toBe(0);
  });

  it("breaks down each requested feed with its own ingredients", () => {
    const { feeds } = getBulkMixRequirements(
      {
        ...INITIAL_FARM,
        inventory: {},
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            "0": chicken("sad"),
            "1": chicken("sick"),
          },
        },
      },
      "Hen House",
    );

    const kernelBlend = feeds.find((feed) => feed.item === "Kernel Blend");
    const barnDelight = feeds.find((feed) => feed.item === "Barn Delight");

    expect(kernelBlend?.type).toBe("food");
    expect(kernelBlend?.missing).toEqual(new Decimal(1));
    expect(kernelBlend?.ingredients.Corn).toEqual(new Decimal(1));

    expect(barnDelight?.type).toBe("medicine");
    expect(barnDelight?.missing).toEqual(new Decimal(1));
    expect(barnDelight?.ingredients.Lemon).toEqual(new Decimal(5));
    expect(barnDelight?.ingredients.Honey).toEqual(new Decimal(3));
  });

  it("excludes feeds an item makes free to mix (Oracle Syringe cures for free)", () => {
    const { requests, feeds } = getBulkMixRequirements(
      {
        ...INITIAL_FARM,
        inventory: {},
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: {
            ...INITIAL_FARM.bumpkin.equipped,
            wings: "Oracle Syringe",
          },
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            "0": chicken("sick"),
          },
        },
      },
      "Hen House",
    );

    expect(requests["Barn Delight"]).toBeUndefined();
    expect(feeds.find((feed) => feed.item === "Barn Delight")).toBeUndefined();
  });

  it("surfaces the free-feed collectibles feeding a building's animals", () => {
    const { requests, freeFeedBoosts } = getBulkMixRequirements(
      {
        ...INITIAL_FARM,
        inventory: {},
        collectibles: {
          ...INITIAL_FARM.collectibles,
          "Golden Cow": [
            {
              id: "1",
              createdAt: 0,
              coordinates: { x: 0, y: 0 },
              readyAt: 0,
            },
          ],
        },
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            "0": animal({ state: "idle", type: "Cow" }),
            "1": animal({ state: "idle", type: "Sheep" }),
          },
        },
      },
      "Barn",
    );

    // Golden Cow feeds cows for free, so no request and a boost row for it.
    // The sheep has no free-feed collectible, so it still requests feed.
    expect(freeFeedBoosts).toEqual([
      { source: "collectible", item: "Golden Cow", animalType: "Cow" },
    ]);
    expect(requests["Kernel Blend"]).toBeDefined();
  });

  it("surfaces the Oracle Syringe as a free-cure boost for sick animals", () => {
    const { requests, freeFeedBoosts } = getBulkMixRequirements(
      {
        ...INITIAL_FARM,
        inventory: {},
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: {
            ...INITIAL_FARM.bumpkin.equipped,
            wings: "Oracle Syringe",
          },
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            "0": chicken("sick"),
          },
        },
      },
      "Hen House",
    );

    // Free cure means no Barn Delight request, surfaced as a wearable boost.
    expect(requests["Barn Delight"]).toBeUndefined();
    expect(freeFeedBoosts).toEqual([
      { source: "wearable", item: "Oracle Syringe" },
    ]);
  });

  it("does not surface the Oracle Syringe when no animal is sick", () => {
    const { freeFeedBoosts } = getBulkMixRequirements(
      {
        ...INITIAL_FARM,
        inventory: {},
        bumpkin: {
          ...INITIAL_FARM.bumpkin,
          equipped: {
            ...INITIAL_FARM.bumpkin.equipped,
            wings: "Oracle Syringe",
          },
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            "0": chicken("idle"),
          },
        },
      },
      "Hen House",
    );

    expect(freeFeedBoosts).toEqual([]);
  });

  it("counts how many animals are waiting for feed", () => {
    const { animalsWaiting } = getBulkMixRequirements(
      {
        ...INITIAL_FARM,
        inventory: {},
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            "0": chicken("sad"),
            "1": chicken("idle"),
            "2": chicken("ready"),
          },
        },
      },
      "Hen House",
    );

    // The ready chicken makes no request, so only two animals are waiting.
    expect(animalsWaiting).toBe(2);
  });

  it("marks feeds already covered by inventory with zero missing", () => {
    const { feeds, missingRequests } = getBulkMixRequirements(
      {
        ...INITIAL_FARM,
        inventory: {
          "Kernel Blend": new Decimal(100),
        },
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            "0": animal({ state: "idle", type: "Cow" }),
          },
        },
      },
      "Barn",
    );

    const kernelBlend = feeds.find((feed) => feed.item === "Kernel Blend");

    expect(kernelBlend?.requested).toEqual(new Decimal(15));
    expect(kernelBlend?.inInventory).toEqual(new Decimal(100));
    expect(kernelBlend?.missing).toEqual(new Decimal(0));
    expect(kernelBlend?.ingredients).toEqual({});
    expect(missingRequests["Kernel Blend"]).toBeUndefined();
  });
});
