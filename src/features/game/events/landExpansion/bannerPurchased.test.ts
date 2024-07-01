import "lib/__mocks__/configMock";
import { TEST_FARM } from "features/game/lib/constants";
import { purchaseBanner } from "./bannerPurchased";
import Decimal from "decimal.js-light";
import {
  SEASONS,
  SeasonalBanner,
  getCurrentSeason,
  getPreviousSeasonalBanner,
  getSeasonalBanner,
} from "features/game/types/seasons";

describe("purchaseBanner", () => {
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
      }),
    ).toThrow("You do not have a Bumpkin");
  });

  it("throws an error if invalid banner", () => {
    expect(() =>
      purchaseBanner({
        state: {
          ...TEST_FARM,
          inventory: {
            "Block Buck": new Decimal(100),
          },
        },
        action: {
          type: "banner.purchased",
          name: "Invalid Banner" as SeasonalBanner,
        },
      }),
    ).toThrow("Invalid banner");
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
          name: getSeasonalBanner(),
        },
      }),
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
      }),
    ).toThrow("You already have this banner");
  });

  it("purchases banner on first 2 weeks without previous banner", () => {
    const WEEK = 1000 * 60 * 60 * 24 * 7;
    const season = getCurrentSeason();
    const seasonStart = SEASONS[season].startDate;
    const banner = getSeasonalBanner();

    const result = purchaseBanner({
      state: {
        ...TEST_FARM,
        inventory: {
          "Block Buck": new Decimal(65),
        },
      },
      action: {
        type: "banner.purchased",
        name: banner,
      },
      createdAt: seasonStart.getTime() + WEEK,
    });

    expect(result).toEqual({
      ...TEST_FARM,
      inventory: {
        "Block Buck": new Decimal(0),
        [banner]: new Decimal(1),
      },
    });
  });

  it("purchases banner on first 2 weeks with previous banner", () => {
    const WEEK = 1000 * 60 * 60 * 24 * 7;
    const season = getCurrentSeason();
    const seasonStart = SEASONS[season].startDate;
    const banner = getSeasonalBanner();
    const previousSeasonalBanner = getPreviousSeasonalBanner();

    const result = purchaseBanner({
      state: {
        ...TEST_FARM,
        inventory: {
          "Block Buck": new Decimal(50),
          [previousSeasonalBanner]: new Decimal(1),
        },
      },
      action: {
        type: "banner.purchased",
        name: banner,
      },
      createdAt: seasonStart.getTime() + WEEK,
    });

    expect(result).toEqual({
      ...TEST_FARM,
      inventory: {
        "Block Buck": new Decimal(0),
        [banner]: new Decimal(1),
        [previousSeasonalBanner]: new Decimal(1),
      },
    });
  });

  it("purchases banner on first 2 weeks with gold pass", () => {
    const WEEK = 1000 * 60 * 60 * 24 * 7;
    const season = getCurrentSeason();
    const seasonStart = SEASONS[season].startDate;
    const banner = getSeasonalBanner();
    const previousSeasonalBanner = getPreviousSeasonalBanner();

    const result = purchaseBanner({
      state: {
        ...TEST_FARM,
        inventory: {
          "Block Buck": new Decimal(50),
          "Gold Pass": new Decimal(1),
        },
      },
      action: {
        type: "banner.purchased",
        name: banner,
      },
      createdAt: seasonStart.getTime() + WEEK,
    });

    expect(result).toEqual({
      ...TEST_FARM,
      inventory: {
        "Block Buck": new Decimal(0),
        [banner]: new Decimal(1),
        "Gold Pass": new Decimal(1),
      },
    });
  });

  it("purchases banner on first 2 weeks with previous banner and gold pass", () => {
    const WEEK = 1000 * 60 * 60 * 24 * 7;
    const season = getCurrentSeason();
    const seasonStart = SEASONS[season].startDate;
    const banner = getSeasonalBanner();
    const previousSeasonalBanner = getPreviousSeasonalBanner();

    const result = purchaseBanner({
      state: {
        ...TEST_FARM,
        inventory: {
          "Block Buck": new Decimal(35),
          [previousSeasonalBanner]: new Decimal(1),
          "Gold Pass": new Decimal(1),
        },
      },
      action: {
        type: "banner.purchased",
        name: banner,
      },
      createdAt: seasonStart.getTime() + WEEK,
    });

    expect(result).toEqual({
      ...TEST_FARM,
      inventory: {
        "Block Buck": new Decimal(0),
        [banner]: new Decimal(1),
        [previousSeasonalBanner]: new Decimal(1),
        "Gold Pass": new Decimal(1),
      },
    });
  });

  it("purchases banner on 2-4 weeks", () => {
    const WEEK = 1000 * 60 * 60 * 24 * 7;
    const season = getCurrentSeason();
    const seasonStart = SEASONS[season].startDate;
    const banner = getSeasonalBanner();

    const result = purchaseBanner({
      state: {
        ...TEST_FARM,
        inventory: {
          "Block Buck": new Decimal(90),
        },
      },
      action: {
        type: "banner.purchased",
        name: banner,
      },
      createdAt: seasonStart.getTime() + WEEK * 3,
    });

    expect(result).toEqual({
      ...TEST_FARM,
      inventory: {
        "Block Buck": new Decimal(0),
        [banner]: new Decimal(1),
      },
    });
  });

  it("purchases banner on 2-4 weeks with gold pass discount", () => {
    const WEEK = 1000 * 60 * 60 * 24 * 7;
    const season = getCurrentSeason();
    const seasonStart = SEASONS[season].startDate;
    const banner = getSeasonalBanner();

    const result = purchaseBanner({
      state: {
        ...TEST_FARM,
        inventory: {
          "Block Buck": new Decimal(75),
          "Gold Pass": new Decimal(1),
        },
      },
      action: {
        type: "banner.purchased",
        name: banner,
      },
      createdAt: seasonStart.getTime() + WEEK * 3,
    });

    expect(result).toEqual({
      ...TEST_FARM,
      inventory: {
        "Block Buck": new Decimal(0),
        "Gold Pass": new Decimal(1),
        [banner]: new Decimal(1),
      },
    });
  });

  it("purchases banner on 4-8 weeks", () => {
    const WEEK = 1000 * 60 * 60 * 24 * 7;
    const season = getCurrentSeason();
    const seasonStart = SEASONS[season].startDate;
    const banner = getSeasonalBanner();

    const result = purchaseBanner({
      state: {
        ...TEST_FARM,
        inventory: {
          "Block Buck": new Decimal(70),
        },
      },
      action: {
        type: "banner.purchased",
        name: banner,
      },
      createdAt: seasonStart.getTime() + WEEK * 5,
    });

    expect(result).toEqual({
      ...TEST_FARM,
      inventory: {
        "Block Buck": new Decimal(0),
        [banner]: new Decimal(1),
      },
    });
  });

  it("purchases banner after 8 weeks", () => {
    const WEEK = 1000 * 60 * 60 * 24 * 7;
    const season = getCurrentSeason();
    const seasonStart = SEASONS[season].startDate;
    const banner = getSeasonalBanner();

    const result = purchaseBanner({
      state: {
        ...TEST_FARM,
        inventory: {
          "Block Buck": new Decimal(50),
        },
      },
      action: {
        type: "banner.purchased",
        name: banner,
      },
      createdAt: seasonStart.getTime() + WEEK * 9,
    });

    expect(result).toEqual({
      ...TEST_FARM,
      inventory: {
        "Block Buck": new Decimal(0),
        [banner]: new Decimal(1),
      },
    });
  });

  it("purchases Lifetime Farmer Banner", () => {
    const result = purchaseBanner({
      state: {
        ...TEST_FARM,
        inventory: {
          "Block Buck": new Decimal(540),
        },
      },
      action: {
        type: "banner.purchased",
        name: "Lifetime Farmer Banner",
      },
      createdAt: new Date().getTime(),
    });

    expect(result).toEqual({
      ...TEST_FARM,
      inventory: {
        "Block Buck": new Decimal(0),
        "Lifetime Farmer Banner": new Decimal(1),
      },
    });
  });

  it("does not charge for a seasonal banner if a Lifetime Banner is owned", () => {
    const result = purchaseBanner({
      state: {
        ...TEST_FARM,
        inventory: {
          "Block Buck": new Decimal(100),
          "Lifetime Farmer Banner": new Decimal(1),
        },
      },
      action: {
        type: "banner.purchased",
        name: getSeasonalBanner(),
      },
    });

    expect(result.inventory["Block Buck"]).toEqual(new Decimal(100));
    expect(result.inventory[getSeasonalBanner()]).toEqual(new Decimal(1));
  });

  it("does not charge for a banner if a gold pass was purchased in last three months", () => {
    const result = purchaseBanner({
      state: {
        ...TEST_FARM,
        inventory: {
          "Block Buck": new Decimal(100),
        },
      },
      action: {
        type: "banner.purchased",
        name: getSeasonalBanner(),
      },
      farmId: 25,
    });

    expect(result.inventory["Block Buck"]).toEqual(new Decimal(100));
    expect(result.inventory[getSeasonalBanner()]).toEqual(new Decimal(1));
  });

  it("throws an error if buying a banner out of season", () => {
    expect(() =>
      purchaseBanner({
        state: {
          ...TEST_FARM,
          inventory: {
            "Block Buck": new Decimal(100),
          },
        },
        action: {
          type: "banner.purchased",
          name: "Dawn Breaker Banner",
        },
      }),
    ).toThrow("Attempt to purchase Dawn Breaker Banner");
  });
});
