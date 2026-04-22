import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { acknowledgeCalendarEvent } from "./acknowledgeCalendarEvent";

describe("acknowledgeCalendarEvent", () => {
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
          startedAt: Date.now(),
          triggeredAt: Date.now(),
          protected: false,
        },
      },
    };

    const acknowledgedAt = Date.now();

    const newGame = acknowledgeCalendarEvent({
      state,
      action: {
        type: "calendarEvent.acknowledged",
      },
      createdAt: acknowledgedAt,
    });

    expect(newGame.calendar.tornado?.acknowledgedAt).toBe(acknowledgedAt);
  });
});
