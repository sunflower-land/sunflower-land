import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import {
  getWeatherShop,
  type WeatherShopItem,
} from "features/game/types/calendar";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getKeys } from "lib/object";

const _state = (state: MachineState) => state.context.state;

/** The calendar-era Weather Shop, sold while the Weather flag is off. */
export const LegacyWeatherShop: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();

  const [selected, setSelected] = useState<WeatherShopItem>("Tornado Pinwheel");

  const state = useSelector(gameService, _state);
  const { coins, inventory, island } = state;

  const craft = () => {
    gameService.send("tool.crafted", {
      tool: selected,
    });
  };

  const weatherShop = getWeatherShop(island.type);
  const hasCoins = coins >= weatherShop[selected].price;
  const hasItem = !!inventory[selected];

  const itemIngredients = weatherShop[selected].ingredients(
    state.bumpkin.skills,
  );
  const lessIngredients = () =>
    getKeys(itemIngredients).some((name) =>
      itemIngredients[name]?.greaterThan(inventory[name] || 0),
    );

  return (
    <SplitScreenView
      panel={
        <CraftingRequirements
          gameState={state}
          details={{
            item: selected,
          }}
          limit={1}
          requirements={{
            resources: itemIngredients,
            coins: weatherShop[selected].price,
          }}
          actionView={
            hasItem ? undefined : (
              <Button disabled={!hasCoins || lessIngredients()} onClick={craft}>
                {t("buy")}
              </Button>
            )
          }
        />
      }
      content={
        <>
          {getKeys(weatherShop).map((itemName) => {
            return (
              <Box
                isSelected={selected === itemName}
                key={itemName}
                onClick={() => setSelected(itemName)}
                image={ITEM_DETAILS[itemName].image}
                count={inventory[itemName]}
              />
            );
          })}
        </>
      }
    />
  );
};
