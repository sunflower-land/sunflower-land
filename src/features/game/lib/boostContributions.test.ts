import {
  getBoostContributionEntries,
  getNodeBoostContributions,
  getSeedBoostContributions,
} from "./boostContributions";
import { getNodeBoostWindows, getSeedBoostWindows } from "./seedBoostWindows";
import { TEST_FARM } from "./constants";
import type { GameState } from "../types/game";
import type { SeedName } from "../types/seeds";
import type { ResourceName } from "../types/resources";

const createdAt = 1_000_000;
const at = createdAt + 1000;
const HOUR = 60 * 60;

const place = (id: string, x: number) => [
  { id, coordinates: { x, y: 0 }, createdAt },
];

/** Everything windowed placed at once, so every resolver finds something. */
const BOOSTED: GameState = {
  ...TEST_FARM,
  collectibles: {
    ...TEST_FARM.collectibles,
    "Sparrow Shrine": place("1", 0),
    "Harvest Hourglass": place("2", 1),
    "Super Totem": place("3", 2),
    "Timber Hourglass": place("4", 3),
    "Badger Shrine": place("5", 4),
    "Ore Hourglass": place("6", 5),
    "Mole Shrine": place("7", 6),
    "Orchard Hourglass": place("8", 7),
    "Toucan Shrine": place("9", 8),
    "Blossom Hourglass": place("10", 9),
    "Moth Shrine": place("11", 10),
    "Stag Shrine": place("12", 11),
    "Tortoise Shrine": place("13", 12),
  },
};

// The panel's names must describe the SAME windows the readiness maths uses, or
// the list would explain a number it didn't produce. These pin the two together.
describe("contributions match the window builders", () => {
  const flatten = (contributions: { windows: unknown[] }[]): unknown[] =>
    contributions.flatMap(({ windows }) => windows);

  it.each<SeedName>([
    "Sunflower Seed",
    "Apple Seed",
    "Sunpetal Seed",
    "Rice Seed",
    "Grape Seed",
  ])("%s", (seed) => {
    expect(flatten(getSeedBoostContributions(BOOSTED, seed))).toEqual(
      getSeedBoostWindows(BOOSTED, seed),
    );
  });

  it.each<ResourceName>([
    "Tree",
    "Stone Rock",
    "Iron Rock",
    "Gold Rock",
    "Crimstone Rock",
    "Sunstone Rock",
    "Oil Reserve",
  ])("%s", (node) => {
    expect(flatten(getNodeBoostContributions(BOOSTED, node))).toEqual(
      getNodeBoostWindows(BOOSTED, node),
    );
  });
});

describe("getBoostContributionEntries", () => {
  const format = (seconds: number) => `${Math.round(seconds / 60)}m`;
  const entries = (showActualTime: boolean, seconds = 4 * HOUR) =>
    getBoostContributionEntries({
      contributions: getNodeBoostContributions(BOOSTED, "Tree"),
      seconds,
      at,
      showActualTime,
      formatSeconds: format,
      formatSpeed: (speed) => `Speed: ${speed}x`,
    });

  it("shows each booster's rate in the speed view", () => {
    // Trees: merged totems (2×) + Timber Hourglass (1.35×) + Badger Shrine (1.35×).
    expect(entries(false)).toEqual([
      { name: "Super Totem", value: "Speed: 2x" },
      { name: "Timber Hourglass", value: "Speed: 1.35x" },
      { name: "Badger Shrine", value: "Speed: 1.35x" },
    ]);
  });

  it("shows each booster's time saving in the actual-time view", () => {
    const actual = entries(true);

    expect(actual.map((entry) => entry.name)).toEqual([
      "Super Totem",
      "Timber Hourglass",
      "Badger Shrine",
    ]);
    // Every value is a saving, and the 2× totem saves more than a 1.35× shrine.
    actual.forEach((entry) => expect(entry.value).toMatch(/^-\d+m$/));
    const minutes = (value: string) => Number(value.replace(/[-m]/g, ""));
    expect(minutes(actual[0].value)).toBeGreaterThan(minutes(actual[2].value));
  });

  it("shrinks the saving as the booster's window runs out", () => {
    // Same boosts, but a task far longer than the hourglass can cover: the
    // saving is capped by what is left on the window, not the raw multiplier.
    const short = entries(true, 4 * HOUR);
    const long = entries(true, 400 * HOUR);
    const minutes = (value: string) => Number(value.replace(/[-m]/g, ""));

    // The hourglass cannot save more on the long task than its window is worth.
    expect(minutes(long[1].value)).toBeLessThan(minutes(long[0].value) * 10);
    expect(minutes(short[1].value)).toBeGreaterThan(0);
  });

  it("leaves out a booster that is no longer running", () => {
    // Nothing placed → nothing to list, in either view.
    const none = getBoostContributionEntries({
      contributions: getNodeBoostContributions(TEST_FARM, "Tree"),
      seconds: 4 * HOUR,
      at,
      showActualTime: true,
      formatSeconds: format,
      formatSpeed: (speed) => `Speed: ${speed}x`,
    });

    expect(none).toEqual([]);
  });
});
