import React from "react";

import { SpeakingModal } from "features/game/components/SpeakingModal";
import { NPC_WEARABLES } from "lib/npcs";
import { useTranslation } from "react-i18next";

interface Props {
  onClose: () => void;
}

export const SeasonsIntroduction: React.FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();
  return (
    <SpeakingModal
      bumpkinParts={NPC_WEARABLES["pumpkin' pete"]}
      message={[
        {
          text: t("temperateSeason.introduction.one"),
        },
        {
          text: t("temperateSeason.introduction.two"),
        },
        {
          text: t("temperateSeason.introduction.three"),
          actions: [
            {
              text: t("temperateSeason.acknowledge"),
              cb: onClose,
            },
          ],
        },
      ]}
      onClose={onClose}
    />
  );
};
