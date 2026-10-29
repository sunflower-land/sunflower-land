import React from "react";
import Decimal from "decimal.js-light";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { SUNNYSIDE } from "assets/sunnyside";
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
  selected: PigFeedName | AnimalMedicineName;
  /** The Slop's chosen input; unused for a medicine. */
  ingredient?: InventoryItemName;
  ingredients: GameState["inventory"];
  maxMixAmount: number;
  /** The spices in the inventory, applied to a Pig by selecting one. */
  spices: AnimalFeedBuffName[];
  selectedSpice?: AnimalFeedBuffName;
  onSelect: (item: PigFeedName | AnimalMedicineName) => void;
  onSelectSpice: (spice: AnimalFeedBuffName) => void;
  onSelectIngredient: (item: InventoryItemName) => void;
  onMix: (amount: number) => void;
  onMixInBulk: () => void;
};

/**
 * The Pigpen Feeder's Mix tab, laid out like the Aging Shed's Fermentation
 * Rack: pick a Slop, then the one item of its tier to mix it from. Barn
 * Delight (to cure a sick Pig) and the spices sit below the Slops, as in the
 * other buildings' Feeders.
 */
export const PigFeedMixer: React.FC<Props> = ({
  state,
  selected,
  ingredient,
  ingredients,
  maxMixAmount,
  spices,
  selectedSpice,
  onSelect,
  onSelectSpice,
  onSelectIngredient,
  onMix,
  onMixInBulk,
}) => {
  const { t } = useAppTranslation();
  const shown = selectedSpice ?? selected;
  const slop = !selectedSpice && isPigFeed(selected) ? selected : undefined;
  const itemBox = (
    item: PigFeedName | AnimalMedicineName | AnimalFeedBuffName,
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
            {selectedSpice
              ? ITEM_DETAILS[selectedSpice].description
              : ANIMAL_FOODS[selected].description}
          </p>
        </div>
        <Label type="default" className="text-xs ml-1 mb-1">
          {t("feeder.foodTypes.food")}
        </Label>
        <div className="flex flex-wrap gap-1 px-1 pb-1">
          {SLOPS.map((item) =>
            itemBox(item, !selectedSpice && selected === item, () =>
              onSelect(item),
            ),
          )}
        </div>
        <Label type="default" className="text-xs ml-1 mb-1">
          {t("feeder.foodTypes.medicine")}
        </Label>
        <div className="flex flex-wrap gap-1 px-1 pb-1">
          {MEDICINES.map((item) =>
            itemBox(item, !selectedSpice && selected === item, () =>
              onSelect(item),
            ),
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
                itemBox(item, selectedSpice === item, () =>
                  onSelectSpice(item),
                ),
              )}
            </div>
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

      {!slop && !selectedSpice && (
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

      {!selectedSpice && (
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
