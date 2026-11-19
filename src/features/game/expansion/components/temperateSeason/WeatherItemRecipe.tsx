import Decimal from "decimal.js-light";
import React, { useMemo, useState } from "react";

import { Label } from "components/ui/Label";
import { StackedOptionGrid } from "components/ui/StackedPanelView";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import type { GameState, InventoryItemName } from "features/game/types/game";
import {
  ITEM_DETAILS,
  getTranslatedItemName,
} from "features/game/types/images";
import {
  getWeatherItemIngredients,
  WEATHER_ITEM_RECIPES,
  type WeatherItemName,
} from "features/game/types/weatherItems";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getKeys } from "lib/object";
import { formatNumber } from "lib/utils/formatNumber";
import { getChestItemCount } from "features/island/hud/components/inventory/utils/inventory";

type Ingredients = Partial<Record<InventoryItemName, number>>;

/** What the player can spend: placed items (flowers, for one) don't count. */
export const available = (game: GameState, item: InventoryItemName) =>
  getChestItemCount(game, item);

const canAffordOption = (
  game: GameState,
  item: WeatherItemName,
  option: InventoryItemName,
) =>
  available(game, option).gte(WEATHER_ITEM_RECIPES[item].choice?.[option] ?? 0);

/**
 * Every option `item` offers, the ones the player can afford first (flowers
 * by how many the player holds).
 */
const sortOptions = (
  game: GameState,
  item: WeatherItemName,
): InventoryItemName[] => {
  const { choice } = WEATHER_ITEM_RECIPES[item];
  if (!choice) return [];

  const options =
    item === "Wildflower Lure"
      ? getKeys(choice).sort((a, b) =>
          available(game, b).cmp(available(game, a)),
        )
      : getKeys(choice);

  return [
    ...options.filter((option) => canAffordOption(game, item, option)),
    ...options.filter((option) => !canAffordOption(game, item, option)),
  ];
};

/** Whether the player can pay for `item` with at least one of its options. */
export const canAffordItem = (game: GameState, item: WeatherItemName) => {
  const { ingredients, choice } = WEATHER_ITEM_RECIPES[item];
  const fixed = getKeys(ingredients).every((name) =>
    available(game, name).gte(ingredients[name] ?? 0),
  );
  if (!choice) return fixed;

  return fixed && getKeys(choice).some((o) => canAffordOption(game, item, o));
};

/**
 * The player's pick for `item`'s recipe and what it costs. Only an option the
 * player can pay for can be picked; the pick holds while it still can be,
 * else it falls back to the first one that can.
 */
export function useWeatherItemPick(game: GameState, item: WeatherItemName) {
  const [pick, setPick] = useState<{
    item: WeatherItemName;
    option: InventoryItemName;
  }>();

  // Sorted when the item changes, not on every count change, so paying never
  // moves the options under the player.
  const options = useMemo(
    () => sortOptions(game, item),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [item],
  );

  const canPick = (option: InventoryItemName) =>
    canAffordOption(game, item, option);
  const picked = pick?.item === item ? pick.option : undefined;
  const ingredient = picked && canPick(picked) ? picked : options.find(canPick);

  // With nothing pickable, still show the fixed ingredients; canPay stays
  // false because the recipe needs a pick.
  const ingredients: Ingredients =
    getWeatherItemIngredients(item, ingredient) ??
    WEATHER_ITEM_RECIPES[item].ingredients;

  const canPay =
    (!WEATHER_ITEM_RECIPES[item].choice || !!ingredient) &&
    getKeys(ingredients).every((name) =>
      available(game, name).gte(ingredients[name] ?? 0),
    );

  return {
    options,
    ingredient,
    ingredients,
    canPick,
    canPay,
    setPick: (option: InventoryItemName) => setPick({ item, option }),
  };
}

/** The beetle or flower picker for a recipe with a choice. */
export const WeatherItemChoice: React.FC<{
  game: GameState;
  item: WeatherItemName;
  pick: ReturnType<typeof useWeatherItemPick>;
}> = ({ game, item, pick }) => {
  const { t } = useAppTranslation();
  const { choice } = WEATHER_ITEM_RECIPES[item];
  if (!choice) return null;

  const { options, ingredient, canPick, setPick } = pick;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-1 ml-1 mb-1">
        <Label type="default" className="text-xs">
          {item === "Wildflower Lure"
            ? t("weatherShop.chooseFlower")
            : t("weatherShop.chooseBeetle")}
        </Label>
        {ingredient && (
          <Label
            type="default"
            className="text-xs"
            icon={ITEM_DETAILS[ingredient].image}
          >
            {t("weatherShop.ingredientAmount", {
              item: getTranslatedItemName(ingredient),
              amount: formatNumber(choice[ingredient] ?? 0),
            })}
          </Label>
        )}
      </div>
      <StackedOptionGrid
        options={options.map((option) => ({
          id: option,
          image: ITEM_DETAILS[option].image,
          count: available(game, option),
          selected: ingredient === option,
          onClick: () => setPick(option),
          disabled: !canPick(option),
          status: canPick(option) ? undefined : "missing",
          caption: t("weatherShop.amount", {
            amount: formatNumber(choice[option] ?? 0),
          }),
        }))}
      />
    </>
  );
};

/** The recipe's ingredients against what the player can spend. */
export const WeatherItemRequirements: React.FC<{
  game: GameState;
  ingredients: Ingredients;
}> = ({ game, ingredients }) => (
  <div className="flex flex-wrap p-2 gap-2">
    {getKeys(ingredients).map((name) => (
      <RequirementLabel
        key={name}
        type="item"
        item={name}
        balance={available(game, name)}
        requirement={new Decimal(ingredients[name] ?? 0)}
      />
    ))}
  </div>
);
