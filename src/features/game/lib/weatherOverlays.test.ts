import { CONFIG } from "lib/config";
import { INITIAL_FARM } from "./constants";
import type { GameState } from "../types/game";
import type { ScheduledWeatherOverlay } from "../types/weather";
import { isWeatherOverlayActive } from "./weatherOverlays";

const HOUR = 60 * 60 * 1000;

const FULL_MOON: ScheduledWeatherOverlay = {
  name: "fullMoon",
  startAt: Date.UTC(2026, 10, 23),
  endAt: Date.UTC(2026, 10, 24),
};
const DOUBLE_DELIVERY: ScheduledWeatherOverlay = {
  name: "doubleDelivery",
  startAt: Date.UTC(2026, 10, 23),
  endAt: Date.UTC(2026, 10, 24),
};

describe("isWeatherOverlayActive", () => {
  const game: GameState = { ...INITIAL_FARM };

  it("is active from the start of its day", () => {
    expect(
      isWeatherOverlayActive({
        game,
        name: "fullMoon",
        overlays: [FULL_MOON],
        now: FULL_MOON.startAt,
      }),
    ).toBe(true);
  });

  it("ends at the end of its day", () => {
    const overlays = [FULL_MOON];

    expect(
      isWeatherOverlayActive({
        game,
        name: "fullMoon",
        overlays,
        now: FULL_MOON.endAt - 1,
      }),
    ).toBe(true);
    expect(
      isWeatherOverlayActive({
        game,
        name: "fullMoon",
        overlays,
        now: FULL_MOON.endAt,
      }),
    ).toBe(false);
    expect(
      isWeatherOverlayActive({
        game,
        name: "fullMoon",
        overlays,
        now: FULL_MOON.startAt - 1,
      }),
    ).toBe(false);
  });

  it("only matches its own name", () => {
    expect(
      isWeatherOverlayActive({
        game,
        name: "doubleDelivery",
        overlays: [FULL_MOON],
        now: FULL_MOON.startAt + HOUR,
      }),
    ).toBe(false);
  });

  it("runs both overlays on the same day", () => {
    const overlays = [FULL_MOON, DOUBLE_DELIVERY];
    const now = FULL_MOON.startAt + HOUR;

    expect(
      isWeatherOverlayActive({ game, name: "fullMoon", overlays, now }),
    ).toBe(true);
    expect(
      isWeatherOverlayActive({ game, name: "doubleDelivery", overlays, now }),
    ).toBe(true);
  });

  it("ignores a leftover calendar event", () => {
    jest.useFakeTimers({ now: FULL_MOON.endAt + HOUR });
    try {
      const withCalendar: GameState = {
        ...game,
        calendar: {
          dates: [],
          fullMoon: {
            startedAt: FULL_MOON.endAt,
            triggeredAt: FULL_MOON.endAt,
          },
        },
      };

      expect(
        isWeatherOverlayActive({
          game: withCalendar,
          name: "fullMoon",
          overlays: [FULL_MOON],
          now: FULL_MOON.endAt + HOUR,
        }),
      ).toBe(false);
    } finally {
      jest.useRealTimers();
    }
  });

  describe("without the Weather flag", () => {
    const network = CONFIG.NETWORK;
    beforeAll(() => {
      CONFIG.NETWORK = "mainnet";
    });
    afterAll(() => {
      CONFIG.NETWORK = network;
    });

    it("reads the calendar instead", () => {
      const now = Date.UTC(2026, 11, 1, 12);
      // The client's calendar check reads the clock.
      jest.useFakeTimers({ now });
      const withCalendar: GameState = {
        ...game,
        calendar: {
          dates: [],
          doubleDelivery: { startedAt: now - HOUR, triggeredAt: now - HOUR },
        },
      };

      expect(
        isWeatherOverlayActive({
          game: withCalendar,
          name: "doubleDelivery",
          overlays: [],
          now,
        }),
      ).toBe(true);
      expect(
        isWeatherOverlayActive({
          game,
          name: "fullMoon",
          overlays: [FULL_MOON],
          now: FULL_MOON.startAt + HOUR,
        }),
      ).toBe(false);
      jest.useRealTimers();
    });
  });
});
