import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useState } from "react";
import { DeliveryPanelContent } from "../deliveries/DeliveryPanelContent";
import {
  SpeakingModal,
  SpeakingText,
} from "features/game/components/SpeakingModal";
import { useRandomItem } from "lib/utils/hooks/useRandomItem";
import { defaultDialogue, npcDialogues } from "../deliveries/dialogues";

interface Props {
  onClose: () => void;
}

const discoveryDialogues = [
  "Ah, the path of Discovery! My passion isn't to hoard, but to behold. Show me the treasure you've found, and in gratitude, Crow Feathers will be yours.",
  "Ah, you've chosen Discovery! Remember, I simply wish to gaze upon these rare items. Present them to me, and Crow Feathers shall be your reward. No trade, just a look.",
  "Embarking on Discovery, are we? All I ask is a mere glimpse of the treasures you uncover. In return, a handful of Crow Feathers will be your prize.",
  "Discovery, the pure joy of observation! I don't wish to take your items, just to admire them. And for that fleeting moment of wonder, Crow Feathers will be bestowed upon you.",
  "You've chosen wisely! Let me just see, admire, and marvel at your item. Fear not, it remains yours. And for your generosity, Crow Feathers shall rain upon you.",
];

export const Bert: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState(0);
  const [confirmAction, setConfirmAction] = useState(false);
  const dialogue = npcDialogues.bert || defaultDialogue;
  const intro = useRandomItem(dialogue.intro);
  const discoveryDialogue = useRandomItem(discoveryDialogues);

  const handleConfirm = (tab: number) => {
    setConfirmAction(true);
    setTab(tab);
  };

  if (!confirmAction) {
    return (
      <SpeakingModal
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES.bert}
        message={[
          {
            text: intro,
            actions: [
              {
                text: "Delivery",
                cb: () => handleConfirm(0),
              },
              {
                text: "Discover",
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
      bumpkinParts={NPC_WEARABLES.bert}
      tabs={[
        { icon: SUNNYSIDE.icons.expression_chat, name: "Delivery" },
        { icon: SUNNYSIDE.icons.wardrobe, name: "Discover" },
      ]}
      setCurrentTab={setTab}
      currentTab={tab}
    >
      {tab === 0 && (
        <DeliveryPanelContent npc="bert" skipIntro onClose={onClose} />
      )}
      {tab === 1 && (
        <div className="npc-dialogue">
          <SpeakingText
            onClose={onClose}
            message={[
              {
                text: discoveryDialogue,
              },
            ]}
          />
        </div>
      )}
    </CloseButtonPanel>
  );
};
