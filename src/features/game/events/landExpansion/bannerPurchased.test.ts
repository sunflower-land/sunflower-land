import "lib/__mocks__/configMock";
import { TEST_FARM } from "features/game/lib/constants";
import { purchaseBanner } from "./bannerPurchased";
import Decimal from "decimal.js-light";

describe("purchaseBanner", () => {
  beforeEach(() => {
    jest.useRealTimers();
  });
  it("throws an error if no bumpkin exists", () => {
    expect(() =>
      purchaseBanner({
        state: {
          ...TEST_FARM,
          bumpkin: undefined,
        },
        action: {
          type: "banner.purchased",
          name: "Spring Blossom Banner",
        },
      })
    ).toThrow("You do not have a Bumpkin");
  });

  it("throws an error if insufficient block bucks", () => {
    expect(() =>
      purchaseBanner({
        state: {
          ...TEST_FARM,
          inventory: {
            "Block Buck": new Decimal(0),
          },
        },
        action: {
          type: "banner.purchased",
          name: "Spring Blossom Banner",
        },
      })
    ).toThrow("Insufficient Block Bucks");
  });

  it("throws an error if already has the banner", () => {
    expect(() =>
      purchaseBanner({
        state: {
          ...TEST_FARM,
          inventory: {
            "Block Buck": new Decimal(100),
            "Spring Blossom Banner": new Decimal(1),
          },
        },
        action: {
          type: "banner.purchased",
          name: "Spring Blossom Banner",
        },
      })
    ).toThrow("You already have this banner");
  });

  it("purchases a banner pre season without previous banner", () => {
    expect(
      purchaseBanner({
        state: {
          ...TEST_FARM,
          inventory: {
            "Block Buck": new Decimal(50),
          },
        },
        action: {
          type: "banner.purchased",
          name: "Spring Blossom Banner",
        },
        createdAt: new Date("2024-01-01").getTime(),
      })
    ).toEqual({
      ...TEST_FARM,
      inventory: {
        "Block Buck": new Decimal(0),
        "Spring Blossom Banner": new Decimal(1),
      },
    });
  });

  it("purchases a banner pre season with previous banner", () => {
    expect(
      purchaseBanner({
        state: {
          ...TEST_FARM,
          inventory: {
            "Block Buck": new Decimal(35),
            "Catch the Kraken Banner": new Decimal(1),
          },
        },
        action: {
          type: "banner.purchased",
          name: "Spring Blossom Banner",
        },
        createdAt: new Date("2024-01-01").getTime(),
      })
    ).toEqual({
      ...TEST_FARM,
      inventory: {
        "Block Buck": new Decimal(0),
        "Spring Blossom Banner": new Decimal(1),
        "Catch the Kraken Banner": new Decimal(1),
      },
    });
  });

  it("purchases a banner during season", () => {
    expect(
      purchaseBanner({
        state: {
          ...TEST_FARM,
          inventory: {
            "Block Buck": new Decimal(65),
          },
        },
        action: {
          type: "banner.purchased",
          name: "Spring Blossom Banner",
        },
        createdAt: new Date("2024-03-02").getTime(),
      })
    ).toEqual({
      ...TEST_FARM,
      inventory: {
        "Block Buck": new Decimal(0),
        "Spring Blossom Banner": new Decimal(1),
      },
    });
  });
});
