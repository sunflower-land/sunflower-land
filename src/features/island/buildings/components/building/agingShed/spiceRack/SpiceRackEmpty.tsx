import React, { useState } from "react";
import Decimal from "decimal.js-light";

import { Button } from "components/ui/Button";
import { IngredientsPopover } from "components/ui/IngredientsPopover";
import { StackedPanelView } from "components/ui/StackedPanelView";
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
  getAstrolabeDoubleChance,
  getRefinedSaltChance,
  getSpiceRackOutput,
} from "features/game/types/agingFormulas";
import type { GameState, InventoryItemName } from "features/game/types/game";
import {
  ITEM_DETAILS,
  getTranslatedItemName,
} from "features/game/types/images";
import { mergeBasketAndChestInventory } from "features/island/hud/components/inventory/utils/inventory";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useVisiting } from "lib/utils/visitUtils";
import { getObjectEntries } from "lib/object";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { getSkillLevel } from "features/game/types/bumpkinSkills";

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
    ? getSpiceRackOutput({
        game: gameState,
        baseAmount: recipeDef?.outputs[selectedRecipeId] ?? new Decimal(0),
        item: selectedRecipeId,
        agerLevel: getSkillLevel(gameState.bumpkin.skills, "Ager"),
      }).output
    : undefined;

  return (
    <StackedPanelView
      title={
        selectedRecipeId
          ? `${getTranslatedItemName(selectedRecipeId)}${recipeOutputQuantity ? ` x ${recipeOutputQuantity.toString()}` : ""}`
          : t("agingShed.spice.selectRecipe")
      }
      titleIcon={selectedRecipeId && ITEM_DETAILS[selectedRecipeId]?.image}
      selected={!!selectedRecipeId}
      details={
        <>
          {selectedRecipeId && (
            <>
              {COLLECTIBLE_BUFF_LABELS[selectedRecipeId]?.(gameState).map(
                (label) => {
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
                },
              )}
              <p className="text-xs ml-1">
                {ITEM_DETAILS[selectedRecipeId]?.description}
              </p>
            </>
          )}
        </>
      }
      options={SPICE_RACK_RECIPE_IDS.map((recipeId) => {
        const outputItem = getPrimaryOutputItem(recipeId);

        return {
          id: recipeId,
          image: ITEM_DETAILS[outputItem]?.image,
          count: gameState.inventory[outputItem],
          selected: selectedRecipeId === recipeId,
          onClick: () => onSelectRecipe(recipeId),
        };
      })}
      panels={[
        !!selectedRecipeId &&
          !!recipeDef && {
            id: "requirements",
            title: t("agingShed.spice.requirementsTitle"),
            content: (
              <>
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
                            merged[itemName as InventoryItemName] ??
                            new Decimal(0)
                          }
                          requirement={(need ?? new Decimal(0)).mul(
                            getAgingInputMultiplier(gameState),
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
                  getRefinedSaltChance(gameState) > 0 && (
                    <Label type="vibrant" className="text-xxs mx-2 mb-1">
                      {t("agingShed.spice.bonusChance", {
                        chance: getRefinedSaltChance(gameState),
                        item: getTranslatedItemName("Refined Salt"),
                      })}
                    </Label>
                  )}

                {canShowRequirements &&
                  getAstrolabeDoubleChance(gameState) > 0 && (
                    <Label type="vibrant" className="text-xxs mx-2 mb-1">
                      {t("agingShed.astrolabe.doubleChance", {
                        chance: getAstrolabeDoubleChance(gameState),
                      })}
                    </Label>
                  )}
              </>
            ),
          },
      ]}
      errors={[validationMessage, startError]}
      action={
        <Button
          disabled={startDisabled}
          onClick={() => selectedRecipeId && onStart(selectedRecipeId)}
        >
          {t("agingShed.spice.start")}
        </Button>
      }
    />
  );
};
