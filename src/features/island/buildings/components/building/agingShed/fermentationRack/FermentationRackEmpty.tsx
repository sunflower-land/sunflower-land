import React, { useMemo, useState } from "react";
import Decimal from "decimal.js-light";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { IngredientsPopover } from "components/ui/IngredientsPopover";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { hasPlacedAgingShed } from "features/game/events/landExpansion/hasPlacedAgingShed";
import { getFermentationOutputGroups } from "features/game/lib/fermentationUi";
import {
  getFermentationRecipe,
  getMaxFermentationSlots,
  type FermentationRecipeName,
} from "features/game/types/fermentation";
import type {
  GameState,
  Inventory,
  InventoryItemName,
} from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getBasketItems,
  getChestItems,
} from "features/island/hud/components/inventory/utils/inventory";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useVisiting } from "lib/utils/visitUtils";
import { getObjectEntries } from "lib/object";

function getMergedInventory(state: GameState): Inventory {
  return {
    ...getBasketItems(state.inventory),
    ...getChestItems(state),
  };
}

function getFirstInsufficientIngredient(
  merged: Inventory,
  recipeId: FermentationRecipeName,
): InventoryItemName | undefined {
  const def = getFermentationRecipe(recipeId);

  for (const [ing, need] of getObjectEntries(def.ingredients)) {
    const name = ing as InventoryItemName;
    const have = merged[name] ?? new Decimal(0);

    if (have.lessThan(need ?? new Decimal(0))) {
      return name;
    }
  }

  return undefined;
}

function getFirstIngredientImage(recipeId: FermentationRecipeName) {
  const def = getFermentationRecipe(recipeId);
  const first = getObjectEntries(def.ingredients)[0];
  const name = first?.[0] as InventoryItemName | undefined;
  return name ? ITEM_DETAILS[name]?.image : undefined;
}

type Props = {
  gameState: GameState;
  selectedSignature?: string;
  selectedRecipeId?: FermentationRecipeName;
  onSelectOutput: (signature: string) => void;
  onSelectVariant: (recipeId: FermentationRecipeName) => void;
  onStart: (recipeId: FermentationRecipeName) => void;
  startDisabled: boolean;
  validationMessage?: string;
  startError?: string;
};

export const FermentationRackEmpty: React.FC<Props> = ({
  gameState,
  selectedSignature,
  selectedRecipeId,
  onSelectOutput,
  onSelectVariant,
  onStart,
  startDisabled,
  validationMessage,
  startError,
}) => {
  const { t } = useAppTranslation();
  const { isVisiting } = useVisiting();
  const [showIngredients, setShowIngredients] = useState(false);

  const groups = useMemo(() => getFermentationOutputGroups(), []);
  const selectedGroup = selectedSignature
    ? groups.find((g) => g.signature === selectedSignature)
    : undefined;

  const recipeId = selectedRecipeId;
  const recipeDef = recipeId ? getFermentationRecipe(recipeId) : undefined;
  const merged = useMemo(() => getMergedInventory(gameState), [gameState]);

  const ingredientKeys: InventoryItemName[] = recipeDef
    ? (getObjectEntries(recipeDef.ingredients).map(([name]) => name) as
        | InventoryItemName[]
        | [])
    : [];

  const slotsFull =
    gameState.agingShed.racks.fermentation.length >=
    getMaxFermentationSlots(gameState.agingShed.level);
  const shedPlaced = hasPlacedAgingShed(gameState);

  const insufficientIngredient =
    recipeId !== undefined
      ? getFirstInsufficientIngredient(merged, recipeId)
      : undefined;

  // NB: actual Start button disable is controlled by parent via `startDisabled`.
  // These are just used to avoid showing misleading blocks when nothing selected.
  const canShowRequirements =
    !!recipeId && !!recipeDef && shedPlaced && !slotsFull && !isVisiting;

  return (
    <>
      <InnerPanel className="mb-2">
        <Label type="default" className="text-xs mb-2 ml-1">
          {selectedGroup
            ? `${ITEM_DETAILS[selectedGroup.item]?.translatedName ?? String(selectedGroup.item)} x${selectedGroup.amount.toString()}`
            : t("agingShed.fermentation.selectFermentationOutput")}
        </Label>
        <div className="flex flex-wrap gap-1">
          {groups.map((g) => {
            const image = ITEM_DETAILS[g.item]?.image;

            return (
              <div
                key={g.signature}
                className="flex flex-col items-center shrink-0 max-w-[76px]"
              >
                <Box
                  image={image}
                  count={g.amount}
                  isSelected={selectedSignature === g.signature}
                  onClick={() => onSelectOutput(g.signature)}
                />
              </div>
            );
          })}
        </div>
      </InnerPanel>

      {selectedGroup && (
        <InnerPanel className="mb-2">
          <Label type="default" className="text-xs mb-2 ml-1">
            {selectedGroup.recipeIds.length > 1
              ? t("agingShed.fermentation.selectIngredients")
              : t("agingShed.fermentation.requirementsTitle")}
          </Label>

          {selectedGroup.recipeIds.length > 1 && (
            <div className="flex flex-wrap gap-1">
              {selectedGroup.recipeIds.map((id) => {
                const image = getFirstIngredientImage(id);

                return (
                  <div
                    key={id}
                    className="flex flex-col items-center shrink-0 max-w-[76px]"
                  >
                    <Box
                      image={image}
                      hideCount
                      isSelected={recipeId === id}
                      onClick={() => onSelectVariant(id)}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {canShowRequirements && recipeDef && (
            <div
              className="flex flex-wrap p-2 gap-2 cursor-pointer rounded-sm border border-[#181425]/20 bg-black/5"
              onClick={() => setShowIngredients(!showIngredients)}
            >
              <IngredientsPopover
                show={showIngredients}
                ingredients={ingredientKeys}
                onClick={() => setShowIngredients(false)}
              />
              {getObjectEntries(recipeDef.ingredients).map(
                ([itemName, need]) => (
                  <RequirementLabel
                    key={String(itemName)}
                    type="item"
                    item={itemName as InventoryItemName}
                    balance={
                      merged[itemName as InventoryItemName] ?? new Decimal(0)
                    }
                    requirement={need ?? new Decimal(0)}
                  />
                ),
              )}
              <RequirementLabel
                type="time"
                waitSeconds={recipeDef.durationSeconds}
              />
            </div>
          )}

          {recipeId && insufficientIngredient && (
            <p className="text-xxs px-1 mt-2 opacity-80">
              {t("agingShed.fermentation.insufficientIngredient", {
                item:
                  ITEM_DETAILS[insufficientIngredient]?.translatedName ??
                  String(insufficientIngredient),
              })}
            </p>
          )}
        </InnerPanel>
      )}

      {validationMessage && (
        <Label type="danger" className="text-xs px-1 mb-1">
          {validationMessage}
        </Label>
      )}

      {startError && (
        <Label type="danger" className="text-xs px-1 mb-1">
          {startError}
        </Label>
      )}

      <Button
        disabled={startDisabled}
        onClick={() => recipeId && onStart(recipeId)}
      >
        {t("agingShed.fermentation.start")}
      </Button>
    </>
  );
};
