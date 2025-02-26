import { BASIC_REWARDS, LUXURY_REWARDS, RARE_REWARDS } from "./chests";
import { SEASONS } from "./chapters";

describe("SEASONAL_REWARDS", () => {
  it("does not include Kite during Bull Run Chapter", () => {
    jest.useFakeTimers();
    jest.setSystemTime(SEASONS["Bull Run"].startDate);

    expect(BASIC_REWARDS()).not.toContainEqual({
      items: { Kite: 1 },
      weighting: 5,
    });
    expect(RARE_REWARDS()).not.toContainEqual({
      items: { Kite: 1 },
      weighting: 25,
    });
    expect(LUXURY_REWARDS()).not.toContainEqual({
      items: { Kite: 1 },
      weighting: 25,
    });

    jest.clearAllTimers();
  });

  it("includes Kite during Winds of Change Chapter", () => {
    jest.useFakeTimers();
    jest.setSystemTime(SEASONS["Winds of Change"].startDate);

    expect(BASIC_REWARDS()).toContainEqual({
      items: { Kite: 1 },
      weighting: 2250,
    });
    expect(RARE_REWARDS()).toContainEqual({
      items: { Kite: 1 },
      weighting: 11250,
    });
    expect(LUXURY_REWARDS()).toContainEqual({
      items: { Kite: 1 },
      weighting: 11250,
    });

    jest.clearAllTimers();
  });
});
