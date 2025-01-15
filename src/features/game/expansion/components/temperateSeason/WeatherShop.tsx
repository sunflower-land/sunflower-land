import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { OuterPanel, Panel } from "components/ui/Panel";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { useGame } from "features/game/GameProvider";
import { WEATHER_SHOP } from "features/game/types/calendar";
import { getKeys } from "features/game/types/decorations";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { hasFeatureAccess } from "lib/flags";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useState } from "react";

import weatherIcon from "assets/icons/temperature.webp";
import calendarIcon from "assets/icons/calendar.webp";

interface Props {
  onClose: () => void;
}
export const WeatherShop: React.FC<Props> = ({ onClose }) => {
  const { gameState, gameService } = useGame();
  const { t } = useAppTranslation();
  const [tab, setTab] = useState(0);

  const [selected, setSelected] =
    useState<InventoryItemName>("Tornado Pinwheel");

  const game = gameState.context.state;

  const hasAccess = hasFeatureAccess(game, "WEATHER_SHOP");

  const craft = () => {
    gameService.send("tool.crafted", {
      tool: selected,
    });
  };

  if (!hasAccess) {
    return (
      <Panel>
        <div className="p-2">
          <p className="text-sm mb-2">
            {t("temperateSeason.weatherShop.buy.description")}
          </p>
          <p className="text-xs">
            {t("temperateSeason.weatherShop.buy.comingSoon")}
          </p>
        </div>
        <Button onClick={onClose}>{t("close")}</Button>
      </Panel>
    );
  }

  const hasCoins = game.coins >= WEATHER_SHOP[selected]!.price;
  const hasItem = !!game.inventory[selected];
  return (
    <CloseButtonPanel
      tabs={[
        { icon: weatherIcon, name: t("temperateSeason.weatherShop.weather") },
        { icon: calendarIcon, name: t("guide") },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
      onClose={onClose}
      container={OuterPanel}
    >
      <SplitScreenView
        panel={
          <CraftingRequirements
            gameState={game}
            details={{
              item: selected,
            }}
            limit={1}
            requirements={{
              coins: WEATHER_SHOP[selected]!.price,
            }}
            actionView={
              hasItem ? undefined : (
                <Button disabled={!hasCoins} onClick={craft}>
                  {t("buy")}
                </Button>
              )
            }
          />
        }
        content={
          <>
            {getKeys(WEATHER_SHOP).map((itemName) => {
              return (
                <Box
                  isSelected={selected === itemName}
                  key={itemName}
                  onClick={() => setSelected(itemName)}
                  image={ITEM_DETAILS[itemName].image}
                  count={game.inventory[itemName]}
                />
              );
            })}
          </>
        }
      />
    </CloseButtonPanel>
  );
};
