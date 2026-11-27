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
  ANIMAL_SLEEP_SHRINE,
  COOKING_BOOST_SPEED,
  CRAFTING_BOOST_SPEED,
  CROP_MACHINE_BOOST_SPEED,
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
  getSunshowerGuardianWindows,
  getSunshowerWindows,
  getWeatherFloodWindows,
  getWeatherSunShowerWindows,
  withoutWindows,
  type BoostWindow,
} from "./boostWindows";
import { GUARDIAN_BOOST } from "./getActiveGuardian";
import { getKeys } from "lib/object";
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
 *
 * The Flood is in those sets too, as a `slowdown`: it slows the task rather
 * than speeding it, so it's never listed as a boost. The panel shows it as its
 * own row instead (`getSlowdownEntries`), and the boosters' savings are
 * measured from the Flood-slowed time (see `getBoostContributionEntries`).
 */
export type BoostContribution = NamedContribution | Slowdown;

type NamedContribution = { name: BoostName; windows: BoostWindow[] };
type Slowdown = { slowdown: SlowdownName; windows: BoostWindow[] };

/** What can slow a task down: an unprotected weather Flood. */
export type SlowdownName = "flood";

/** A boost-panel row for the time a slowdown adds, e.g. `+4hrs` for a Flood. */
export type SlowdownEntry = { slowdown: SlowdownName; value: string };

/** A boost-panel row: a named boost, or the time a slowdown adds. */
export type BoostPanelEntry =
  | { name: BoostName; value: string }
  | SlowdownEntry;

export const isSlowdownEntry = (entry: {
  value: string;
}): entry is SlowdownEntry => "slowdown" in entry;

/**
 * How many rows name a boost. A slowdown row explains a longer time but is no
 * boost, so it doesn't make a panel clickable on its own.
 */
export const countNamedBoosts = (entries: { value: string }[]): number =>
  entries.filter((entry) => !isSlowdownEntry(entry)).length;

const isSlowdown = (
  contribution: BoostContribution,
): contribution is Slowdown => "slowdown" in contribution;

/** An unprotected weather Flood's 0.5× windows (see `getWeatherFloodWindows`). */
const flood = (game: GameState): Slowdown => ({
  slowdown: "flood",
  windows: getWeatherFloodWindows(game),
});

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

const cropPlot = (game: GameState, at: number): BoostContribution[] => {
  const weather = getWeatherSunShowerWindows(game);

  return [
    collectible(
      game,
      "Sparrow Shrine",
      CROP_PLOT_BOOST_SPEED["Sparrow Shrine"],
    ),
    collectible(
      game,
      "Harvest Hourglass",
      CROP_PLOT_BOOST_SPEED["Harvest Hourglass"],
    ),
    totems(game, CROP_PLOT_BOOST_SPEED["Super Totem"], at),
    { name: "Power hour", windows: getPowerHourWindows(game) },
    // One entry for both Sun Showers. Calendar records only count where no
    // weather Sun Shower runs (see getCropPlotBoostWindows), so the two never
    // overlap. The weather pieces already include the Shade Cloth and the
    // Guardian (1.3× / 1.6× / 2×).
    {
      name: "sunshower",
      windows: [
        ...withoutWindows(getSunshowerWindows(game), weather),
        ...weather,
      ],
    },
    // Only the Guardian placed during a sunshower speeds crops up, and only for
    // the time it was out — so it gets its own windows, credited to the Guardian.
    ...getKeys(GUARDIAN_BOOST).map((guardian) => ({
      name: guardian,
      windows: withoutWindows(
        getSunshowerGuardianWindows(game, guardian),
        weather,
      ),
    })),
    flood(game),
  ];
};

const tree = (game: GameState, at: number): BoostContribution[] => [
  totems(game, TREE_BOOST_SPEED["Super Totem"], at),
  collectible(game, "Timber Hourglass", TREE_BOOST_SPEED["Timber Hourglass"]),
  collectible(game, "Badger Shrine", TREE_BOOST_SPEED["Badger Shrine"]),
  flood(game),
];

const fruit = (game: GameState, at: number): BoostContribution[] => [
  totems(game, FRUIT_BOOST_SPEED["Super Totem"], at),
  collectible(
    game,
    "Orchard Hourglass",
    FRUIT_BOOST_SPEED["Orchard Hourglass"],
  ),
  collectible(game, "Toucan Shrine", FRUIT_BOOST_SPEED["Toucan Shrine"]),
  flood(game),
];

const flower = (game: GameState, at: number): BoostContribution[] => [
  collectible(
    game,
    "Blossom Hourglass",
    FLOWER_BOOST_SPEED["Blossom Hourglass"],
  ),
  collectible(game, "Moth Shrine", FLOWER_BOOST_SPEED["Moth Shrine"]),
  flood(game),
];

/**
 * Animal sleep has at most one temporary boost, decided by the animal's type
 * (Pigs have none), so there is nothing for the totem merge to do here —
 * mirrors `getAnimalBoostWindows`.
 */
const animal = (
  game: GameState,
  animalType: AnimalType,
): BoostContribution[] => {
  const name = ANIMAL_SLEEP_SHRINE[animalType];
  if (!name) return [];

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

/**
 * Crafting's windowed boosts — mirrors `getCraftingBoostWindows`, in the same
 * order. Fox Shrine is a MIXED boost: only its craft-TIME half is a window, so
 * only that half is named here; its 10% instant-craft proc is a discrete roll and
 * stays in `boostsUsed`.
 */
const crafting = (game: GameState, at: number): BoostContribution[] => [
  totems(game, CRAFTING_BOOST_SPEED["Super Totem"], at),
  collectible(game, "Fox Shrine", CRAFTING_BOOST_SPEED["Fox Shrine"]),
];

const oil = (game: GameState, at: number): BoostContribution[] => [
  collectible(game, "Stag Shrine", OIL_BOOST_SPEED["Stag Shrine"]),
  flood(game),
];

/**
 * The crop machine's windowed boosts — mirrors `getCropMachineBoostWindows`:
 * the Tortoise Shrine alone (no totems, no hourglasses). Only its crop-machine
 * half is named here; the greenhouse half is listed by `greenhouse` above.
 */
const cropMachine = (game: GameState): BoostContribution[] => [
  collectible(
    game,
    "Tortoise Shrine",
    CROP_MACHINE_BOOST_SPEED["Tortoise Shrine"],
  ),
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
): BoostContribution[] =>
  rock === "Ascension Crystal"
    ? []
    : [...rockBoosts(game, rock, at), flood(game)];

const rockBoosts = (
  game: GameState,
  rock: Exclude<RockName, "Ascension Crystal">,
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
      return [];
  }
};

/**
 * The named boosts that would speed up this seed — mirrors getSeedBoostWindows.
 */
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

/** The named boosts that would speed up a craft — mirrors getCraftingBoostWindows. */
export function getCraftingBoostContributions(
  game: GameState,
  at: number,
): BoostContribution[] {
  return crafting(game, at);
}

/** The named boosts that would speed up a crop machine pack — mirrors getCropMachineBoostWindows. */
export function getCropMachineBoostContributions(
  game: GameState,
): BoostContribution[] {
  return cropMachine(game);
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
  baseline,
  seconds,
  at,
}: {
  contributions: BoostContribution[];
  /** Windows in force whichever boosts run (the Flood), measured from. */
  baseline: BoostWindow[];
  seconds: number;
  at: number;
}): number[] {
  const count = contributions.length;
  const savings = new Map<number, number>();
  const baseSeconds = projectSeconds({ seconds, windows: baseline, at });

  /** Time saved by exactly the subset of boosts in `mask`. */
  const savingOf = (mask: number): number => {
    const cached = savings.get(mask);
    if (cached !== undefined) return cached;

    const windows = [
      ...baseline,
      ...contributions.flatMap((contribution, index) =>
        (mask >> index) & 1 ? contribution.windows : [],
      ),
    ];
    const saving = baseSeconds - projectSeconds({ seconds, windows, at });

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
 * Each row is the boost's share of the time saved on THIS task, split so the
 * rows account for the whole saving (see `getShapleySavings`) — the same terms
 * as the projected time beside it. A booster about to expire therefore shows a
 * small saving even though its rate is unchanged, which is the whole point of
 * the projection.
 *
 * Boosts not covering `at` (expired, or only in `boostHistory`) are left out:
 * they do nothing for a task started now.
 */
export function getBoostContributionEntries({
  contributions,
  seconds,
  at,
  formatSeconds,
}: {
  contributions: BoostContribution[];
  seconds: number;
  at: number;
  /** How to render a duration — the caller's `secondsToString`. */
  formatSeconds: (seconds: number) => string;
}): { name: BoostName; value: string }[] {
  const active = contributions.filter(
    (contribution): contribution is NamedContribution =>
      !isSlowdown(contribution) &&
      getEffectiveSpeedAt({ at, windows: contribution.windows }) > 1,
  );
  if (active.length === 0) return [];

  // The Flood runs whichever boosts do, so every saving is measured from the
  // Flood-slowed time.
  const baseline = contributions
    .filter(isSlowdown)
    .flatMap(({ windows }) => windows);

  const shares = getShapleySavings({
    contributions: active,
    baseline,
    seconds,
    at,
  });

  return active.map(({ name }, index) => ({
    name,
    value: `-${formatSeconds(shares[index])}`,
  }));
}

/**
 * Boost-panel rows for the time a slowdown (an unprotected Flood) adds to this
 * task, measured on its own from the un-slowed `seconds`.
 *
 * The panel lists Base, the named boosts baked into `seconds`, this row, then
 * the windowed boosters' savings, which are measured from the Flood-slowed
 * time — so the rows add up to the projected time beside them.
 *
 * A slowdown not covering the task adds nothing and is left out.
 */
export function getSlowdownEntries({
  contributions,
  seconds,
  at,
  formatSeconds,
}: {
  contributions: BoostContribution[];
  seconds: number;
  at: number;
  /** How to render a duration — the caller's `secondsToString`. */
  formatSeconds: (seconds: number) => string;
}): SlowdownEntry[] {
  return contributions.filter(isSlowdown).flatMap(({ slowdown, windows }) => {
    const added = projectSeconds({ seconds, windows, at }) - seconds;

    // Under a second is float noise from projecting through a Flood window
    // that doesn't cover the task (it would format as "+0secs").
    return added >= 1 ? [{ slowdown, value: `+${formatSeconds(added)}` }] : [];
  });
}
