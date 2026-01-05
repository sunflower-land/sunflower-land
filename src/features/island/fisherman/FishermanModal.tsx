import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { SUNNYSIDE } from "assets/sunnyside";
import powerup from "assets/icons/level_up.png";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { InventoryItemName } from "features/game/types/game";
import { Context } from "features/game/GameProvider";
import { FishName, FishingBait } from "features/game/types/fishing";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import { FishingGuide } from "./FishingGuide";
import { getDailyFishingCount } from "features/game/types/fishing";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getReelGemPrice } from "features/game/events/landExpansion/buyMoreReels";
import { isFishFrenzy, isFullMoon } from "features/game/types/calendar";
import { capitalizeFirstLetters } from "lib/utils/capitalize";
import { FishermanExtras } from "./FishermanExtras";
import { OldBaitSelection } from "./OldBaitSelection";
import { BaitSelection } from "./BaitSelection";
import { hasFeatureAccess } from "lib/flags";
import { gameAnalytics } from "lib/gameAnalytics";
import { MachineState } from "features/game/lib/gameMachine";

const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `fisherman-read.${host}-${window.location.pathname}`;

function acknowledgeRead() {
  localStorage.setItem(LOCAL_STORAGE_KEY, new Date().toString());
}

function hasRead() {
  return !!localStorage.getItem(LOCAL_STORAGE_KEY);
}

interface Props {
  onCast: (
    bait: FishingBait,
    chum?: InventoryItemName,
    multiplier?: number,
    guaranteedCatch?: FishName,
  ) => void;
  onClose: () => void;
  npc?: NPCName;
}
const _state = (state: MachineState) => state.context.state;

export const FishermanModal: React.FC<Props> = ({
  onCast,
  onClose,
  npc = "reelin roy",
}) => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const { t } = useAppTranslation();
  const [showIntro, setShowIntro] = React.useState(!hasRead());

  const dailyFishingCount = getDailyFishingCount(state);

  const [showFishFrenzy, setShowFishFrenzy] = React.useState(
    isFishFrenzy(state) && dailyFishingCount === 0,
  );

  const [showFullMoon, setShowFullMoon] = React.useState(
    isFullMoon(state) && dailyFishingCount === 0,
  );

  const [tab, setTab] = useState(0);
  const gemPrice = getReelGemPrice({ state });
  const confirmBuyMoreReels = () => {
    setTab(0);
    gameService.send("fishing.reelsBought");

    gameAnalytics.trackSink({
      currency: "Gem",
      amount: gemPrice,
      item: "FishingReels",
      type: "Fee",
    });
  };

  const BaitSelectionComponent = hasFeatureAccess(state, "MULTI_CAST")
    ? BaitSelection
    : OldBaitSelection;

  if (showIntro) {
    return (
      <CloseButtonPanel onClose={onClose} bumpkinParts={NPC_WEARABLES[npc]}>
        <SpeakingText
          message={[
            {
              text: t("fishermanmodal.greeting", {
                name: capitalizeFirstLetters(npc),
              }),
            },
            {
              text: t("fishermanModal.fishBenefits"),
            },
            {
              text: t("fishermanModal.baitAndResources"),
            },
          ]}
          onClose={() => {
            acknowledgeRead();
            setShowIntro(false);
          }}
        />
      </CloseButtonPanel>
    );
  }

  if (showFishFrenzy) {
    return (
      <CloseButtonPanel onClose={onClose} bumpkinParts={NPC_WEARABLES[npc]}>
        <SpeakingText
          message={[
            {
              text: t("fishermanModal.crazyHappening"),
            },
            {
              text: t("fishermanModal.bonusFish"),
            },
          ]}
          onClose={() => {
            setShowFishFrenzy(false);
          }}
        />
      </CloseButtonPanel>
    );
  }

  if (showFullMoon) {
    return (
      <CloseButtonPanel onClose={onClose} bumpkinParts={NPC_WEARABLES[npc]}>
        <SpeakingText
          message={[
            {
              text: t("fishermanModal.fullMoon"),
            },
          ]}
          onClose={() => {
            setShowFullMoon(false);
          }}
        />
      </CloseButtonPanel>
    );
  }

  return (
    <CloseButtonPanel
      className="min-h-[360px]"
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES[npc]}
      tabs={[
        { icon: SUNNYSIDE.tools.fishing_rod, name: t("fish") },
        {
          icon: SUNNYSIDE.icons.expression_confused,
          name: t("guide"),
        },
        {
          icon: powerup,
          name: t("fishing.extras"),
        },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
      container={OuterPanel}
    >
      {tab === 0 && (
        <BaitSelectionComponent
          onCast={onCast}
          onClickBuy={() => setTab(2)}
          state={state}
        />
      )}

      {tab === 1 && (
        <InnerPanel>
          <FishingGuide onClose={() => setTab(0)} />
        </InnerPanel>
      )}
      {tab === 2 && <FishermanExtras state={state} />}
    </CloseButtonPanel>
  );
};
