import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useState } from "react";
import { CommunityIslands } from "../community/CommunityIslands";
import { DeliveryPanelContent } from "../deliveries/DeliveryPanelContent";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { useRandomItem } from "lib/utils/hooks/useRandomItem";
import { npcDialogues, defaultDialogue } from "../deliveries/dialogues";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: () => void;
}

export const Grubnuk: React.FC<Props> = ({ onClose }) => {
  const { t } = useAppTranslation();
  const [tab, setTab] = useState(0);
  const [confirmAction, setConfirmAction] = useState(false);
  const dialogue = npcDialogues.blacksmith || defaultDialogue;
  const intro = useRandomItem(dialogue.intro);

  const handleConfirm = (tab: number) => {
    setConfirmAction(true);
    setTab(tab);
  };

  if (!confirmAction) {
    return (
      <SpeakingModal
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES.grubnuk}
        message={[
          {
            text: intro,
            actions: [
              {
                text: "Community Islands",
                cb: () => handleConfirm(0),
              },
              {
                text: t("delivery"),
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
      bumpkinParts={NPC_WEARABLES.grubnuk}
      tabs={[
        { icon: SUNNYSIDE.icons.heart, name: "Community Island" },
        { icon: SUNNYSIDE.icons.expression_chat, name: "Delivery" },
      ]}
      setCurrentTab={setTab}
      currentTab={tab}
    >
      {tab === 0 && <CommunityIslands />}
      {tab === 1 && (
        <DeliveryPanelContent npc="grubnuk" skipIntro onClose={onClose} />
      )}
    </CloseButtonPanel>
  );
};
