import React from "react";
import Decimal from "decimal.js-light";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { SUNNYSIDE } from "assets/sunnyside";
import type { BeetleName } from "features/game/types/beetles";
import { ANIMAL_FOODS } from "features/game/types/animals";
import type {
  AnimalFeedBuffName,
  AnimalMedicineName,
  GameState,
  InventoryItemName,
} from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import {
  isPigFeed,
  PIG_FEEDS,
  type PigFeedName,
} from "features/game/types/pigFeeds";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getKeys } from "lib/object";

export type FeederQuickItem = AnimalFeedBuffName | BeetleName | "Mud";

const SLOPS = getKeys(PIG_FEEDS);
const MEDICINES = getKeys(ANIMAL_FOODS).filter(
  (item): item is AnimalMedicineName => ANIMAL_FOODS[item].type === "medicine",
);

const canAffordInput = (
  inventory: GameState["inventory"],
  slop: PigFeedName,
  item: InventoryItemName,
) =>
  (inventory[item] ?? new Decimal(0)).gte(
    PIG_FEEDS[slop].ingredients[item] ?? 0,
  );

type Props = {
  state: GameState;
  section: "food" | "care";
  selected: PigFeedName | AnimalMedicineName;
  /** The Slop's chosen input; unused for a medicine. */
  ingredient?: InventoryItemName;
  ingredients: GameState["inventory"];
  maxMixAmount: number;
  /** The spices in the inventory, applied to a Pig by selecting one. */
  spices: AnimalFeedBuffName[];
  beetles: readonly BeetleName[];
  selectedQuickItem?: FeederQuickItem;
  onSelect: (item: PigFeedName | AnimalMedicineName) => void;
  onSelectQuickItem: (item: FeederQuickItem) => void;
  onSelectIngredient: (item: InventoryItemName) => void;
  onMix: (amount: number) => void;
  onMixInBulk: () => void;
};

/**
 * Food mixes Slops from a chosen ingredient. Care keeps Barn Delight,
 * Mud, spices and Beetles together, separate from the feed recipes.
 */
export const PigFeedMixer: React.FC<Props> = ({
  state,
  section,
  selected,
  ingredient,
  ingredients,
  maxMixAmount,
  spices,
  beetles,
  selectedQuickItem,
  onSelect,
  onSelectQuickItem,
  onSelectIngredient,
  onMix,
  onMixInBulk,
}) => {
  const { t } = useAppTranslation();
  const shown = selectedQuickItem ?? selected;
  const slop = !selectedQuickItem && isPigFeed(selected) ? selected : undefined;
  const itemBox = (
    item: PigFeedName | AnimalMedicineName | FeederQuickItem,
    isSelected: boolean,
    onClick: () => void,
  ) => (
    <Box
      key={item}
      image={ITEM_DETAILS[item].image}
      isSelected={isSelected}
      count={state.inventory[item]}
      onClick={onClick}
    />
  );

  return (
    <>
      <InnerPanel className="mb-1">
        <div className="flex flex-col gap-1 mb-1">
          <Label
            type="default"
            className="text-xs ml-1"
            icon={ITEM_DETAILS[shown].image}
          >
            {shown}
          </Label>
          <p className="text-xs ml-1">
            {selectedQuickItem
              ? ITEM_DETAILS[selectedQuickItem].description
              : ANIMAL_FOODS[selected].description}
          </p>
        </div>
        {section === "food" && (
          <>
            <Label type="default" className="text-xs ml-1 mb-1">
              {t("feeder.foodTypes.food")}
            </Label>
            <div className="flex flex-wrap gap-1 px-1 pb-1">
              {SLOPS.map((item) =>
                itemBox(item, !selectedQuickItem && selected === item, () =>
                  onSelect(item),
                ),
              )}
            </div>
          </>
        )}
        {section === "care" && (
          <>
            <Label type="default" className="text-xs ml-1 mb-1">
              {t("feeder.foodTypes.medicine")}
            </Label>
            <div className="flex flex-wrap gap-1 px-1 pb-1">
              {MEDICINES.map((item) =>
                itemBox(item, !selectedQuickItem && selected === item, () =>
                  onSelect(item),
                ),
              )}
              {itemBox("Mud", selectedQuickItem === "Mud", () =>
                onSelectQuickItem("Mud"),
              )}
            </div>
            {spices.length > 0 && (
              <>
                <Label
                  type="default"
                  className="text-xs ml-1 mb-1"
                  icon={ITEM_DETAILS["Honey Treat"].image}
                >
                  {t("spices")}
                </Label>
                <div className="flex flex-wrap gap-1 px-1 pb-1">
                  {spices.map((item) =>
                    itemBox(item, selectedQuickItem === item, () =>
                      onSelectQuickItem(item),
                    ),
                  )}
                </div>
              </>
            )}
            {beetles.length > 0 && (
              <>
                <Label type="default" className="text-xs ml-1 mb-1">
                  {t("feeder.beetles")}
                </Label>
                <div className="flex flex-wrap gap-1 px-1 pb-1">
                  {beetles.map((item) =>
                    itemBox(item, selectedQuickItem === item, () =>
                      onSelectQuickItem(item),
                    ),
                  )}
                </div>
              </>
            )}
          </>
        )}
      </InnerPanel>

      {slop && ingredient && (
        <SlopInputPicker
          state={state}
          slop={slop}
          ingredient={ingredient}
          ingredients={ingredients}
          onSelectIngredient={onSelectIngredient}
        />
      )}

      {!slop && !selectedQuickItem && (
        <InnerPanel className="mb-1">
          <div className="flex flex-wrap p-2 gap-2">
            {getKeys(ingredients).map((item) => (
              <RequirementLabel
                key={item}
                type="item"
                item={item}
                balance={state.inventory[item] ?? new Decimal(0)}
                requirement={ingredients[item] ?? new Decimal(0)}
              />
            ))}
          </div>
        </InnerPanel>
      )}

      {!selectedQuickItem && (
        <>
          <div className="flex space-x-1 w-full">
            <Button disabled={maxMixAmount < 1} onClick={() => onMix(1)}>
              {t("mix.one")}
            </Button>
            <Button disabled={maxMixAmount < 10} onClick={() => onMix(10)}>
              {t("mix.ten")}
            </Button>
          </div>
          {maxMixAmount > 10 && (
            <Button className="mt-1" onClick={onMixInBulk}>
              {t("feeder.mixInBulk")}
            </Button>
          )}
        </>
      )}
    </>
  );
};

const SlopInputPicker: React.FC<{
  state: GameState;
  slop: PigFeedName;
  ingredient: InventoryItemName;
  ingredients: GameState["inventory"];
  onSelectIngredient: (item: InventoryItemName) => void;
}> = ({ state, slop, ingredient, ingredients, onSelectIngredient }) => {
  const { t } = useAppTranslation();

  return (
    <InnerPanel className="mb-1">
      <Label type="default" className="text-xs mb-2 ml-1">
        {t("feeder.chooseSlopInput")}
      </Label>
      <div className="flex flex-wrap gap-1 overflow-auto max-h-48 scrollable">
        {getKeys(PIG_FEEDS[slop].ingredients).map((item) => (
          <Box
            key={item}
            image={ITEM_DETAILS[item].image}
            count={state.inventory[item]}
            isSelected={ingredient === item}
            onClick={() => onSelectIngredient(item)}
            secondaryImage={
              canAffordInput(state.inventory, slop, item)
                ? SUNNYSIDE.icons.confirm
                : SUNNYSIDE.icons.cancel
            }
          />
        ))}
      </div>
      <div className="flex flex-wrap p-2 gap-2">
        {getKeys(ingredients).map((item) => (
          <RequirementLabel
            key={item}
            type="item"
            item={item}
            balance={state.inventory[item] ?? new Decimal(0)}
            requirement={ingredients[item] ?? new Decimal(0)}
          />
        ))}
      </div>
    </InnerPanel>
  );
};
