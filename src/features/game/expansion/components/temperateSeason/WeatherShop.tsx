import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { CraftingRequirements } from "components/ui/layouts/CraftingRequirements";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
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
  const [tab, setTab] = useState(0);

  const [showIntro, setShowIntro] = useState(!hasReadIntro());

  const [selected, setSelected] = useState<WeatherShopItem>("Tornado Pinwheel");

  const state = useSelector(gameService, _state);
  const { coins, inventory, island } = state;

  const craft = () => {
    gameService.send("tool.crafted", {
      tool: selected,
    });
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

  return (
    <CloseButtonPanel
      tabs={[
        { icon: weatherIcon, name: t("sale") },
        { icon: calendarIcon, name: t("guide") },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
      onClose={onClose}
      container={OuterPanel}
      bumpkinParts={NPC_WEARABLES["bailey"]}
    >
      {tab === 0 && (
        <SplitScreenView
          panel={
            <CraftingRequirements
              gameState={state}
              details={{
                item: selected,
              }}
              limit={1}
              requirements={{
                resources: weatherShop[selected].ingredients,
                coins: weatherShop[selected].price,
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
      {tab === 1 && (
        <InnerPanel>
          <WeatherGuide />
        </InnerPanel>
      )}
    </CloseButtonPanel>
  );
};
