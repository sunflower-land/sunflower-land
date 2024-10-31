import { getEncyclopediaFish } from "features/island/hud/components/codex/lib/utils";
import { FISH_MILESTONES } from "./milestones";
import { getKeys } from "./decorations";
import { FarmActivityName } from "./farmActivity";
import { FISH } from "./fishing";

describe("fishMilestones", () => {
  it("Makes progress on Deep Sea Diver", () => {
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

  it.each(getKeys(FISH_MILESTONES))("Completes %s", (milestone) => {
    const allCaught = getKeys(FISH).reduce(
      (acc, name) => ({ ...acc, [`${name} Caught`]: 100 }),
      {},
    );

    const progress = FISH_MILESTONES[milestone].percentageComplete(allCaught);

    expect(progress).toBe(100);
  });

  it("Allows Marine Marvel Master to be completed without Crimson Carp", () => {
    const allCaught = getKeys(FISH).reduce(
      (acc, name) => ({ ...acc, [`${name} Caught`]: 100 }),
      {} as Partial<Record<FarmActivityName, number>>,
    );

    delete allCaught["Crimson Carp Caught"];

    const progress =
      FISH_MILESTONES["Marine Marvel Master"].percentageComplete(allCaught);

    expect(progress).toBe(100);
  });

  it("Allows Marine Marvel Master to be completed without Kraken Tentacle", () => {
    const allCaught = getKeys(FISH).reduce(
      (acc, name) => ({ ...acc, [`${name} Caught`]: 100 }),
      {} as Partial<Record<FarmActivityName, number>>,
    );

    delete allCaught["Kraken Tentacle Caught"];

    const progress =
      FISH_MILESTONES["Marine Marvel Master"].percentageComplete(allCaught);

    expect(progress).toBe(100);
  });
});
