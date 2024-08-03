import "lib/__mocks__/configMock";
import { getSellPrice } from "./boosts";
import { TEST_FARM } from "features/game/lib/constants";
import { CROPS } from "features/game/types/crops";
import Decimal from "decimal.js-light";
import { FRUIT } from "features/game/types/fruits";

describe("boosts", () => {
  it("applies crop shortage price", () => {
    expect(
      getSellPrice({
        item: CROPS.Sunflower,
        game: {
          ...TEST_FARM,
          inventory: { "Basic Land": new Decimal(3) },
          createdAt: Date.now() - 1 * 60 * 60 * 1000,
        },
        now: new Date(),
      }),
    ).toEqual(CROPS.Sunflower.sellPrice * 2);
  });

  it("removes crop shortage price after 2 hours", () => {
    const now = new Date();
    expect(
      getSellPrice({
        item: CROPS.Sunflower,
        game: {
          ...TEST_FARM,
          inventory: { "Basic Land": new Decimal(3) },
          // Game started over 2 hours ago
          createdAt: now.getTime() - 2 * 60 * 60 * 1000 - 1,
        },
        now,
      }),
    ).toEqual(CROPS.Sunflower.sellPrice);
  });

  it("applies special event pricing", () => {
    expect(
      getSellPrice({
        item: FRUIT().Tomato,
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
    ).toEqual(FRUIT().Tomato.sellPrice * 1.05);
  });

  it("does not apply special event pricing if ineligible", () => {
    expect(
      getSellPrice({
        item: FRUIT().Tomato,
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
    ).toEqual(FRUIT().Tomato.sellPrice);
  });
});
