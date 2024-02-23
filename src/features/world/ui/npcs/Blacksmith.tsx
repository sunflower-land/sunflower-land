import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useState } from "react";
import { DeliveryPanelContent } from "../deliveries/DeliveryPanelContent";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { HeliosBlacksmithItems } from "features/helios/components/blacksmith/component/HeliosBlacksmithItems";
import { useRandomItem } from "lib/utils/hooks/useRandomItem";
import { defaultDialogue, npcDialogues } from "../deliveries/dialogues";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onClose: () => void;
}

export const Blacksmith: React.FC<Props> = ({ onClose }) => {
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
        bumpkinParts={NPC_WEARABLES.blacksmith}
        message={[
          {
            text: intro,
            actions: [
              {
                text: t("craft"),
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
      bumpkinParts={NPC_WEARABLES.blacksmith}
      tabs={[
        { icon: SUNNYSIDE.icons.hammer, name: "Craft" },
        { icon: SUNNYSIDE.icons.expression_chat, name: "Delivery" },
      ]}
      setCurrentTab={setTab}
      currentTab={tab}
    >
      {tab === 0 && <HeliosBlacksmithItems />}
      {tab === 1 && <DeliveryPanelContent npc="blacksmith" onClose={onClose} />}
    </CloseButtonPanel>
  );
};
