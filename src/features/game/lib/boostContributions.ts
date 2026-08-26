import type { BoostName, GameState } from "../types/game";
import type { ResourceName, RockName } from "../types/resources";
import type { SeedName } from "../types/seeds";
import { isFlowerSeed } from "../types/flowers";
import { GREENHOUSE_FRUIT_SEEDS, isPatchFruitSeed } from "../types/fruits";
import { GREENHOUSE_SEEDS } from "../types/crops";
import { SEED_TO_PLANT } from "../events/landExpansion/plantGreenhouse";
import type { GreenHouseCropName } from "../types/crops";
import type { GreenHouseFruitName } from "../types/fruits";
import type { AnimalType } from "../types/animals";
import {
  ANIMAL_BOOST_SPEED,
  COOKING_BOOST_SPEED,
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

/**
 * Animal sleep has exactly one temporary boost, decided by the animal's type, so
 * there is nothing for the totem merge to do here — mirrors `getAnimalBoostWindows`.
 */
const animal = (
  game: GameState,
  animalType: AnimalType,
): BoostContribution[] => {
  const name = animalType === "Chicken" ? "Bantam Shrine" : "Collie Shrine";

  return [collectible(game, name, ANIMAL_BOOST_SPEED[name])];
};

/**
 * Cooking's windowed boosts — mirrors `getCookingBoostWindows`, in the same order.
 * Legendary Shrine and Boar Shrine are MIXED boosts; only their cook-TIME half is
 * windowed, so only that half is named here.
 */
const cooking = (game: GameState, at: number): BoostContribution[] => [
  totems(game, COOKING_BOOST_SPEED["Super Totem"], at),
  collectible(
    game,
    "Gourmet Hourglass",
    COOKING_BOOST_SPEED["Gourmet Hourglass"],
  ),
  collectible(
    game,
    "Legendary Shrine",
    COOKING_BOOST_SPEED["Legendary Shrine"],
  ),
  collectible(game, "Boar Shrine", COOKING_BOOST_SPEED["Boar Shrine"]),
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

/** The named boosts that would speed up a recipe — mirrors getCookingBoostWindows. */
export function getCookingBoostContributions(
  game: GameState,
  at: number,
): BoostContribution[] {
  return cooking(game, at);
}

/** The named boosts that would speed up this animal's sleep. */
export function getAnimalBoostContributions(
  game: GameState,
  animalType: AnimalType,
): BoostContribution[] {
  return animal(game, animalType);
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

/** Number of set bits — how many boosts are in a subset mask. */
const subsetSize = (mask: number): number => {
  let size = 0;
  for (let bits = mask; bits > 0; bits >>= 1) size += bits & 1;
  return size;
};

/**
 * Split the total time saved between the boosts responsible, so the parts sum to
 * the whole.
 *
 * The obvious attribution — "how much longer would this take without this one
 * boost?" — is wrong for a panel that reads as a breakdown. Speeds MULTIPLY, so
 * part of the saving exists only because two boosts are running together, and that
 * part is credited to neither. On a 505s cook under a 2× hourglass and a 1.25×
 * shrine the two marginals come to 4m12s against a real saving of 5m03s; the
 * missing 51s is the overlap. The more boosts running, the worse it gets.
 *
 * So each boost gets its Shapley value: its average marginal contribution across
 * every order the boosts could have been applied in. Those are exact by
 * construction — they always sum to the joint saving — and they stay honest about
 * partial coverage, because every subset is measured with a real projection rather
 * than from the raw multipliers. A booster with ten minutes left on its window is
 * credited for ten minutes' worth, not for its rate.
 *
 * Cost is 2^n projections, and n is the number of boosts an activity can run at
 * once — at most five today, so at most 32.
 */
function getShapleySavings({
  contributions,
  seconds,
  at,
}: {
  contributions: BoostContribution[];
  seconds: number;
  at: number;
}): number[] {
  const count = contributions.length;
  const savings = new Map<number, number>();

  /** Time saved by exactly the subset of boosts in `mask`. */
  const savingOf = (mask: number): number => {
    const cached = savings.get(mask);
    if (cached !== undefined) return cached;

    const windows = contributions.flatMap((contribution, index) =>
      (mask >> index) & 1 ? contribution.windows : [],
    );
    const saving = seconds - projectSeconds({ seconds, windows, at });

    savings.set(mask, saving);
    return saving;
  };

  const factorials = [1];
  for (let n = 1; n <= count; n++) factorials[n] = factorials[n - 1] * n;

  const shares = new Array<number>(count).fill(0);

  for (let mask = 0; mask < 1 << count; mask++) {
    const size = subsetSize(mask);

    for (let index = 0; index < count; index++) {
      // Only orders where this boost is the one being added to `mask`.
      if ((mask >> index) & 1) continue;

      const weight =
        (factorials[size] * factorials[count - size - 1]) / factorials[count];

      shares[index] +=
        weight * (savingOf(mask | (1 << index)) - savingOf(mask));
    }
  }

  return shares;
}

/**
 * Boost-panel rows for the windowed boosts running right now, in the same
 * `{ name, value }` shape as the baked `boostsUsed` the panels already list.
 *
 * What the value says depends on the reading, so the boost is stated once and in
 * the same terms as the time beside it:
 *
 * - Speed view: the rate it is running at — `1.35x`.
 * - Actual-time view: its share of the time saved on THIS task, split so the rows
 *   account for the whole saving (see `getShapleySavings`). A booster about to
 *   expire therefore shows a small saving even though its rate is unchanged, which
 *   is the whole point of the projection.
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

  if (!showActualTime) {
    return active.map(({ name, windows }) => ({
      name,
      value: formatSpeed(
        Number(getEffectiveSpeedAt({ at, windows }).toFixed(2)),
      ),
    }));
  }

  const shares = getShapleySavings({ contributions: active, seconds, at });

  return active.map(({ name }, index) => ({
    name,
    value: `-${formatSeconds(shares[index])}`,
  }));
}
