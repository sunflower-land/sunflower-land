import { getSellPrice } from "./boosts";
import { TEST_FARM } from "features/game/lib/constants";
import { PLOT_CROPS } from "features/game/types/crops";
import Decimal from "decimal.js-light";
import { PATCH_FRUIT } from "features/game/types/fruits";

describe("boosts", () => {
  it("applies crop shortage price", () => {
    expect(
      getSellPrice({
        item: PLOT_CROPS.Sunflower,
        game: {
          ...TEST_FARM,
          inventory: { "Basic Land": new Decimal(3) },
          createdAt: Date.now() - 1 * 60 * 60 * 1000,
        },
        now: new Date(),
      }),
    ).toEqual(PLOT_CROPS.Sunflower.sellPrice * 2);
  });

  it("removes crop shortage price after 2 hours", () => {
    const now = new Date();
    expect(
      getSellPrice({
        item: PLOT_CROPS.Sunflower,
        game: {
          ...TEST_FARM,
          inventory: { "Basic Land": new Decimal(3) },
          // Game started over 2 hours ago
          createdAt: now.getTime() - 2 * 60 * 60 * 1000 - 1,
        },
        now,
      }),
    ).toEqual(PLOT_CROPS.Sunflower.sellPrice);
  });

  it("applies special event pricing", () => {
    expect(
      getSellPrice({
        item: PATCH_FRUIT().Tomato,
        game: {
          ...TEST_FARM,
          specialEvents: {
            current: {
              "La Tomatina": {
                isEligible: true,
                text: "La Tomatina",
                startAt: 0,
                endAt: Number.MAX_SAFE_INTEGER,
                requiresWallet: false,
                tasks: [],
                bonus: {
                  Tomato: { saleMultiplier: 1.05 },
                },
              },
            },
            history: {},
          },
        },
      }),
    ).toEqual(PATCH_FRUIT().Tomato.sellPrice * 1.05);
  });

  it("does not apply special event pricing if ineligible", () => {
    expect(
      getSellPrice({
        item: PATCH_FRUIT().Tomato,
        game: {
          ...TEST_FARM,
          specialEvents: {
            current: {
              "La Tomatina": {
                isEligible: false,
                text: "La Tomatina",
                startAt: 0,
                endAt: Number.MAX_SAFE_INTEGER,
                requiresWallet: false,
                tasks: [],
                bonus: {
                  Tomato: { saleMultiplier: 1.05 },
                },
              },
            },
            history: {},
          },
        },
      }),
    ).toEqual(PATCH_FRUIT().Tomato.sellPrice);
  });

  it("applies Green Thumb boost to crop", () => {
    const now = new Date();
    expect(
      getSellPrice({
        item: PLOT_CROPS.Sunflower,
        game: {
          ...TEST_FARM,
          inventory: {
            "Basic Land": new Decimal(3),
            "Green Thumb": new Decimal(1),
          },
          // Game started over 2 hours ago
          createdAt: now.getTime() - 2 * 60 * 60 * 1000 - 1,
        },
        now,
      }),
    ).toEqual(PLOT_CROPS.Sunflower.sellPrice * 1.05);
  });

  it("does not apply Green Thumb boost to non crops", () => {
    const now = new Date();
    expect(
      getSellPrice({
        item: PATCH_FRUIT().Tomato,
        game: {
          ...TEST_FARM,
          inventory: {
            "Basic Land": new Decimal(3),
            "Green Thumb": new Decimal(1),
          },
          // Game started over 2 hours ago
          createdAt: now.getTime() - 2 * 60 * 60 * 1000 - 1,
        },
        now,
      }),
    ).toEqual(PATCH_FRUIT().Tomato.sellPrice);
  });

  it("applies Coin Swindler boost to crop", () => {
    const now = new Date();
    expect(
      getSellPrice({
        item: PLOT_CROPS.Sunflower,
        game: {
          ...TEST_FARM,
          bumpkin: {
            ...TEST_FARM.bumpkin,
            skills: {
              "Coin Swindler": 1,
            },
          },
          inventory: {
            "Basic Land": new Decimal(3),
          },
          // Game started over 2 hours ago
          createdAt: now.getTime() - 2 * 60 * 60 * 1000 - 1,
        },
        now,
      }),
    ).toEqual(PLOT_CROPS.Sunflower.sellPrice * 1.1);
  });

  it("applies Coin Swindler boost to crop", () => {
    const now = new Date();
    expect(
      getSellPrice({
        item: PATCH_FRUIT().Tomato,
        game: {
          ...TEST_FARM,
          bumpkin: {
            ...TEST_FARM.bumpkin,
            skills: {
              "Coin Swindler": 1,
            },
          },
          inventory: {
            "Basic Land": new Decimal(3),
          },
          // Game started over 2 hours ago
          createdAt: now.getTime() - 2 * 60 * 60 * 1000 - 1,
        },
        now,
      }),
    ).toEqual(PATCH_FRUIT().Tomato.sellPrice);
  });

  it("boosts are additive", () => {
    const now = new Date();
    expect(
      getSellPrice({
        item: PLOT_CROPS.Sunflower,
        game: {
          ...TEST_FARM,
          bumpkin: {
            ...TEST_FARM.bumpkin,
            skills: {
              "Coin Swindler": 1,
            },
          },
          inventory: {
            "Basic Land": new Decimal(3),
            "Green Thumb": new Decimal(1),
          },
          // Game started now
          createdAt: Date.now() - 1 * 60 * 60 * 1000,
        },
        now,
      }),
    ).toEqual(PLOT_CROPS.Sunflower.sellPrice * 2.15);
  });
});
