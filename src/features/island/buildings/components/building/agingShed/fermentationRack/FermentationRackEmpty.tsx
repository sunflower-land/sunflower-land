import React, { useState } from "react";
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
  type FermentationRecipeName,
} from "features/game/types/fermentation";
import type {
  GameState,
  Inventory,
  InventoryItemName,
  Skills,
} from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  getBasketItems,
  getChestItems,
} from "features/island/hud/components/inventory/utils/inventory";
import { getAgingInputMultiplier } from "features/game/types/agingFormulas";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useVisiting } from "lib/utils/visitUtils";
import { getObjectEntries } from "lib/object";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";

function getMergedInventory(state: GameState): Inventory {
  return {
    ...getBasketItems(state.inventory),
    ...getChestItems(state),
  };
}

function getFirstIngredientImage(recipeId: FermentationRecipeName) {
  const def = getFermentationRecipe(recipeId);
  const first = getObjectEntries(def.ingredients)[0];
  const name = first?.[0] as InventoryItemName | undefined;
  return name ? ITEM_DETAILS[name]?.image : undefined;
}

function hasEnoughFermentationIngredients(
  merged: Inventory,
  recipeId: FermentationRecipeName,
  skills: Skills,
): boolean {
  const def = getFermentationRecipe(recipeId);
  const inputMultiplier = getAgingInputMultiplier(skills);

  for (const [ingredient, amount] of getObjectEntries(def.ingredients)) {
    const have = merged[ingredient as InventoryItemName] ?? new Decimal(0);
    const need = (amount ?? new Decimal(0)).mul(inputMultiplier);
    if (have.lessThan(need)) {
      return false;
    }
  }

  return true;
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

  const groups = getFermentationOutputGroups();
  const selectedGroup = selectedSignature
    ? groups.find((g) => g.signature === selectedSignature)
    : undefined;
  const selectedItem = selectedGroup?.item;

  const recipeId = selectedRecipeId;
  const recipeDef = recipeId ? getFermentationRecipe(recipeId) : undefined;
  const skills = gameState.bumpkin.skills;
  const merged = getMergedInventory(gameState);

  const ingredientKeys: InventoryItemName[] = recipeDef
    ? (getObjectEntries(recipeDef.ingredients).map(([name]) => name) as
        | InventoryItemName[]
        | [])
    : [];

  const shedPlaced = hasPlacedAgingShed(gameState);

  // NB: actual Start button disable is controlled by parent via `startDisabled`.
  // These are just used to avoid showing misleading blocks when nothing selected.
  const canShowRequirements =
    !!recipeId && !!recipeDef && shedPlaced && !isVisiting;

  const recipeOutputQuantity =
    recipeId && selectedItem
      ? getFermentationRecipe(recipeId).outputs[selectedItem]
      : undefined;

  return (
    <>
      <InnerPanel className="mb-1">
        <div className="flex flex-col gap-1 mb-1">
          <Label
            type={selectedGroup ? "info" : "default"}
            className="text-xs ml-1"
            icon={selectedItem ? ITEM_DETAILS[selectedItem]?.image : undefined}
          >
            {selectedGroup
              ? `${selectedGroup.item}${recipeOutputQuantity ? ` x ${recipeOutputQuantity.toString()}` : ""}`
              : t("agingShed.fermentation.selectFermentationOutput")}
          </Label>
          {selectedItem && (
            <>
              {COLLECTIBLE_BUFF_LABELS[selectedItem]?.({
                skills,
                collectibles: gameState.collectibles,
              })?.map((label) => (
                <Label
                  key={label.shortDescription}
                  type={label.labelType}
                  className="text-xs ml-1"
                  secondaryIcon={label.boostedItemIcon}
                  icon={label.boostTypeIcon}
                >
                  {label.shortDescription}
                </Label>
              ))}
              <p className="text-xs ml-1">
                {ITEM_DETAILS[selectedItem]?.description}
              </p>
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-1 px-1 pb-1 overflow-auto max-h-48 scrollable items-start">
          {groups.map((g) => {
            return (
              <div
                key={g.signature}
                className="flex flex-col items-center shrink-0 max-w-[72px]"
              >
                <Box
                  image={ITEM_DETAILS[g.item]?.image}
                  isSelected={selectedSignature === g.signature}
                  count={gameState.inventory[g.item]}
                  onClick={() => onSelectOutput(g.signature)}
                />
              </div>
            );
          })}
        </div>
      </InnerPanel>

      {selectedGroup && (
        <InnerPanel className="mb-1">
          <Label type="default" className="text-xs mb-2 ml-1">
            {selectedGroup.recipeIds.length > 1
              ? t("agingShed.fermentation.selectRecipe")
              : t("agingShed.fermentation.requirementsTitle")}
          </Label>

          {selectedGroup.recipeIds.length > 1 && (
            <div className="flex flex-wrap gap-1 overflow-auto max-h-48 scrollable">
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
                      secondaryImage={
                        hasEnoughFermentationIngredients(merged, id, skills)
                          ? SUNNYSIDE.icons.confirm
                          : SUNNYSIDE.icons.cancel
                      }
                    />
                  </div>
                );
              })}
            </div>
          )}

          {canShowRequirements && recipeDef && (
            <div
              className="flex flex-wrap p-2 gap-2 cursor-pointer"
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
                    requirement={(need ?? new Decimal(0)).mul(
                      getAgingInputMultiplier(skills),
                    )}
                  />
                ),
              )}
              <RequirementLabel
                type="time"
                waitSeconds={recipeDef.durationSeconds}
              />
            </div>
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
