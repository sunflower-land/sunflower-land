import type { GameState } from "features/game/types/game";
import type { BoostName } from "features/game/types/game";
import { getBoostedCraftingTime } from "features/game/events/landExpansion/startCrafting";
import {
  getBoostContributionEntries,
  getCraftingBoostContributions,
} from "features/game/lib/boostContributions";
import { getPreActionDisplay } from "features/game/lib/timerDisplay";
import {
  getCraftingBoostWindows,
  getEffectiveSpeedAt,
} from "features/game/lib/boostWindows";
import { secondsToString } from "lib/utils/time";

export type CraftingTimePreview = {
  /** The number to show, in seconds. */
  displaySeconds: number;
  /** The live rate, or 1 when nothing is running. */
  speed: number;
  /** The recipe's unmodified time, for the struck-through comparison. */
  baseSeconds: number;
  /** Everything to list in the boost panel — baked AND windowed. */
  boosts: { name: BoostName; value: string }[];
  /** Whether the panel has boosts to list (and so should be clickable). */
  hasNamedBoosts: boolean;
  /** Whether to use the boosted layout. */
  isBoosted: boolean;
};

/**
 * The time a recipe would take if it were queued now, and the boosts to credit
 * for it — the one place all four crafting previews get their numbers, so the
 * modal, the two recipe grids and the optimistic slot cannot drift apart.
 *
 * Two kinds of boost meet here. PERMANENT ones (Sol & Luna, Architect Ruler) are
 * baked into the duration and already named in `boostsUsed`. WINDOWED ones (Fox
 * Shrine, the totems) are not in the duration at all — they are a live rate — so
 * they have to be named separately from `boostContributions`, or the panel would
 * silently list nothing for them.
 *
 * `at` should be when the craft would actually START (the box-free time), not
 * `now`: a booster that will have expired by the time a queued craft begins must
 * not be promised here.
 */
export function getCraftingTimePreview({
  state,
  timeMs,
  at,
}: {
  state: GameState;
  timeMs: number;
  at: number;
}): CraftingTimePreview {
  // No prngArgs: this is a preview, so it must not consume a Fox Shrine roll.
  const {
    seconds: bakedMs,
    baseDurationMs,
    boostsUsed,
  } = getBoostedCraftingTime({
    game: state,
    time: timeMs,
    now: at,
  });

  // `baseDurationMs` is set only when the craft would be created as a WINDOWED
  // one, so it doubles as the SPEED_BOOSTS gate. Nothing has STARTED here, so
  // unlike the in-world timers there is no marker on a craft to read: flag off,
  // the boosters are already baked into `bakedMs` and named in `boostsUsed`, and
  // applying the windows on top would count them twice - the same hole
  // `seedBoostWindows` closes for crops, flowers and resource nodes.
  // `getCraftingBoostContributions` gates itself, so it needs no guard here.
  const windows =
    baseDurationMs === undefined ? [] : getCraftingBoostWindows(state);

  const windowedBoosts = getBoostContributionEntries({
    contributions: getCraftingBoostContributions(state, at),
    seconds: bakedMs / 1000,
    at,
    formatSeconds: (seconds) => secondsToString(seconds, { length: "medium" }),
  });

  const boosts = [...boostsUsed, ...windowedBoosts];

  const { displaySeconds, hasNamedBoosts, isBoosted } = getPreActionDisplay({
    seconds: bakedMs / 1000,
    baseSeconds: timeMs / 1000,
    namedBoostCount: boosts.length,
    windows,
    at,
  });

  return {
    displaySeconds,
    // The rate the craft would run at when it starts. A boosted craft is shown
    // to the minute rather than the hour, so a rate change is visible.
    speed: getEffectiveSpeedAt({ at, windows }),
    baseSeconds: timeMs / 1000,
    boosts,
    hasNamedBoosts,
    isBoosted,
  };
}
