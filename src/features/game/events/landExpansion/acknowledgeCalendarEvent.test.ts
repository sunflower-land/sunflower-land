import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { acknowledgeCalendarEvent } from "./acknowledgeCalendarEvent";

// Fixed instant used as the "current time" for the test run. Kept within the
// 24h window that getActiveCalendarEvent considers active, but hard-coded so
// the suite doesn't depend on wall-clock drift.
const NOW = new Date("2026-04-22T12:00:00.000Z").getTime();

describe("acknowledgeCalendarEvent", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(NOW);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("throws an error if no event is not found", () => {
    expect(() =>
      acknowledgeCalendarEvent({
        state: TEST_FARM,
        action: { type: "calendarEvent.acknowledged" },
      }),
    ).toThrow();
  });

  it("should make a calendar event as acknowledged", () => {
    const state: GameState = {
      ...TEST_FARM,
      calendar: {
        dates: [],
        tornado: {
          startedAt: NOW,
          triggeredAt: NOW,
          protected: false,
        },
      },
    };

    const newGame = acknowledgeCalendarEvent({
      state,
      action: {
        type: "calendarEvent.acknowledged",
      },
      createdAt: NOW,
    });

    expect(newGame.calendar.tornado?.acknowledgedAt).toBe(NOW);
  });
});
