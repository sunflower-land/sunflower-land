import React from "react";
import Decimal from "decimal.js-light";

import { Button } from "components/ui/Button";
import {
  StackedOptionGrid,
  StackedPanelView,
} from "components/ui/StackedPanelView";
import { Label } from "components/ui/Label";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { ANIMAL_FOODS } from "features/game/types/animals";
import type { GameState, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { PIG_FEEDS, type PigFeedName } from "features/game/types/pigFeeds";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getKeys } from "lib/object";

const SLOPS = getKeys(PIG_FEEDS);

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
  selected: PigFeedName;
  ingredient?: InventoryItemName;
  ingredients: GameState["inventory"];
  maxMixAmount: number;
  onSelect: (item: PigFeedName) => void;
  onSelectIngredient: (item: InventoryItemName) => void;
  onMix: (amount: number) => void;
  onMixInBulk: () => void;
};

/** The Pigpen's Food tab: pick a Slop, then an ingredient from its tier. */
export const PigFeedMixer: React.FC<Props> = ({
  state,
  selected,
  ingredient,
  ingredients,
  maxMixAmount,
  onSelect,
  onSelectIngredient,
  onMix,
  onMixInBulk,
}) => {
  const { t } = useAppTranslation();

  return (
    <StackedPanelView
      title={selected}
      titleIcon={ITEM_DETAILS[selected].image}
      details={
        <>
          <p className="text-xs ml-1">{ANIMAL_FOODS[selected].description}</p>
          <Label type="default" className="text-xs ml-1">
            {t("feeder.foodTypes.food")}
          </Label>
        </>
      }
      options={SLOPS.map((item) => ({
        id: item,
        image: ITEM_DETAILS[item].image,
        count: state.inventory[item],
        selected: selected === item,
        onClick: () => onSelect(item),
      }))}
      panels={[
        ingredient && {
          id: "input",
          title: t("feeder.chooseSlopInput"),
          content: (
            <SlopInputPicker
              state={state}
              slop={selected}
              ingredient={ingredient}
              ingredients={ingredients}
              onSelectIngredient={onSelectIngredient}
            />
          ),
        },
      ]}
      action={
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
      }
    />
  );
};

const SlopInputPicker: React.FC<{
  state: GameState;
  slop: PigFeedName;
  ingredient: InventoryItemName;
  ingredients: GameState["inventory"];
  onSelectIngredient: (item: InventoryItemName) => void;
}> = ({ state, slop, ingredient, ingredients, onSelectIngredient }) => {
  return (
    <>
      <StackedOptionGrid
        options={getKeys(PIG_FEEDS[slop].ingredients).map((item) => ({
          id: item,
          image: ITEM_DETAILS[item].image,
          count: state.inventory[item],
          selected: ingredient === item,
          onClick: () => onSelectIngredient(item),
          status: canAffordInput(state.inventory, slop, item)
            ? "ready"
            : "missing",
        }))}
      />
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
    </>
  );
};
