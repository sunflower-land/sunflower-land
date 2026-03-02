import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { WATER_WELL_VARIANTS } from "features/island/lib/alternateArt";
import { useSelector } from "@xstate/react";
import { useGame } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { UpgradeBuildingModal } from "features/game/expansion/components/UpgradeBuildingModal";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Constructing } from "../Building";
import { gameAnalytics } from "lib/gameAnalytics";
import { useNow } from "lib/utils/hooks/useNow";

const _waterWell = (state: MachineState) => state.context.state.waterWell;
const _state = (state: MachineState) => state.context.state;

export const WaterWell: React.FC<BuildingProps> = ({ season }) => {
  const [openUpgradeModal, setOpenUpgradeModal] = React.useState(false);
  const [showConstructingModal, setShowConstructingModal] =
    React.useState(false);
  const { gameService } = useGame();

  const waterWell = useSelector(gameService, _waterWell);
  const state = useSelector(gameService, _state);
  const { level, upgradeReadyAt, upgradedAt } = waterWell;
  const now = useNow({ live: true, autoEndAt: upgradeReadyAt ?? 0 });

  const isUpgrading = (upgradeReadyAt ?? 0) > now;
  const currentLevel = isUpgrading ? level - 1 : level;
  const previousIsUpgrading = React.useRef(isUpgrading);

  React.useEffect(() => {
    if (!previousIsUpgrading.current && isUpgrading) {
      setShowConstructingModal(true);
    }

    if (previousIsUpgrading.current && !isUpgrading) {
      setShowConstructingModal(false);
    }

    previousIsUpgrading.current = isUpgrading;
  }, [isUpgrading]);

  const handleClick = () => {
    if (isUpgrading) {
      setShowConstructingModal(true);
      return;
    }

    setOpenUpgradeModal(true);
  };

  const handleSpeedUp = (gems: number) => {
    gameService.send({ type: "upgrade.spedUp", name: "Water Well" });
    gameAnalytics.trackSink({
      currency: "Gem",
      amount: gems,
      item: "Instant Build",
      type: "Fee",
    });
    setShowConstructingModal(false);
  };

  const nextLevel = Math.min(currentLevel + 1, 4);

  return (
    <BuildingImageWrapper name="Water Well" nonInteractible>
      <img
        src={WATER_WELL_VARIANTS[season][currentLevel]}
        style={{
          width: `${PIXEL_SCALE * 25}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 4}px`,
        }}
        className="absolute cursor-pointer"
        onClick={handleClick}
      />
      <UpgradeBuildingModal
        buildingName={"Water Well"}
        currentLevel={currentLevel}
        nextLevel={nextLevel}
        show={openUpgradeModal}
        onClose={() => setOpenUpgradeModal(false)}
      />
      <Modal
        show={showConstructingModal && isUpgrading}
        onHide={() => setShowConstructingModal(false)}
      >
        <CloseButtonPanel onClose={() => setShowConstructingModal(false)}>
          <Constructing
            name="Water Well"
            readyAt={upgradeReadyAt ?? 0}
            createdAt={upgradedAt ?? 0}
            state={state}
            onClose={() => setShowConstructingModal(false)}
            onInstantBuilt={handleSpeedUp}
          />
        </CloseButtonPanel>
      </Modal>
    </BuildingImageWrapper>
  );
};
