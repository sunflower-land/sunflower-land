import { Modal } from "components/ui/Modal";
import React, { useContext, useEffect, useState } from "react";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import socialPointsIcon from "assets/icons/social_score.webp";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { SocialLeaderboard } from "features/social/components/SocialLeaderboard";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { discoveryModalManager } from "./lib/discoveryModalManager";

type Tab = "Leaderboard" | "Discovery";

const _farmId = (state: MachineState) => state.context.farmId;

export const Discovery: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
  const [tab, setTab] = useState<Tab>("Leaderboard");

  const farmId = useSelector(gameService, _farmId);

  useEffect(() => {
    discoveryModalManager.listen(() => {
      setShowDiscoveryModal(true);
    });
  }, []);

  return (
    <Modal
      show={showDiscoveryModal}
      onHide={() => setShowDiscoveryModal(false)}
    >
      <CloseButtonPanel
        onClose={() => setShowDiscoveryModal(false)}
        currentTab={tab}
        setCurrentTab={setTab}
        tabs={[
          // {
          //   icon: SUNNYSIDE.icons.search,
          //   name: t("discovery"),
          //   id: "Discovery",
          // },
          {
            icon: socialPointsIcon,
            name: t("leaderboard"),
            id: "Leaderboard",
          },
        ]}
      >
        {/* {tab === "Discovery" && <div>{`Discovery`}</div>} */}
        {tab === "Leaderboard" && (
          <SocialLeaderboard
            id={farmId}
            onClose={() => setShowDiscoveryModal(false)}
          />
        )}
      </CloseButtonPanel>
    </Modal>
  );
};
