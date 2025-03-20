import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { WATER_WELL_VARIANTS } from "features/island/lib/alternateArt";
import { useSelector } from "@xstate/react";
import { useGame } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { UpgradeBuildingModal } from "features/game/expansion/components/UpgradeBuildingModal";

const _waterWell = (state: MachineState) => state.context.state.waterWell;

export const WaterWell: React.FC<BuildingProps> = ({ season }) => {
  const [openUpgradeModal, setOpenUpgradeModal] = React.useState(false);
  const { gameService } = useGame();
  const waterWell = useSelector(gameService, _waterWell);
  const { level, upgradeReadyAt } = waterWell;
  const isUpgrading = (upgradeReadyAt ?? 0) > Date.now();
  const currentLevel = isUpgrading ? level - 1 : level;

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
        onClick={() => setOpenUpgradeModal(true)}
      />
      <UpgradeBuildingModal
        buildingName={"Water Well"}
        currentLevel={currentLevel}
        nextLevel={currentLevel + 1}
        show={openUpgradeModal}
        onClose={() => setOpenUpgradeModal(false)}
      />
    </BuildingImageWrapper>
  );
};
