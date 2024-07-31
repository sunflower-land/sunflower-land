import { BASIC_REWARDS, LUXURY_REWARDS, RARE_REWARDS } from "./chests";
import { SEASONS } from "./seasons";

describe("SEASONAL_REWARDS", () => {
  it("does not include Grape Pants during Clash of Factions Season", () => {
    jest.useFakeTimers();
    jest.setSystemTime(SEASONS["Clash of Factions"].startDate);

    expect(BASIC_REWARDS()).not.toContainEqual({
      wearables: { "Grape Pants": 1 },
      weighting: 5,
    });
    expect(RARE_REWARDS()).not.toContainEqual({
      wearables: { "Grape Pants": 1 },
      weighting: 25,
    });
    expect(LUXURY_REWARDS()).not.toContainEqual({
      wearables: { "Grape Pants": 1 },
      weighting: 25,
    });

    jest.clearAllTimers();
  });

  it("includes Grape Pants during Pharaoh's Treasure Season", () => {
    jest.useFakeTimers();
    jest.setSystemTime(SEASONS["Pharaoh's Treasure"].startDate);

    expect(BASIC_REWARDS()).toContainEqual({
      wearables: { "Grape Pants": 1 },
      weighting: 5,
    });
    expect(RARE_REWARDS()).toContainEqual({
      wearables: { "Grape Pants": 1 },
      weighting: 25,
    });
    expect(LUXURY_REWARDS()).toContainEqual({
      wearables: { "Grape Pants": 1 },
      weighting: 25,
    });

    jest.clearAllTimers();
  });
});
