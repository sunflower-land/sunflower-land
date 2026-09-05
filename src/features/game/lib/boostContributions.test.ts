import {
  getAnimalBoostContributions,
  getBoostContributionEntries,
  getCookingBoostContributions,
  getCropMachineBoostContributions,
  getNodeBoostContributions,
  getSeedBoostContributions,
} from "./boostContributions";
import { getNodeBoostWindows, getSeedBoostWindows } from "./seedBoostWindows";
import { TEST_FARM } from "./constants";
import { projectSeconds } from "./timerDisplay";
import type { GameState } from "../types/game";
import type { SeedName } from "../types/seeds";
import type { ResourceName } from "../types/resources";
import type { AnimalType } from "../types/animals";
import {
  getAnimalBoostWindows,
  getCookingBoostWindows,
  getCropMachineBoostWindows,
} from "./boostWindows";
import { CONFIG } from "lib/config";

const setNetwork = (network: "mainnet" | "amoy") => {
  (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = network;
};

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
    "Collie Shrine": place("14", 13),
    "Bantam Shrine": place("15", 14),
    "Gourmet Hourglass": place("16", 15),
    "Legendary Shrine": place("17", 16),
    "Boar Shrine": place("18", 17),
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
    expect(flatten(getSeedBoostContributions(BOOSTED, seed, at))).toEqual(
      getSeedBoostWindows(BOOSTED, seed),
    );
  });

  it.each<AnimalType>(["Chicken", "Cow", "Sheep"])("%s", (animalType) => {
    expect(flatten(getAnimalBoostContributions(BOOSTED, animalType))).toEqual(
      getAnimalBoostWindows(BOOSTED, animalType),
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
    expect(flatten(getNodeBoostContributions(BOOSTED, node, at))).toEqual(
      getNodeBoostWindows(BOOSTED, node),
    );
  });

  it("cooking", () => {
    expect(flatten(getCookingBoostContributions(BOOSTED, at))).toEqual(
      getCookingBoostWindows(BOOSTED),
    );
  });

  it("crop machine", () => {
    expect(flatten(getCropMachineBoostContributions(BOOSTED))).toEqual(
      getCropMachineBoostWindows(BOOSTED),
    );
  });
});

describe("getBoostContributionEntries", () => {
  const format = (seconds: number) => `${Math.round(seconds / 60)}m`;
  const entries = (showActualTime: boolean, seconds = 4 * HOUR) =>
    getBoostContributionEntries({
      contributions: getNodeBoostContributions(BOOSTED, "Tree", at),
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

  // The panel is read as a breakdown: if the listed savings do not account for the
  // gap between the struck-through base time and the time shown, the numbers look
  // wrong. Speeds MULTIPLY, so a plain "how much longer without this one" per boost
  // credits the overlap to neither and silently under-reports the total.
  it("splits the whole saving between the boosters, leaving nothing unattributed", () => {
    const seconds = 4 * HOUR;
    const contributions = getNodeBoostContributions(BOOSTED, "Tree", at);

    const listed = getBoostContributionEntries({
      contributions,
      seconds,
      at,
      showActualTime: true,
      formatSeconds: (value) => String(value),
      formatSpeed: (speed) => `Speed: ${speed}x`,
    });

    const summed = listed.reduce(
      (total, entry) => total + Number(entry.value.replace("-", "")),
      0,
    );

    const totalSaving =
      seconds -
      projectSeconds({
        seconds,
        windows: contributions.flatMap(({ windows }) => windows),
        at,
      });

    expect(summed).toBeCloseTo(totalSaving, 6);
  });

  it("leaves out a booster that is no longer running", () => {
    // Nothing placed → nothing to list, in either view.
    const none = getBoostContributionEntries({
      contributions: getNodeBoostContributions(TEST_FARM, "Tree", at),
      seconds: 4 * HOUR,
      at,
      showActualTime: true,
      formatSeconds: format,
      formatSpeed: (speed) => `Speed: ${speed}x`,
    });

    expect(none).toEqual([]);
  });
});

describe("totem attribution", () => {
  const format = (seconds: number) => `${Math.round(seconds / 60)}m`;

  it("credits the totem that is actually running, not one burned earlier", () => {
    // A Super Totem burned last week leaves a finalised interval in
    // boostHistory. The Time Warp Totem running now must take the credit.
    const game: GameState = {
      ...TEST_FARM,
      collectibles: {
        ...TEST_FARM.collectibles,
        "Time Warp Totem": place("1", 0),
      },
      boostHistory: {
        "Super Totem": [
          { from: createdAt - 8 * 60 * 60 * 1000, to: createdAt - 1000 },
        ],
      },
    };

    const entries = getBoostContributionEntries({
      contributions: getNodeBoostContributions(game, "Tree", at),
      seconds: 4 * HOUR,
      at,
      showActualTime: false,
      formatSeconds: format,
      formatSpeed: (speed) => `Speed: ${speed}x`,
    });

    expect(entries).toEqual([{ name: "Time Warp Totem", value: "Speed: 2x" }]);
  });

  it("credits the Super Totem while it is the one running", () => {
    const game: GameState = {
      ...TEST_FARM,
      collectibles: {
        ...TEST_FARM.collectibles,
        "Super Totem": place("1", 0),
        "Time Warp Totem": place("2", 1),
      },
    };

    const entries = getBoostContributionEntries({
      contributions: getNodeBoostContributions(game, "Tree", at),
      seconds: 4 * HOUR,
      at,
      showActualTime: false,
      formatSeconds: format,
      formatSpeed: (speed) => `Speed: ${speed}x`,
    });

    expect(entries).toEqual([{ name: "Super Totem", value: "Speed: 2x" }]);
  });
});

// The contributions name the windows for the boost panel, so they have to
// disappear with them: without `SPEED_BOOSTS` the boosters are baked into the
// time and already listed in `boostsUsed`, and a "Speed: 1.35x" row beside that
// would claim the same boost a second time.
describe("without SPEED_BOOSTS", () => {
  const originalNetwork = CONFIG.NETWORK;
  beforeEach(() => setNetwork("mainnet"));
  afterAll(() => setNetwork(originalNetwork));

  it("names no boosters for a seed", () => {
    expect(getSeedBoostContributions(BOOSTED, "Sunpetal Seed", at)).toEqual([]);
    expect(getSeedBoostContributions(BOOSTED, "Grape Seed", at)).toEqual([]);
  });

  it("names no boosters for a node", () => {
    expect(getNodeBoostContributions(BOOSTED, "Tree", at)).toEqual([]);
  });

  it("names no boosters for cooking or an animal", () => {
    expect(getCookingBoostContributions(BOOSTED, at)).toEqual([]);
    expect(getAnimalBoostContributions(BOOSTED, "Chicken")).toEqual([]);
  });

  it("names no boosters for the crop machine", () => {
    expect(getCropMachineBoostContributions(BOOSTED)).toEqual([]);
  });

  it("leaves the panel with nothing to add", () => {
    expect(
      getBoostContributionEntries({
        contributions: getNodeBoostContributions(BOOSTED, "Tree", at),
        seconds: 4 * HOUR,
        at,
        showActualTime: false,
        formatSeconds: (seconds) => `${Math.round(seconds / 60)}m`,
        formatSpeed: (speed) => `Speed: ${speed}x`,
      }),
    ).toEqual([]);
  });
});
