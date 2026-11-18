import { TEST_FARM } from "./constants";
import { makeGame } from "./transforms";

describe("makeGame", () => {
  // makeGame is an explicit field list, so a field it doesn't name is dropped
  // from every API response.
  it("keeps weather from the API", () => {
    const weather = {
      forecast: [
        { name: "beeMigration", startAt: 1794787200000, endAt: 1795046400000 },
      ],
    };

    const game = makeGame({ ...TEST_FARM, weather });

    expect(game.weather).toEqual({
      forecast: [
        { name: "beeMigration", startAt: 1794787200000, endAt: 1795046400000 },
      ],
    });
  });

  it("leaves a farm with no weather without one", () => {
    const game = makeGame({ ...TEST_FARM });

    expect(game.weather).toBeUndefined();
  });
});
