import "lib/__mocks__/configMock";

import { getEncyclopediaFish } from "features/island/hud/components/codex/lib/utils";
import { FISH_MILESTONES } from "./milestones";

describe("fishMilestones", () => {
  it.only("Makes progress on Deep Sea Diver", () => {
    const totalFish = getEncyclopediaFish().length;

    const progress = FISH_MILESTONES["Deep Sea Diver"].percentageComplete({
      "Anchovy Caught": 6,
      "Red Snapper Caught": 5,
      "Squid Caught": 2,
    });

    expect(progress).toBe((2 / totalFish) * 100);
  });

  it("Completes Deep Sea Diver", () => {
    const allCaught = getEncyclopediaFish().reduce(
      (acc, name) => ({ ...acc, [`${name} Caught`]: 5 }),
      {},
    );

    const progress =
      FISH_MILESTONES["Deep Sea Diver"].percentageComplete(allCaught);

    expect(progress).toBe(100);
  });
});
