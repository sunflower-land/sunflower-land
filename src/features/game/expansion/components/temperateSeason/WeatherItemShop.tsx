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
 * What the player can pick for `item`, in table order. Flowers come in dozens
 * of kinds, so only the ones the player holds are offered.
 */
const getOfferedOptions = (
  game: GameState,
  item: WeatherItemName,
): InventoryItemName[] => {
  const { choice } = WEATHER_ITEM_RECIPES[item];
  if (!choice) return [];

  return item === "Wildflower Lure"
    ? getKeys(choice).filter((flower) => owned(game, flower).gt(0))
    : getKeys(choice);
};

/** Flowers the player holds most of first, then the affordable ones first. */
const sortOptions = (
  game: GameState,
  item: WeatherItemName,
  offered: InventoryItemName[],
): InventoryItemName[] => {
  const options =
    item === "Wildflower Lure"
      ? [...offered].sort((a, b) => owned(game, b).cmp(owned(game, a)))
      : offered;

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
  const offered = getOfferedOptions(game, selected);
  const offeredKey = offered.join("|");
  // Sorted when an item is selected or its options change, not on every count
  // change, so crafting never moves the options under the player.
  const options = useMemo(
    () => sortOptions(game, selected, offered),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selected, offeredKey],
  );
  // Keep the pick while it is still on offer, else default to the first one.
  const ingredient =
    picked && options.includes(picked) ? picked : (options[0] ?? undefined);

  const ingredients = getWeatherItemIngredients(selected, ingredient) ?? {};
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
              {options.length === 0 ? (
                <p className="text-xs ml-1 mb-1">
                  {t("weatherShop.noFlowers")}
                </p>
              ) : (
                <div className="flex flex-wrap gap-1 px-1 pt-2 pb-1">
                  {options.map((option) => (
                    <div key={option} className="flex flex-col items-center">
                      <Box
                        image={ITEM_DETAILS[option].image}
                        count={game.inventory[option]}
                        isSelected={ingredient === option}
                        secondaryImage={
                          canAffordOption(game, selected, option)
                            ? undefined
                            : SUNNYSIDE.icons.cancel
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
              )}
            </InnerPanel>
          )}
        </div>
      }
    />
  );
};
