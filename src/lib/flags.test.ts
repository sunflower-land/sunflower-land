import Decimal from "decimal.js-light";
import { hasFeatureAccess, hasTimeBasedFeatureAccess } from "./flags";
import { TEST_FARM } from "features/game/lib/constants";
import { CONFIG } from "./config";

describe("hasFeatureAccess", () => {
  let previousNetwork: (typeof CONFIG)["NETWORK"];

  beforeEach(() => {
    previousNetwork = CONFIG.NETWORK;
    CONFIG.NETWORK = "mainnet";
  });

  afterEach(() => {
    CONFIG.NETWORK = previousNetwork;
  });

  it("returns true for a beta feature if the player has a beta pass", () => {
    expect(
      hasFeatureAccess(
        {
          ...TEST_FARM,
          inventory: { "Beta Pass": new Decimal(1) },
        },
        "JEST_TEST",
      ),
    ).toBe(true);
  });

  it("returns false for a beta feature if the player does not have a beta pass", () => {
    expect(hasFeatureAccess(TEST_FARM, "JEST_TEST")).toBe(false);
  });

  it("returns true if on amoy and does not have a beta pass", () => {
    CONFIG.NETWORK = "amoy";
    expect(hasFeatureAccess(TEST_FARM, "JEST_TEST")).toBe(true);
  });
});

describe("hasTimeBasedFeatureAccess", () => {
  let previousNetwork: (typeof CONFIG)["NETWORK"];

  beforeEach(() => {
    previousNetwork = CONFIG.NETWORK;
    CONFIG.NETWORK = "mainnet";
  });

  afterEach(() => {
    CONFIG.NETWORK = previousNetwork;
    jest.useRealTimers();
  });

  describe("TICKETS_FROM_COIN_NPC", () => {
    it("is false before the start date", () => {
      expect(
        hasTimeBasedFeatureAccess({
          featureName: "TICKETS_FROM_COIN_NPC",
          now: new Date("2026-02-23T23:59:59Z").getTime(),
          game: TEST_FARM,
        }),
      ).toBe(false);
    });

    it("is true on the start date", () => {
      expect(
        hasTimeBasedFeatureAccess({
          featureName: "TICKETS_FROM_COIN_NPC",
          now: new Date("2026-02-24T00:00:00Z").getTime(),
          game: TEST_FARM,
        }),
      ).toBe(true);
    });
  });

  describe("APRIL_FOOLS_EVENT_FLAG", () => {
    it("is false for players without beta before the event start", () => {
      expect(
        hasTimeBasedFeatureAccess({
          featureName: "APRIL_FOOLS_EVENT_FLAG",
          now: new Date("2026-03-15T12:00:00Z").getTime(),
          game: TEST_FARM,
        }),
      ).toBe(false);
    });

    it("is true for players with beta before the event start", () => {
      expect(
        hasTimeBasedFeatureAccess({
          featureName: "APRIL_FOOLS_EVENT_FLAG",
          now: new Date("2026-03-15T12:00:00Z").getTime(),
          game: {
            ...TEST_FARM,
            inventory: {
              ...TEST_FARM.inventory,
              "Beta Pass": new Decimal(1),
            },
          },
        }),
      ).toBe(true);
    });

    it("is false at the exact public start instant without beta", () => {
      expect(
        hasTimeBasedFeatureAccess({
          featureName: "APRIL_FOOLS_EVENT_FLAG",
          now: new Date("2026-04-01T00:00:00Z").getTime(),
          game: TEST_FARM,
        }),
      ).toBe(false);
    });

    it("is true during the window after public start for players without beta", () => {
      expect(
        hasTimeBasedFeatureAccess({
          featureName: "APRIL_FOOLS_EVENT_FLAG",
          now: new Date("2026-04-05T12:00:00Z").getTime(),
          game: TEST_FARM,
        }),
      ).toBe(true);
    });

    it("is false from the end date onward", () => {
      expect(
        hasTimeBasedFeatureAccess({
          featureName: "APRIL_FOOLS_EVENT_FLAG",
          now: new Date("2026-04-08T00:00:00Z").getTime(),
          game: TEST_FARM,
        }),
      ).toBe(false);
      expect(
        hasTimeBasedFeatureAccess({
          featureName: "APRIL_FOOLS_EVENT_FLAG",
          now: new Date("2026-04-10T00:00:00Z").getTime(),
          game: TEST_FARM,
        }),
      ).toBe(false);
    });
  });

  it("APRIL_FOOLS is true at mocked wall clock during the window", () => {
    jest.useFakeTimers();
    const t = new Date("2026-04-05T12:00:00Z").getTime();
    jest.setSystemTime(t);
    expect(
      hasTimeBasedFeatureAccess({
        featureName: "APRIL_FOOLS_EVENT_FLAG",
        now: t,
        game: TEST_FARM,
      }),
    ).toBe(true);
  });
});
