import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useContext, useState } from "react";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { hasFeatureAccess } from "lib/flags";
import { Portals } from "../portals/Portals";

interface Props {
  onClose: () => void;
}

export const Luna: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const { t } = useAppTranslation();

  const hasAccess = hasFeatureAccess(gameState.context.state, "PORTALS");
  if (!hasAccess) {
    return (
      <SpeakingModal
        onClose={onClose}
        bumpkinParts={NPC_WEARABLES.luna}
        message={[
          {
            text: t("luna.portalNoAccess"),
          },
        ]}
      />
    );
  }

  return (
    <CloseButtonPanel
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES.luna}
      tabs={[{ icon: SUNNYSIDE.icons.heart, name: t("luna.portals") }]}
    >
      <div style={{ height: "350px" }} className="scrollable overflow-y-auto">
        <Portals />
      </div>
    </CloseButtonPanel>
  );
};
