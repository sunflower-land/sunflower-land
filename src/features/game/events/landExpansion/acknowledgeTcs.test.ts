import { TEST_FARM } from "features/game/lib/constants";
import {
  TCS_ACKNOWLEDGEMENT_DURATION,
  acknowledgeTcs,
  hasAcknowledgedTcs,
} from "./acknowledgeTcs";

const NOW = new Date("2026-08-21T12:00:00.000Z").getTime();

describe("acknowledgeTcs", () => {
  it("stamps the acknowledgement time", () => {
    const state = acknowledgeTcs({
      state: TEST_FARM,
      action: { type: "tcs.acknowledged" },
      createdAt: NOW,
    });

    expect(state.tcsAcknowledged).toEqual(NOW);
  });
});

describe("hasAcknowledgedTcs", () => {
  it("returns false when the player has never acknowledged the terms", () => {
    expect(hasAcknowledgedTcs({ game: TEST_FARM, now: NOW })).toBe(false);
  });

  it("returns false when the acknowledgement is older than 30 days", () => {
    const game = {
      ...TEST_FARM,
      tcsAcknowledged: NOW - TCS_ACKNOWLEDGEMENT_DURATION - 1,
    };

    expect(hasAcknowledgedTcs({ game, now: NOW })).toBe(false);
  });

  it("returns true when the acknowledgement is within the last 30 days", () => {
    const game = {
      ...TEST_FARM,
      tcsAcknowledged: NOW - TCS_ACKNOWLEDGEMENT_DURATION + 1,
    };

    expect(hasAcknowledgedTcs({ game, now: NOW })).toBe(true);
  });
});
