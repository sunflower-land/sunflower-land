import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { PanelTabs } from "features/game/components/CloseablePanel";
import { useGame } from "features/game/GameProvider";
import { getWeatherShop, WeatherShopItem } from "features/game/types/calendar";
import { getKeys } from "features/game/types/decorations";
import { ITEM_DETAILS } from "features/game/types/images";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useState } from "react";

import weatherIcon from "assets/icons/temperature.webp";
import calendarIcon from "assets/icons/calendar.webp";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { NPC_WEARABLES } from "lib/npcs";
import { WeatherGuide } from "./WeatherGuide";
import { SpeakingModal } from "features/game/components/SpeakingModal";

function hasReadIntro() {
  const intro = localStorage.getItem("temperateSeasonIntro");
  return intro === "true";
}

function acknowledgeIntro() {
  localStorage.setItem("temperateSeasonIntro", "true");
}

const _state = (state: MachineState) => state.context.state;
interface Props {
  onClose: () => void;
}
export const WeatherShop: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useGame();
  const { t } = useAppTranslation();
  type Tab = "sale" | "guide";
  const [tab, setTab] = useState<Tab>("sale");

  const [showIntro, setShowIntro] = useState(!hasReadIntro());

  const [selected, setSelected] = useState<WeatherShopItem>("Tornado Pinwheel");

  const state = useSelector(gameService, _state);
  const { coins, inventory, island } = state;

  const craft = () => {
    gameService.send({ type: "tool.crafted", tool: selected });
  };

  if (showIntro) {
    return (
      <SpeakingModal
        onClose={() => {
          acknowledgeIntro();
          setShowIntro(false);
        }}
        bumpkinParts={NPC_WEARABLES["bailey"]}
        message={[
          {
            text: t("season.welcomeToTheWeatherShop"),
          },
        ]}
      />
    );
  }

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
    <CloseButtonPanel
      tabs={
        [
          { id: "sale", icon: weatherIcon, name: t("sale") },
          { id: "guide", icon: calendarIcon, name: t("guide") },
        ] satisfies PanelTabs<Tab>[]
      }
      currentTab={tab}
      setCurrentTab={setTab}
      onClose={onClose}
      container={OuterPanel}
      bumpkinParts={NPC_WEARABLES["bailey"]}
    >
      {tab === "sale" && (
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
                  <Button
                    disabled={!hasCoins || lessIngredients()}
                    onClick={craft}
                  >
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
      )}
      {tab === "guide" && (
        <InnerPanel>
          <WeatherGuide />
        </InnerPanel>
      )}
    </CloseButtonPanel>
  );
};
