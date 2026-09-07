import { useContext } from "react";
import { Context } from "features/game/GameProvider";
import type { GameState } from "features/game/types/game";
import type { BoostName } from "features/game/types/game";
import { getBoostedCraftingTime } from "features/game/events/landExpansion/startCrafting";
import {
  getBoostContributionEntries,
  getCraftingBoostContributions,
} from "features/game/lib/boostContributions";
import { getPreActionDisplay } from "features/game/lib/timerDisplay";
import { getCraftingBoostWindows } from "features/game/lib/boostWindows";
import { secondsToString } from "lib/utils/time";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

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
  showActualTime,
  formatSpeed,
}: {
  state: GameState;
  timeMs: number;
  at: number;
  showActualTime: boolean;
  /** The caller's translated "Speed: {{speed}}x". */
  formatSpeed: (speed: number) => string;
}): CraftingTimePreview {
  // No prngArgs: this is a preview, so it must not consume a Fox Shrine roll.
  const { seconds: bakedMs, boostsUsed } = getBoostedCraftingTime({
    game: state,
    time: timeMs,
    now: at,
  });

  const windows = getCraftingBoostWindows(state);

  const windowedBoosts = getBoostContributionEntries({
    contributions: getCraftingBoostContributions(state, at),
    seconds: bakedMs / 1000,
    at,
    showActualTime,
    formatSeconds: (seconds) => secondsToString(seconds, { length: "medium" }),
    formatSpeed,
  });

  const boosts = [...boostsUsed, ...windowedBoosts];

  const { displaySeconds, speed, hasNamedBoosts, isBoosted } =
    getPreActionDisplay({
      showActualTime,
      seconds: bakedMs / 1000,
      baseSeconds: timeMs / 1000,
      namedBoostCount: boosts.length,
      windows,
      at,
    });

  return {
    displaySeconds,
    speed,
    baseSeconds: timeMs / 1000,
    boosts,
    hasNamedBoosts,
    isBoosted,
  };
}

/**
 * `getCraftingTimePreview` bound to the current translation and time-display
 * setting. The plain function above is what the recipe GRIDS use, since they
 * compute a preview per row inside a map and so cannot call a hook.
 */
export function useCraftingTimePreview(args: {
  state: GameState;
  timeMs: number;
  at: number;
}): CraftingTimePreview {
  const { t } = useAppTranslation();
  const { showActualTime } = useContext(Context);

  return getCraftingTimePreview({
    ...args,
    showActualTime,
    formatSpeed: (speed) => t("description.boostedSpeed", { speed }),
  });
}
