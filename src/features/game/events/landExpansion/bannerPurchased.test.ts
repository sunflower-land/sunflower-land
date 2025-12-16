import { TEST_FARM } from "features/game/lib/constants";
import { purchaseBanner } from "./bannerPurchased";
import Decimal from "decimal.js-light";
import {
  CHAPTERS,
  ChapterBanner,
  getCurrentChapter,
  getChapterBanner,
  getPreviousChapterBanner,
} from "features/game/types/chapters";
import { BB_TO_GEM_RATIO } from "features/game/types/game";

describe("purchaseBanner", () => {
  it("throws an error if invalid banner", () => {
    expect(() =>
      purchaseBanner({
        state: {
          ...TEST_FARM,
          inventory: {
            Gem: new Decimal(100),
          },
        },
        action: {
          type: "banner.purchased",
          name: "Invalid Banner" as ChapterBanner,
        },
      }),
    ).toThrow("Invalid banner");
  });

  it("throws an error if insufficient Gems", () => {
    expect(() =>
      purchaseBanner({
        state: {
          ...TEST_FARM,
          inventory: {
            Gem: new Decimal(0),
          },
        },
        action: {
          type: "banner.purchased",
          name: getChapterBanner(Date.now()),
        },
      }),
    ).toThrow("Insufficient Gems");
  });

  it("throws an error if already has the banner", () => {
    expect(() =>
      purchaseBanner({
        state: {
          ...TEST_FARM,
          inventory: {
            Gem: new Decimal(100 * BB_TO_GEM_RATIO),
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

  it("purchases banner on first week without previous banner", () => {
    const SIX_DAYS = 1000 * 60 * 60 * 24 * 6;
    const createdAt = Date.now();
    const season = getCurrentChapter(createdAt);
    const seasonStart = CHAPTERS[season].startDate;
    const banner = getChapterBanner(createdAt);

    const result = purchaseBanner({
      state: {
        ...TEST_FARM,
        inventory: {
          Gem: new Decimal(75 * BB_TO_GEM_RATIO),
        },
      },
      action: {
        type: "banner.purchased",
        name: banner,
      },
      createdAt: seasonStart.getTime() + SIX_DAYS,
    });

    expect(result).toEqual({
      ...TEST_FARM,
      inventory: {
        Gem: new Decimal(0),
        [banner]: new Decimal(1),
      },
    });
  });

  it("purchases banner on first week with previous banner", () => {
    const SIX_DAYS = 1000 * 60 * 60 * 24 * 6;
    const createdAt = Date.now();
    const season = getCurrentChapter(createdAt);
    const seasonStart = CHAPTERS[season].startDate;
    const banner = getChapterBanner(createdAt);
    const previousSeasonalBanner = getPreviousChapterBanner(createdAt);

    const result = purchaseBanner({
      state: {
        ...TEST_FARM,
        inventory: {
          Gem: new Decimal(60 * BB_TO_GEM_RATIO),
          [previousSeasonalBanner]: new Decimal(1),
        },
      },
      action: {
        type: "banner.purchased",
        name: banner,
      },
      createdAt: seasonStart.getTime() + SIX_DAYS,
    });

    expect(result).toEqual({
      ...TEST_FARM,
      inventory: {
        Gem: new Decimal(0),
        [banner]: new Decimal(1),
        [previousSeasonalBanner]: new Decimal(1),
      },
    });
  });

  it("purchases banner on 2-4 weeks", () => {
    const WEEK = 1000 * 60 * 60 * 24 * 7;
    const now = Date.now();
    const initialSeason = getCurrentChapter(now);
    const seasonStart = CHAPTERS[initialSeason].startDate;
    const createdAt = seasonStart.getTime() + WEEK * 3;
    const banner = getChapterBanner(createdAt);

    const result = purchaseBanner({
      state: {
        ...TEST_FARM,
        inventory: {
          Gem: new Decimal(100 * BB_TO_GEM_RATIO),
        },
      },
      action: {
        type: "banner.purchased",
        name: banner,
      },
      createdAt,
    });

    expect(result).toEqual({
      ...TEST_FARM,
      inventory: {
        Gem: new Decimal(0),
        [banner]: new Decimal(1),
      },
    });
  });

  it("purchases banner on 4-8 weeks", () => {
    const WEEK = 1000 * 60 * 60 * 24 * 7;
    const now = Date.now();
    const initialSeason = getCurrentChapter(now);
    const seasonStart = CHAPTERS[initialSeason].startDate;
    const createdAt = seasonStart.getTime() + WEEK * 5;
    const banner = getChapterBanner(createdAt);

    const result = purchaseBanner({
      state: {
        ...TEST_FARM,
        inventory: {
          Gem: new Decimal(80 * BB_TO_GEM_RATIO),
        },
      },
      action: {
        type: "banner.purchased",
        name: banner,
      },
      createdAt,
    });

    expect(result).toEqual({
      ...TEST_FARM,
      inventory: {
        Gem: new Decimal(0),
        [banner]: new Decimal(1),
      },
    });
  });

  it("purchases banner after 8 weeks", () => {
    const WEEK = 1000 * 60 * 60 * 24 * 7;
    const now = Date.now();
    const initialSeason = getCurrentChapter(now);
    const seasonStart = CHAPTERS[initialSeason].startDate;
    const createdAt = seasonStart.getTime() + WEEK * 9;
    const banner = getChapterBanner(createdAt);

    const result = purchaseBanner({
      state: {
        ...TEST_FARM,
        inventory: {
          Gem: new Decimal(60 * BB_TO_GEM_RATIO),
        },
      },
      action: {
        type: "banner.purchased",
        name: banner,
      },
      createdAt,
    });

    expect(result).toEqual({
      ...TEST_FARM,
      inventory: {
        Gem: new Decimal(0 * BB_TO_GEM_RATIO),
        [banner]: new Decimal(1),
      },
    });
  });

  it("purchases Lifetime Farmer Banner", () => {
    const result = purchaseBanner({
      state: {
        ...TEST_FARM,
        inventory: {
          Gem: new Decimal(740 * BB_TO_GEM_RATIO),
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
        Gem: new Decimal(0),
        "Lifetime Farmer Banner": new Decimal(1),
      },
    });
  });

  it("does not charge for a seasonal banner if a Lifetime Banner is owned", () => {
    const now = Date.now();
    const banner = getChapterBanner(now);
    const result = purchaseBanner({
      state: {
        ...TEST_FARM,
        inventory: {
          Gem: new Decimal(100 * BB_TO_GEM_RATIO),
          "Lifetime Farmer Banner": new Decimal(1),
        },
      },
      action: {
        type: "banner.purchased",
        name: banner,
      },
    });

    expect(result.inventory["Gem"]).toEqual(new Decimal(100 * BB_TO_GEM_RATIO));
    expect(result.inventory[banner]).toEqual(new Decimal(1));
  });

  it("throws an error if buying a banner out of season", () => {
    expect(() =>
      purchaseBanner({
        state: {
          ...TEST_FARM,
          inventory: {
            Gem: new Decimal(100 * BB_TO_GEM_RATIO),
          },
        },
        action: {
          type: "banner.purchased",
          name: "Dawn Breaker Banner",
        },
      }),
    ).toThrow("Attempt to purchase Dawn Breaker Banner");
  });

  it("purchases banner on first week of Pharaohs Treasure without previous banner", () => {
    const SIX_DAYS = 1000 * 60 * 60 * 24 * 6;
    const seasonStart = CHAPTERS["Pharaoh's Treasure"].startDate;
    const banner = getChapterBanner(seasonStart.getTime());

    const result = purchaseBanner({
      state: {
        ...TEST_FARM,
        inventory: {
          Gem: new Decimal(75 * BB_TO_GEM_RATIO),
        },
      },
      action: {
        type: "banner.purchased",
        name: banner,
      },
      createdAt: seasonStart.getTime() + SIX_DAYS,
    });

    expect(result).toEqual({
      ...TEST_FARM,
      inventory: {
        Gem: new Decimal(0),
        [banner]: new Decimal(1),
      },
    });
  });
});
