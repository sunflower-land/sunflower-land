import React, { FC } from "react";
import { useNavigate } from "react-router";
import { NPC_WEARABLES } from "lib/npcs";
import { translate } from "lib/i18n/translate";
import { SpeakingModal } from "../SpeakingModal";

const STONE_BEETLE_MARKETPLACE_PATH = "/marketplace/collectibles/2129";

export const MarketplaceTutorialModal: FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const navigate = useNavigate();
  return (
    <SpeakingModal
      message={[
        {
          text: translate("marketplace.tutorial.one"),
        },
        {
          text: translate("marketplace.tutorial.two"),
        },
        {
          text: translate("marketplace.tutorial.three"),
          actions: [
            {
              text: translate("marketplace.tutorial.openButton"),
              cb: () => {
                navigate(STONE_BEETLE_MARKETPLACE_PATH);
                onClose();
              },
            },
          ],
        },
      ]}
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES["hammerin harry"]}
    />
  );
};
