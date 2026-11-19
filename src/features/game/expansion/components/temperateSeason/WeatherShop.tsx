import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import type { PanelTabs } from "features/game/components/CloseablePanel";
import { useGame } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import React, { useState } from "react";

import weatherIcon from "assets/icons/temperature.webp";
import calendarIcon from "assets/icons/calendar.webp";
import type { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { NPC_WEARABLES } from "lib/npcs";
import { WeatherGuide } from "./WeatherGuide";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { hasFeatureAccess } from "lib/flags";
import { WeatherItemShop } from "./WeatherItemShop";
import { LegacyWeatherShop } from "./LegacyWeatherShop";

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

  const state = useSelector(gameService, _state);

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
      {tab === "sale" &&
        (hasFeatureAccess(state, "WEATHER") ? (
          <WeatherItemShop />
        ) : (
          <LegacyWeatherShop />
        ))}
      {tab === "guide" && (
        <InnerPanel>
          <WeatherGuide />
        </InnerPanel>
      )}
    </CloseButtonPanel>
  );
};
