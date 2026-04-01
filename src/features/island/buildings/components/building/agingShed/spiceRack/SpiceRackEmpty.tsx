import React, { useMemo, useState } from "react";
import Decimal from "decimal.js-light";

import { Button } from "components/ui/Button";
import { IngredientsPopover } from "components/ui/IngredientsPopover";
import { DropdownPanel } from "components/ui/DropdownPanel";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { hasPlacedAgingShed } from "features/game/events/landExpansion/hasPlacedAgingShed";
import {
  getSpiceRackRecipe,
  getMaxSpiceRackSlots,
  SPICE_RACK_RECIPE_IDS,
  type SpiceRackRecipeName,
} from "features/game/types/spiceRack";
import type { GameState, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { mergeBasketAndChestInventory } from "features/island/hud/components/inventory/utils/inventory";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useVisiting } from "lib/utils/visitUtils";
import { getObjectEntries } from "lib/object";

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
  const merged = useMemo(
    () => mergeBasketAndChestInventory(gameState),
    [gameState],
  );

  const ingredientKeys: InventoryItemName[] = recipeDef
    ? (getObjectEntries(recipeDef.ingredients).map(([name]) => name) as
        | InventoryItemName[]
        | [])
    : [];

  const slotsFull =
    gameState.agingShed.racks.spice.length >=
    getMaxSpiceRackSlots(gameState.agingShed.level);
  const shedPlaced = hasPlacedAgingShed(gameState);

  const canShowRequirements =
    !!selectedRecipeId &&
    !!recipeDef &&
    shedPlaced &&
    !slotsFull &&
    !isVisiting;

  return (
    <>
      <DropdownPanel
        options={SPICE_RACK_RECIPE_IDS.map((recipeId) => {
          const def = getSpiceRackRecipe(recipeId);
          const outputItem = getPrimaryOutputItem(recipeId);
          const outEntry = getObjectEntries(def.outputs)[0];
          const amt = outEntry?.[1] ?? new Decimal(0);
          const title = `${ITEM_DETAILS[outputItem]?.translatedName ?? String(outputItem)} x${amt.toString()}`;
          const description = ITEM_DETAILS[outputItem]?.description;

          return {
            value: recipeId,
            icon: ITEM_DETAILS[outputItem]?.image,
            label: (
              <div className="flex flex-col gap-1">
                <p className="text-xs">{title}</p>
                {description ? <p className="text-xxs">{description}</p> : null}
              </div>
            ),
          };
        })}
        value={selectedRecipeId}
        placeholder={t("agingShed.spice.selectRecipe")}
        onChange={(value) => onSelectRecipe(value as SpiceRackRecipeName)}
        className="mb-1"
      />

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
