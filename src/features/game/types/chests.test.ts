import { BASIC_REWARDS, LUXURY_REWARDS, RARE_REWARDS } from "./chests";
import { SEASONS } from "./seasons";

describe("SEASONAL_REWARDS", () => {
  it("does not include Cow Scratcher during Pharaoh's Treasure Season", () => {
    jest.useFakeTimers();
    jest.setSystemTime(SEASONS["Pharaoh's Treasure"].startDate);

    expect(BASIC_REWARDS()).not.toContainEqual({
      items: { "Cow Scratcher": 1 },
      weighting: 5,
    });
    expect(RARE_REWARDS()).not.toContainEqual({
      items: { "Cow Scratcher": 1 },
      weighting: 25,
    });
    expect(LUXURY_REWARDS()).not.toContainEqual({
      items: { "Cow Scratcher": 1 },
      weighting: 25,
    });

    jest.clearAllTimers();
  });

  it("includes Cow Scratcher during Bull Run Season because we love to see Cows scratching their back", () => {
    jest.useFakeTimers();
    jest.setSystemTime(SEASONS["Bull Run"].startDate);

    expect(BASIC_REWARDS()).toContainEqual({
      items: { "Cow Scratcher": 1 },
      weighting: 2250,
    });
    expect(RARE_REWARDS()).toContainEqual({
      items: { "Cow Scratcher": 1 },
      weighting: 11250,
    });
    expect(LUXURY_REWARDS()).toContainEqual({
      items: { "Cow Scratcher": 1 },
      weighting: 11250,
    });

    jest.clearAllTimers();
  });
});
