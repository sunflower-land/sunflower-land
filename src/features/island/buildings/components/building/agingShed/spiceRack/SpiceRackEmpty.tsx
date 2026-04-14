import React, { useState } from "react";
import Decimal from "decimal.js-light";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { IngredientsPopover } from "components/ui/IngredientsPopover";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { hasPlacedAgingShed } from "features/game/events/landExpansion/hasPlacedAgingShed";
import {
  getSpiceRackRecipe,
  SPICE_RACK_RECIPE_IDS,
  type SpiceRackRecipeName,
} from "features/game/types/spiceRack";
import {
  getAgingInputMultiplier,
  getRefinedSaltChance,
} from "features/game/types/agingFormulas";
import type { GameState, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { mergeBasketAndChestInventory } from "features/island/hud/components/inventory/utils/inventory";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useVisiting } from "lib/utils/visitUtils";
import { getObjectEntries } from "lib/object";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";

function getPrimaryOutputItem(
  recipeId: SpiceRackRecipeName,
): InventoryItemName {
  const def = getSpiceRackRecipe(recipeId);
  const first = getObjectEntries(def.outputs)[0];
  if (!first) {
    throw new Error("Spice rack recipe has no outputs");
  }

  const [item] = first;
  return item as InventoryItemName;
}

type Props = {
  gameState: GameState;
  selectedRecipeId?: SpiceRackRecipeName;
  onSelectRecipe: (recipeId: SpiceRackRecipeName) => void;
  onStart: (recipeId: SpiceRackRecipeName) => void;
  startDisabled: boolean;
  validationMessage?: string;
  startError?: string;
};

export const SpiceRackEmpty: React.FC<Props> = ({
  gameState,
  selectedRecipeId,
  onSelectRecipe,
  onStart,
  startDisabled,
  validationMessage,
  startError,
}) => {
  const { t } = useAppTranslation();
  const { isVisiting } = useVisiting();
  const [showIngredients, setShowIngredients] = useState(false);
  const skills = gameState.bumpkin.skills;

  const recipeDef = selectedRecipeId
    ? getSpiceRackRecipe(selectedRecipeId)
    : undefined;
  const merged = mergeBasketAndChestInventory(gameState);

  const ingredientKeys: InventoryItemName[] = recipeDef
    ? (getObjectEntries(recipeDef.ingredients).map(([name]) => name) as
        | InventoryItemName[]
        | [])
    : [];

  const shedPlaced = hasPlacedAgingShed(gameState);

  const canShowRequirements =
    !!selectedRecipeId && !!recipeDef && shedPlaced && !isVisiting;

  const recipeOutputQuantity = selectedRecipeId
    ? recipeDef?.outputs[selectedRecipeId]
    : undefined;

  return (
    <>
      <InnerPanel className="mb-1 gap-1">
        <div className="flex flex-col gap-1 mb-1">
          <Label
            type={selectedRecipeId ? "info" : "default"}
            className="text-xs ml-1"
            icon={selectedRecipeId && ITEM_DETAILS[selectedRecipeId]?.image}
          >
            {selectedRecipeId
              ? `${selectedRecipeId}${recipeOutputQuantity ? ` x ${recipeOutputQuantity.toString()}` : ""}`
              : t("agingShed.spice.selectRecipe")}
          </Label>
          {selectedRecipeId && (
            <>
              {COLLECTIBLE_BUFF_LABELS[selectedRecipeId]?.({
                skills,
                collectibles: gameState.collectibles,
              }).map((label) => {
                return (
                  <Label
                    key={label.shortDescription}
                    type={label.labelType}
                    className="text-xs ml-1"
                    secondaryIcon={label.boostedItemIcon}
                    icon={label.boostTypeIcon}
                  >
                    {label.shortDescription}
                  </Label>
                );
              })}
              <p className="text-xs ml-1">
                {ITEM_DETAILS[selectedRecipeId]?.description}
              </p>
            </>
          )}
        </div>
        <div className="flex flex-wrap gap-1 px-1 pb-1 overflow-auto max-h-48 scrollable items-start">
          {SPICE_RACK_RECIPE_IDS.map((recipeId) => {
            const outputItem = getPrimaryOutputItem(recipeId);

            return (
              <div
                key={recipeId}
                className="flex flex-col items-center shrink-0 max-w-[72px]"
              >
                <Box
                  image={ITEM_DETAILS[outputItem]?.image}
                  isSelected={selectedRecipeId === recipeId}
                  count={gameState.inventory[outputItem]}
                  onClick={() => onSelectRecipe(recipeId)}
                />
              </div>
            );
          })}
        </div>
      </InnerPanel>

      {selectedRecipeId && recipeDef && (
        <InnerPanel className="mb-1">
          <Label type="default" className="text-xs mb-2 ml-1">
            {t("agingShed.spice.requirementsTitle")}
          </Label>

          {canShowRequirements && (
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

          {canShowRequirements &&
            selectedRecipeId === "Refined Salt" &&
            getRefinedSaltChance(skills) > 0 && (
              <Label type="vibrant" className="text-xxs mx-2 mb-1">
                {`${getRefinedSaltChance(skills)}% Refined Salt chance`}
              </Label>
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
        onClick={() => selectedRecipeId && onStart(selectedRecipeId)}
      >
        {t("agingShed.spice.start")}
      </Button>
    </>
  );
};
