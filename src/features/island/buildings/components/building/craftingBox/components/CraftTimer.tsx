import React, { useState } from "react";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import type { Recipe } from "features/game/lib/crafting";
import type { GameState } from "features/game/types/game";
import { SquareIcon } from "components/ui/SquareIcon";
import { BoostsDisplay } from "components/ui/layouts/BoostsDisplay";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
import { PRE_ACTION_TICK_MS } from "features/game/lib/timerDisplay";
import { getCraftingTimePreview } from "./craftingTimePreview";

const RecipeLabelContent: React.FC<{
  state: GameState;
  recipe: Recipe | null;
  /** When the craft would actually start — the box-free time, or now. */
  startsAt?: number;
}> = ({ state, recipe, startsAt }) => {
  const { t } = useAppTranslation();
  const [showTimeBoosts, setShowTimeBoosts] = useState(false);
  // The craft-time boosts (Fox Shrine, totems) expire on their own, so the
  // duration preview needs a live clock rather than a mount snapshot. One tick a
  // minute is enough for a boost that flips at most a few times a day.
  const now = useNow({ live: true, intervalMs: PRE_ACTION_TICK_MS });

  // Hooks must run unconditionally, so the preview is computed before the early
  // returns below; a null or instant recipe simply never reads it.
  const preview = getCraftingTimePreview({
    state,
    timeMs: recipe?.time ?? 0,
    at: startsAt ?? now,
  });

  if (!recipe) {
    return <SquareIcon icon={SUNNYSIDE.icons.expression_confused} width={7} />;
  }

  if (recipe.time === 0) {
    return <span>{t("instant")}</span>;
  }

  const { displaySeconds, speed, baseSeconds, boosts, isBoosted } = preview;

  if (isBoosted) {
    return (
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => setShowTimeBoosts((prev) => !prev)}
      >
        <span>
          {secondsToString(displaySeconds, {
            length: speed > 1 ? "full" : "medium",
            isShortFormat: true,
          })}
        </span>
        <span className="text-xxs line-through">
          {secondsToString(baseSeconds, {
            length: "medium",
            isShortFormat: true,
          })}
        </span>
        <BoostsDisplay
          boosts={boosts}
          show={showTimeBoosts}
          state={state}
          onClick={() => setShowTimeBoosts((prev) => !prev)}
        />
      </div>
    );
  }

  return (
    <span>
      {secondsToString(displaySeconds, {
        length: "medium",
        isShortFormat: true,
      })}
    </span>
  );
};

const InProgressLabelContent: React.FC<{ remainingTime: number | null }> = ({
  remainingTime,
}) => {
  const { t } = useAppTranslation();

  if (remainingTime === null) {
    return <SquareIcon icon={SUNNYSIDE.icons.expression_confused} width={7} />;
  }

  if (remainingTime === 0) {
    return <span>{t("ready")}</span>;
  }

  return (
    <span>
      {secondsToString(remainingTime / 1000, {
        length: "medium",
        isShortFormat: true,
        removeTrailingZeros: true,
      })}
    </span>
  );
};

export const CraftTimer: React.FC<{
  state: GameState;
  recipe: Recipe | null;
  remainingTime: number | null;
  isIdle: boolean;
  showRecipeContext?: boolean;
  startsAt?: number;
}> = ({
  state,
  recipe,
  remainingTime,
  isIdle,
  showRecipeContext = false,
  startsAt,
}) => {
  if (isIdle || showRecipeContext) {
    return (
      <Label
        type="transparent"
        className="ml-3 my-1"
        icon={SUNNYSIDE.icons.stopwatch}
      >
        <RecipeLabelContent state={state} recipe={recipe} startsAt={startsAt} />
      </Label>
    );
  }

  return (
    <Label
      type="transparent"
      className="ml-3 my-1"
      icon={SUNNYSIDE.icons.stopwatch}
    >
      <InProgressLabelContent remainingTime={remainingTime} />
    </Label>
  );
};
