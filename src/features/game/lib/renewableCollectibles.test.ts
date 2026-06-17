import { TEST_FARM } from "features/game/lib/constants";
import { getWeatherRenewalRequirements } from "./renewableCollectibles";

describe("getWeatherRenewalRequirements", () => {
  it("throws a controlled error when a weather shop entry is missing", () => {
    expect(() =>
      getWeatherRenewalRequirements({
        game: TEST_FARM,
        name: "Missing Weather Item" as never,
      }),
    ).toThrow(
      "Missing weather collectible entry for Missing Weather Item on island type basic",
    );
  });
});
