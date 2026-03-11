import React, { useState } from "react";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { Recipe } from "features/game/lib/crafting";
import { GameState, InventoryItemName } from "features/game/types/game";
import { getBoostedCraftingTime } from "features/game/events/landExpansion/startCrafting";
import { SquareIcon } from "components/ui/SquareIcon";
import { BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { KNOWN_IDS } from "features/game/types";
import { BoostsDisplay } from "components/ui/layouts/BoostsDisplay";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const RecipeLabelContent: React.FC<{
  state: GameState;
  recipe: Recipe | null;
  farmId: number;
}> = ({ state, recipe, farmId }) => {
  const { t } = useAppTranslation();
  const [showTimeBoosts, setShowTimeBoosts] = useState(false);

  if (!recipe) {
    return <SquareIcon icon={SUNNYSIDE.icons.expression_confused} width={7} />;
  }

  if (recipe.time === 0) {
    return <span>{t("instant")}</span>;
  }

  const { seconds: boostedCraftTime, boostsUsed } = getBoostedCraftingTime({
    game: state,
    time: recipe.time,
    prngArgs: {
      farmId,
      itemId:
        recipe.type === "collectible"
          ? KNOWN_IDS[recipe.name as InventoryItemName]
          : ITEM_IDS[recipe.name as BumpkinItem],
      counter: state.farmActivity[`${recipe.name} Crafted`] ?? 0,
    },
  });

  if (boostsUsed.length > 0) {
    return (
      <div
        className="flex flex-col items-center cursor-pointer"
        onClick={() => setShowTimeBoosts((prev) => !prev)}
      >
        <span>
          {secondsToString(boostedCraftTime / 1000, {
            length: "medium",
            isShortFormat: true,
          })}
        </span>
        <span className="text-xxs line-through">
          {secondsToString(recipe.time / 1000, {
            length: "medium",
            isShortFormat: true,
          })}
        </span>
        <BoostsDisplay
          boosts={boostsUsed}
          show={showTimeBoosts}
          state={state}
          onClick={() => setShowTimeBoosts((prev) => !prev)}
        />
      </div>
    );
  }

  return (
    <span>
      {secondsToString(boostedCraftTime / 1000, {
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
  farmId: number;
}> = ({
  state,
  recipe,
  remainingTime,
  isIdle,
  showRecipeContext = false,
  farmId,
}) => {
  if (isIdle || showRecipeContext) {
    return (
      <Label
        type="transparent"
        className="ml-3 my-1"
        icon={SUNNYSIDE.icons.stopwatch}
      >
        <RecipeLabelContent state={state} recipe={recipe} farmId={farmId} />
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
