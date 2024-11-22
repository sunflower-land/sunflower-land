import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useState } from "react";
import { DeliveryPanelContent } from "../deliveries/DeliveryPanelContent";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { useRandomItem } from "lib/utils/hooks/useRandomItem";
import { npcDialogues, defaultDialogue } from "../deliveries/dialogues";
import { BeachBaitShop } from "../beach/BeachBaitShop";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { OuterPanel } from "components/ui/Panel";
import fishingLure from "assets/composters/fishing_lure.png";

const host = window.location.host.replace(/^www\./, "");
const LOCAL_STORAGE_KEY = `finn-read.${host}-${window.location.pathname}`;

function acknowledgeIntroRead() {
  localStorage.setItem(LOCAL_STORAGE_KEY, new Date().toString());
}

function hasReadIntro() {
  return !!localStorage.getItem(LOCAL_STORAGE_KEY);
}

interface Props {
  onClose: () => void;
}

export const Finn: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState(0);
  const [showIntro, setShowIntro] = useState(!hasReadIntro());
  const dialogue = npcDialogues.finn || defaultDialogue;
  const intro = useRandomItem(dialogue.intro);
  const { t } = useAppTranslation();

  const handleIntro = (tab: number) => {
    setShowIntro(false);
    acknowledgeIntroRead();
    setTab(tab);
  };

  if (showIntro) {
    return (
      <SpeakingModal
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES.finn}
        message={[
          {
            text: intro,
            actions: [
              {
                text: t("buy"),
                cb: () => handleIntro(1),
              },
              {
                text: t("delivery"),
                cb: () => handleIntro(0),
              },
            ],
          },
        ]}
      />
    );
  }

  return (
    <CloseButtonPanel
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES.finn}
      container={OuterPanel}
      tabs={[
        { icon: SUNNYSIDE.icons.expression_chat, name: t("delivery") },
        { icon: fishingLure, name: t("buy") },
      ]}
      setCurrentTab={setTab}
      currentTab={tab}
    >
      {tab === 0 && <DeliveryPanelContent npc="finn" />}
      {tab === 1 && <BeachBaitShop />}
    </CloseButtonPanel>
  );
};
