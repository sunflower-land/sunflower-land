import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useState } from "react";
import { DeliveryPanelContent } from "../deliveries/DeliveryPanelContent";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { useRandomItem } from "lib/utils/hooks/useRandomItem";
import { npcDialogues, defaultDialogue } from "../deliveries/dialogues";
import { BeachBaitShop } from "../beach/BeachBaitShop";

interface Props {
  onClose: () => void;
}

export const Finn: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState(0);
  const [confirmAction, setConfirmAction] = useState(false);
  const dialogue = npcDialogues.finn || defaultDialogue;
  const intro = useRandomItem(dialogue.intro);

  const handleConfirm = (tab: number) => {
    setConfirmAction(true);
    setTab(tab);
  };

  if (!confirmAction) {
    return (
      <SpeakingModal
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES.finn}
        message={[
          {
            text: intro,
            actions: [
              {
                text: "Buy",
                cb: () => handleConfirm(0),
              },
              {
                text: "Delivery",
                cb: () => handleConfirm(1),
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
      tabs={[
        { icon: SUNNYSIDE.icons.heart, name: "Buy" },
        { icon: SUNNYSIDE.icons.expression_chat, name: "Delivery" },
      ]}
      setCurrentTab={setTab}
      currentTab={tab}
    >
      {tab === 0 && <BeachBaitShop />}
      {tab === 1 && (
        <DeliveryPanelContent npc="finn" skipIntro onClose={onClose} />
      )}
    </CloseButtonPanel>
  );
};
