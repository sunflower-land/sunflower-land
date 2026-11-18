import Decimal from "decimal.js-light";
import React, { useContext, useMemo, useState } from "react";
import { useSelector } from "@xstate/react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { StackedPanelView } from "components/ui/StackedPanelView";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
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

const ITEMS = getKeys(WEATHER_ITEM_RECIPES);

const _game = (state: MachineState) => state.context.state;

const owned = (game: GameState, item: InventoryItemName) =>
  game.inventory[item] ?? new Decimal(0);

/** What the player can spend: placed items (flowers, for one) don't count. */
const available = (game: GameState, item: InventoryItemName) =>
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
const canAffordItem = (game: GameState, item: WeatherItemName) => {
  const { ingredients, choice } = WEATHER_ITEM_RECIPES[item];
  const fixed = getKeys(ingredients).every((name) =>
    available(game, name).gte(ingredients[name] ?? 0),
  );
  if (!choice) return fixed;

  return fixed && getKeys(choice).some((o) => canAffordOption(game, item, o));
};

export const WeatherItemShop: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const game = useSelector(gameService, _game);

  const [selected, setSelected] = useState<WeatherItemName>("Sandbag");
  const [picked, setPicked] = useState<InventoryItemName>();

  const { choice } = WEATHER_ITEM_RECIPES[selected];
  // Sorted when an item is selected, not on every count change, so crafting
  // never moves the options under the player.
  const options = useMemo(
    () => sortOptions(game, selected),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selected],
  );
  // Only an option the player can pay for can be picked; keep the pick while
  // it still is, else default to the first one that is.
  const canPick = (option: InventoryItemName) =>
    canAffordOption(game, selected, option);
  const ingredient = picked && canPick(picked) ? picked : options.find(canPick);

  // With nothing pickable, still show the fixed ingredients;
  // canCraft stays false because the recipe needs a pick.
  const ingredients =
    getWeatherItemIngredients(selected, ingredient) ??
    WEATHER_ITEM_RECIPES[selected].ingredients;

  const hasItem = owned(game, selected).gte(1);
  const canCraft =
    !hasItem &&
    (!choice || !!ingredient) &&
    getKeys(ingredients).every((name) =>
      available(game, name).gte(ingredients[name] ?? 0),
    );

  const craft = () => {
    gameService.send("weatherItem.crafted", { item: selected, ingredient });
  };

  const selectItem = (item: WeatherItemName) => {
    setSelected(item);
    setPicked(undefined);
  };

  return (
    <StackedPanelView
      title={getTranslatedItemName(selected)}
      titleIcon={ITEM_DETAILS[selected].image}
      selected
      details={
        <>
          <p className="text-xs ml-1">{ITEM_DETAILS[selected].description}</p>
          <p className="text-xxs ml-1">{t("weatherShop.onePerFarm")}</p>
        </>
      }
      options={
        <>
          {ITEMS.map((item) => (
            <Box
              key={item}
              image={ITEM_DETAILS[item].image}
              count={game.inventory[item]}
              isSelected={selected === item}
              onClick={() => selectItem(item)}
              secondaryImage={
                owned(game, item).gte(1)
                  ? undefined
                  : canAffordItem(game, item)
                    ? SUNNYSIDE.icons.confirm
                    : SUNNYSIDE.icons.cancel
              }
            />
          ))}
        </>
      }
      panels={[
        !!choice && {
          id: "choice",
          content: (
            <>
              <div className="flex flex-wrap items-center justify-between gap-1 ml-1 mb-1">
                <Label type="default" className="text-xs">
                  {selected === "Wildflower Lure"
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
              <div className="flex flex-wrap gap-1 px-1 pt-2 pb-1 overflow-y-auto max-h-48 scrollable items-start">
                {options.map((option) => (
                  <div key={option} className="flex flex-col items-center">
                    <Box
                      image={ITEM_DETAILS[option].image}
                      count={available(game, option)}
                      isSelected={ingredient === option}
                      disabled={!canPick(option)}
                      secondaryImage={
                        canPick(option) ? undefined : SUNNYSIDE.icons.cancel
                      }
                      onClick={() => setPicked(option)}
                    />
                    <span className="text-xxs leading-tight">
                      {t("weatherShop.amount", {
                        amount: formatNumber(choice[option] ?? 0),
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ),
        },
        {
          id: "requirements",
          title: t("requirements"),
          content: (
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
          ),
        },
      ]}
      action={
        <Button disabled={!canCraft} onClick={craft}>
          {hasItem ? t("weatherShop.owned") : t("craft")}
        </Button>
      }
    />
  );
};
