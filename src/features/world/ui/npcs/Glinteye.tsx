import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useState } from "react";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { useRandomItem } from "lib/utils/hooks/useRandomItem";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { BuyPanel } from "../trader/BuyPanel";
import { Trade } from "features/bumpkins/components/Trade";

interface Props {
  onClose: () => void;
}

export const Glinteye: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState(0);
  const [confirmAction, setConfirmAction] = useState(false);
  const { t } = useAppTranslation();

  const handleConfirm = (tab: number) => {
    setConfirmAction(true);
    setTab(tab);
  };

  const intro = [
    t("npcDialogues.glinteye.intro1"),
    t("npcDialogues.glinteye.intro2"),
    t("npcDialogues.glinteye.intro3"),
    t("npcDialogues.glinteye.intro4"),
  ];

  const randomIntro = useRandomItem(intro);

  if (!confirmAction) {
    return (
      <SpeakingModal
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES.glinteye}
        message={[
          {
            text: randomIntro,
            actions: [
              {
                text: t("buy"),
                cb: () => handleConfirm(0),
              },
              {
                text: t("sell"),
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
      bumpkinParts={NPC_WEARABLES.glinteye}
      tabs={[
        { icon: SUNNYSIDE.icons.heart, name: t("buy") },
        { icon: SUNNYSIDE.icons.expression_chat, name: t("sell") },
      ]}
      setCurrentTab={setTab}
      currentTab={tab}
    >
      {tab === 0 && <BuyPanel onClose={onClose} />}
      {tab === 1 && <Trade />}
    </CloseButtonPanel>
  );
};
