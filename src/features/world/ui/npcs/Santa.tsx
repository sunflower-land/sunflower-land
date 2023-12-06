import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES, acknowledgeNPC, isNPCAcknowledged } from "lib/npcs";
import React, { useContext, useEffect, useState } from "react";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";

interface Props {
  onClose: () => void;
}

export const Santa: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState(0);
  const [showIntro, setShowIntro] = useState(!isNPCAcknowledged("santa"));

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { t } = useAppTranslation();

  useEffect(() => {
    acknowledgeNPC("santa");
  }, []);

  if (showIntro) {
    return (
      <SpeakingModal
        onClose={() => setShowIntro(false)}
        bumpkinParts={NPC_WEARABLES.santa}
        message={[
          {
            text: t("santa.introduction"),
          },
        ]}
      />
    );
  }

  return (
    <CloseButtonPanel onClose={onClose} bumpkinParts={NPC_WEARABLES.santa}>
      Santa
    </CloseButtonPanel>
  );
};
