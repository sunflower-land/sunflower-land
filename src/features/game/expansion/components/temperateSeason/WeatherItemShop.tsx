import Decimal from "decimal.js-light";
import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { Button } from "components/ui/Button";
import { StackedPanelView } from "components/ui/StackedPanelView";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import type { GameState, InventoryItemName } from "features/game/types/game";
import {
  ITEM_DETAILS,
  getTranslatedItemName,
} from "features/game/types/images";
import {
  WEATHER_ITEM_RECIPES,
  type WeatherItemName,
} from "features/game/types/weatherItems";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getKeys } from "lib/object";
import {
  canAffordItem,
  useWeatherItemPick,
  WeatherItemChoice,
  WeatherItemRequirements,
} from "./WeatherItemRecipe";

const ITEMS = getKeys(WEATHER_ITEM_RECIPES);

const _game = (state: MachineState) => state.context.state;

const owned = (game: GameState, item: InventoryItemName) =>
  game.inventory[item] ?? new Decimal(0);

export const WeatherItemShop: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const game = useSelector(gameService, _game);

  const [selected, setSelected] = useState<WeatherItemName>("Sandbag");
  const pick = useWeatherItemPick(game, selected);

  const hasItem = owned(game, selected).gte(1);
  const canCraft = !hasItem && pick.canPay;

  const craft = () => {
    gameService.send("weatherItem.crafted", {
      item: selected,
      ingredient: pick.ingredient,
    });
  };

  return (
    <StackedPanelView
      title={getTranslatedItemName(selected)}
      titleIcon={ITEM_DETAILS[selected].image}
      selected
      details={
        <>
          <p className="text-xs mx-1">{ITEM_DETAILS[selected].description}</p>
          <p className="text-xxs mx-1 mb-1">{t("weatherShop.onePerFarm")}</p>
        </>
      }
      options={ITEMS.map((item) => ({
        id: item,
        image: ITEM_DETAILS[item].image,
        count: game.inventory[item],
        selected: selected === item,
        onClick: () => setSelected(item),
        status: owned(game, item).gte(1)
          ? undefined
          : canAffordItem(game, item)
            ? "ready"
            : "missing",
      }))}
      panels={[
        !!WEATHER_ITEM_RECIPES[selected].choice && {
          id: "choice",
          content: (
            <WeatherItemChoice game={game} item={selected} pick={pick} />
          ),
        },
        {
          id: "requirements",
          title: t("requirements"),
          content: (
            <WeatherItemRequirements
              game={game}
              ingredients={pick.ingredients}
            />
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
