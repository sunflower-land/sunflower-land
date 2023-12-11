import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useContext, useState } from "react";
import { SpeakingModal } from "features/game/components/SpeakingModal";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { Portals } from "../portals/Portals";
import { hasFeatureAccess } from "lib/flags";

interface Props {
  onClose: () => void;
}

export const Luna: React.FC<Props> = ({ onClose }) => {
  const [tab, setTab] = useState(0);

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
      tabs={[
        { icon: SUNNYSIDE.icons.heart, name: t("luna.portals") },
        { icon: SUNNYSIDE.icons.treasure, name: t("luna.rewards") },
      ]}
      setCurrentTab={setTab}
      currentTab={tab}
    >
      {tab === 0 && (
        <>
          <div className="p-1">
            <p className="text-sm">
              Travel to these player built portals and earn rewards.
            </p>
          </div>
          <Portals />
        </>
      )}
      {tab === 1 && (
        <div className="p-1">
          <p className="text-sm">Coming soon...</p>
        </div>
      )}
    </CloseButtonPanel>
  );
};
