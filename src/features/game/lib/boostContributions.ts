import type { BoostName, GameState } from "../types/game";
import type { ResourceName, RockName } from "../types/resources";
import type { SeedName } from "../types/seeds";
import { isFlowerSeed } from "../types/flowers";
import { GREENHOUSE_FRUIT_SEEDS, isPatchFruitSeed } from "../types/fruits";
import { GREENHOUSE_SEEDS } from "../types/crops";
import { SEED_TO_PLANT } from "../events/landExpansion/plantGreenhouse";
import type { GreenHouseCropName } from "../types/crops";
import type { GreenHouseFruitName } from "../types/fruits";
import {
  CROP_PLOT_BOOST_SPEED,
  FLOWER_BOOST_SPEED,
  FRUIT_BOOST_SPEED,
  GREENHOUSE_BOOST_SPEED,
  MINE_BOOST_SPEED,
  OIL_BOOST_SPEED,
  TREE_BOOST_SPEED,
  getBoostWindows,
  getEffectiveSpeedAt,
  getMergedTotemWindows,
  getPowerHourWindows,
  getSunshowerWindows,
  type BoostWindow,
} from "./boostWindows";
import { projectSeconds } from "./timerDisplay";
import type { TemporaryCollectibleName } from "./collectibleBuilt";

/**
 * One boost's windows, with the name to show for it.
 *
 * `BoostWindow` is deliberately anonymous — the readiness maths only needs an
 * interval and a rate. The boost PANEL needs to say which booster is responsible,
 * so this pairs the two back up.
 *
 * The per-activity sets below mirror the builders in `boostWindows.ts` exactly;
 * `boostContributions.test.ts` asserts that flattening them reproduces the
 * builder's window set, so the two cannot drift apart.
 */
export type BoostContribution = {
  name: BoostName;
  windows: BoostWindow[];
};

const collectible = (
  game: GameState,
  name: TemporaryCollectibleName,
  speed: number,
): BoostContribution => ({
  name,
  windows: getBoostWindows({ game, name, speed }),
});

/**
 * The two totems are one boost for a given activity (they never stack), so their
 * windows merge into a single set for the timing. The label has to come from
 * whichever is actually running at `at` — Super Totem wins when both are,
 * matching how the legacy baked path recorded it.
 *
 * Note this cannot key off "has any windows": `getBoostWindows` includes
 * finalised intervals from `boostHistory`, so a Super Totem burned earlier this
 * week would otherwise take the credit from a Time Warp Totem running now.
 */
const totems = (
  game: GameState,
  speed: number,
  at: number,
): BoostContribution => {
  const superTotem = getBoostWindows({ game, name: "Super Totem", speed });

  return {
    name:
      getEffectiveSpeedAt({ at, windows: superTotem }) > 1
        ? "Super Totem"
        : "Time Warp Totem",
    windows: getMergedTotemWindows(game, speed),
  };
};

const cropPlot = (game: GameState, at: number): BoostContribution[] => [
  collectible(game, "Sparrow Shrine", CROP_PLOT_BOOST_SPEED["Sparrow Shrine"]),
  collectible(
    game,
    "Harvest Hourglass",
    CROP_PLOT_BOOST_SPEED["Harvest Hourglass"],
  ),
  totems(game, CROP_PLOT_BOOST_SPEED["Super Totem"], at),
  { name: "Power hour", windows: getPowerHourWindows(game) },
  // A season Guardian doubles the sunshower rate rather than adding a window of
  // its own, so the whole thing is attributed to the event.
  { name: "sunshower", windows: getSunshowerWindows(game) },
];

const tree = (game: GameState, at: number): BoostContribution[] => [
  totems(game, TREE_BOOST_SPEED["Super Totem"], at),
  collectible(game, "Timber Hourglass", TREE_BOOST_SPEED["Timber Hourglass"]),
  collectible(game, "Badger Shrine", TREE_BOOST_SPEED["Badger Shrine"]),
];

const fruit = (game: GameState, at: number): BoostContribution[] => [
  totems(game, FRUIT_BOOST_SPEED["Super Totem"], at),
  collectible(
    game,
    "Orchard Hourglass",
    FRUIT_BOOST_SPEED["Orchard Hourglass"],
  ),
  collectible(game, "Toucan Shrine", FRUIT_BOOST_SPEED["Toucan Shrine"]),
];

const flower = (game: GameState, at: number): BoostContribution[] => [
  collectible(
    game,
    "Blossom Hourglass",
    FLOWER_BOOST_SPEED["Blossom Hourglass"],
  ),
  collectible(game, "Moth Shrine", FLOWER_BOOST_SPEED["Moth Shrine"]),
];

const oil = (game: GameState, at: number): BoostContribution[] => [
  collectible(game, "Stag Shrine", OIL_BOOST_SPEED["Stag Shrine"]),
];

const greenhouse = (
  game: GameState,
  plant: GreenHouseCropName | GreenHouseFruitName,
  at: number,
): BoostContribution[] => [
  totems(game, GREENHOUSE_BOOST_SPEED["Super Totem"], at),
  collectible(
    game,
    "Tortoise Shrine",
    GREENHOUSE_BOOST_SPEED["Tortoise Shrine"],
  ),
  plant === "Grape"
    ? collectible(
        game,
        "Orchard Hourglass",
        GREENHOUSE_BOOST_SPEED["Orchard Hourglass"],
      )
    : collectible(
        game,
        "Harvest Hourglass",
        GREENHOUSE_BOOST_SPEED["Harvest Hourglass"],
      ),
];

const mine = (
  game: GameState,
  rock: RockName,
  at: number,
): BoostContribution[] => {
  switch (rock) {
    case "Stone Rock":
    case "Fused Stone Rock":
    case "Reinforced Stone Rock":
      return [
        totems(game, MINE_BOOST_SPEED["Super Totem"], at),
        collectible(game, "Ore Hourglass", MINE_BOOST_SPEED["Ore Hourglass"]),
        collectible(game, "Badger Shrine", MINE_BOOST_SPEED["Badger Shrine"]),
      ];
    case "Iron Rock":
    case "Refined Iron Rock":
    case "Tempered Iron Rock":
    case "Gold Rock":
    case "Pure Gold Rock":
    case "Prime Gold Rock":
      return [
        totems(game, MINE_BOOST_SPEED["Super Totem"], at),
        collectible(game, "Ore Hourglass", MINE_BOOST_SPEED["Ore Hourglass"]),
        collectible(game, "Mole Shrine", MINE_BOOST_SPEED["Mole Shrine"]),
      ];
    case "Crimstone Rock":
      return [
        collectible(game, "Mole Shrine", MINE_BOOST_SPEED["Mole Shrine"]),
      ];
    case "Sunstone Rock":
    case "Ascension Crystal":
      return [];
  }
};

/** The named boosts that would speed up this seed — mirrors getSeedBoostWindows. */
export function getSeedBoostContributions(
  game: GameState,
  seed: SeedName,
  at: number,
): BoostContribution[] {
  if (isFlowerSeed(seed)) return flower(game, at);
  if (isPatchFruitSeed(seed)) return fruit(game, at);
  if (seed in GREENHOUSE_SEEDS || seed in GREENHOUSE_FRUIT_SEEDS) {
    return greenhouse(
      game,
      SEED_TO_PLANT[seed as keyof typeof SEED_TO_PLANT],
      at,
    );
  }

  return cropPlot(game, at);
}

/** The named boosts that would speed up this node — mirrors getNodeBoostWindows. */
export function getNodeBoostContributions(
  game: GameState,
  node: ResourceName,
  at: number,
): BoostContribution[] {
  if (node === "Tree") return tree(game, at);
  if (node === "Oil Reserve") return oil(game, at);
  if (node.endsWith("Rock")) return mine(game, node as RockName, at);

  return [];
}

/**
 * Boost-panel rows for the windowed boosts running right now, in the same
 * `{ name, value }` shape as the baked `boostsUsed` the panels already list.
 *
 * What the value says depends on the reading, so the boost is stated once and in
 * the same terms as the time beside it:
 *
 * - Speed view: the rate it is running at — `1.35x`.
 * - Actual-time view: the time it actually saves on THIS task — its marginal
 *   contribution, i.e. how much longer the task would take without it. A booster
 *   about to expire therefore shows a small saving even though its rate is
 *   unchanged, which is the whole point of the projection.
 *
 * Boosts not covering `at` (expired, or only in `boostHistory`) are left out:
 * they do nothing for a task started now.
 */
export function getBoostContributionEntries({
  contributions,
  seconds,
  at,
  showActualTime,
  formatSeconds,
  formatSpeed,
}: {
  contributions: BoostContribution[];
  seconds: number;
  at: number;
  showActualTime: boolean;
  /** How to render a duration — the caller's `secondsToString`. */
  formatSeconds: (seconds: number) => string;
  /** How to render a rate — the caller's translated "Speed: {{speed}}x". */
  formatSpeed: (speed: number) => string;
}): { name: BoostName; value: string }[] {
  const active = contributions.filter(
    ({ windows }) => getEffectiveSpeedAt({ at, windows }) > 1,
  );
  if (active.length === 0) return [];

  const allWindows = active.flatMap(({ windows }) => windows);
  const boostedSeconds = projectSeconds({ seconds, windows: allWindows, at });

  return active.map(({ name, windows }) => {
    if (!showActualTime) {
      return {
        name,
        value: formatSpeed(
          Number(getEffectiveSpeedAt({ at, windows }).toFixed(2)),
        ),
      };
    }

    // Marginal saving: how much longer this task would take without this one
    // boost, everything else unchanged.
    const withoutThis = projectSeconds({
      seconds,
      windows: allWindows.filter((window) => !windows.includes(window)),
      at,
    });

    return { name, value: `-${formatSeconds(withoutThis - boostedSeconds)}` };
  });
}
