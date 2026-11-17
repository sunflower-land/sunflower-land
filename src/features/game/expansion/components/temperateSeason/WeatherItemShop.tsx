import Decimal from "decimal.js-light";
import React, { useContext, useMemo, useState } from "react";
import { useSelector } from "@xstate/react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { InnerPanel } from "components/ui/Panel";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
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

const ITEMS = getKeys(WEATHER_ITEM_RECIPES);

const _game = (state: MachineState) => state.context.state;

const owned = (game: GameState, item: InventoryItemName) =>
  game.inventory[item] ?? new Decimal(0);

const canAffordOption = (
  game: GameState,
  item: WeatherItemName,
  option: InventoryItemName,
) => owned(game, option).gte(WEATHER_ITEM_RECIPES[item].choice?.[option] ?? 0);

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
      ? getKeys(choice).sort((a, b) => owned(game, b).cmp(owned(game, a)))
      : getKeys(choice);

  return [
    ...options.filter((option) => canAffordOption(game, item, option)),
    ...options.filter((option) => !canAffordOption(game, item, option)),
  ];
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
  const resources = getKeys(ingredients).reduce(
    (acc, name) => ({ ...acc, [name]: new Decimal(ingredients[name] ?? 0) }),
    {} as Partial<Record<InventoryItemName, Decimal>>,
  );

  const hasItem = owned(game, selected).gte(1);
  const canCraft =
    (!choice || !!ingredient) &&
    getKeys(resources).every((name) =>
      owned(game, name).gte(resources[name] ?? 0),
    );

  const craft = () => {
    gameService.send("weatherItem.crafted", { item: selected, ingredient });
  };

  const selectItem = (item: WeatherItemName) => {
    setSelected(item);
    setPicked(undefined);
  };

  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={game}
          details={{ item: selected }}
          limit={1}
          requirements={{ resources }}
          actionView={
            hasItem ? undefined : (
              <Button disabled={!canCraft} onClick={craft}>
                {t("craft")}
              </Button>
            )
          }
        />
      }
      content={
        <div className="flex flex-col w-full">
          <div className="flex flex-wrap">
            {ITEMS.map((item) => (
              <Box
                isSelected={selected === item}
                key={item}
                onClick={() => selectItem(item)}
                image={ITEM_DETAILS[item].image}
                count={game.inventory[item]}
              />
            ))}
          </div>

          {choice && (
            <InnerPanel className="mt-1">
              <div className="flex flex-wrap items-center justify-between gap-1 ml-1 mb-1">
                <Label type="default">
                  {selected === "Wildflower Lure"
                    ? t("weatherShop.chooseFlower")
                    : t("weatherShop.chooseBeetle")}
                </Label>
                {ingredient && (
                  <Label type="default" icon={ITEM_DETAILS[ingredient].image}>
                    {t("weatherShop.ingredientAmount", {
                      item: getTranslatedItemName(ingredient),
                      amount: formatNumber(choice[ingredient] ?? 0),
                    })}
                  </Label>
                )}
              </div>
              <div className="flex flex-wrap gap-1 px-1 pt-2 pb-1 overflow-y-auto max-h-56 scrollable">
                {options.map((option) => (
                  <div key={option} className="flex flex-col items-center">
                    <Box
                      image={ITEM_DETAILS[option].image}
                      count={game.inventory[option]}
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
            </InnerPanel>
          )}
        </div>
      }
    />
  );
};
