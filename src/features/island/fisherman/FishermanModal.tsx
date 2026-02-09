import React, { useContext, useState } from "react";
import { useSelector } from "@xstate/react";

import { SUNNYSIDE } from "assets/sunnyside";
import powerup from "assets/icons/level_up.png";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { SpeakingText } from "features/game/components/SpeakingModal";
import { InventoryItemName } from "features/game/types/game";
import { Context } from "features/game/GameProvider";
import {
  FishName,
  FishingBait,
  MAP_PIECE_MARVELS,
} from "features/game/types/fishing";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import { FishingGuide } from "./FishingGuide";
import { getDailyFishingCount } from "features/game/types/fishing";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { isFishFrenzy, isFullMoon } from "features/game/types/calendar";
import { capitalizeFirstLetters } from "lib/utils/capitalize";
import { FishermanExtras } from "./FishermanExtras";
import { MachineState } from "features/game/lib/gameMachine";
import { MarvelHunt } from "./MarvelHunt";
import { BaitSelection } from "./BaitSelection";

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

const _marvel = (state: MachineState) => {
  const game = state.context.state;
  // If there is a ready marvel to be caught;
  const ready = MAP_PIECE_MARVELS.find(
    (marvel) =>
      !game.farmActivity[`${marvel} Caught`] &&
      (game.farmActivity[`${marvel} Map Piece Found`] ?? 0) >= 9,
  );

  return ready;
};

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

  type Tab = "fish" | "guide" | "extras";
  const [tab, setTab] = useState<Tab>("fish");

  const readyMarvel = useSelector(gameService, _marvel);

  if (readyMarvel) {
    return <MarvelHunt onClose={onClose} marvel={readyMarvel} />;
  }

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
        { id: "fish", icon: SUNNYSIDE.tools.fishing_rod, name: t("fish") },
        {
          id: "guide",
          icon: SUNNYSIDE.icons.expression_confused,
          name: t("guide"),
        },
        {
          id: "extras",
          icon: powerup,
          name: t("fishing.extras"),
        },
      ]}
      currentTab={tab}
      setCurrentTab={setTab}
      container={OuterPanel}
    >
      {tab === "fish" && <BaitSelection onCast={onCast} state={state} />}

      {tab === "guide" && (
        <InnerPanel>
          <FishingGuide onClose={() => setTab("fish")} />
        </InnerPanel>
      )}
      {tab === "extras" && <FishermanExtras state={state} />}
    </CloseButtonPanel>
  );
};
