import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { WATER_WELL_VARIANTS } from "features/island/lib/alternateArt";
import { UpgradeWaterWell } from "./UpgradeWaterWell";
import { useSelector } from "@xstate/react";
import { useGame } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";

const _wellLevel = (state: MachineState) => state.context.state.waterWell.level;
const _coins = (state: MachineState) => state.context.state.coins;
const _inventory = (state: MachineState) => state.context.state.inventory;

export const WaterWell: React.FC<BuildingProps> = ({ season }) => {
  const [openUpgradeModal, setOpenUpgradeModal] = React.useState(false);
  const { gameService } = useGame();
  const wellLevel = useSelector(gameService, _wellLevel);
  const coins = useSelector(gameService, _coins);
  const inventory = useSelector(gameService, _inventory);
  const handleUpgradeWaterWell = () => {
    gameService.send("building.upgraded", {
      buildingType: "Water Well",
    });
    setOpenUpgradeModal(true);
  };

  return (
    <BuildingImageWrapper name="Water Well" nonInteractible>
      <img
        src={WATER_WELL_VARIANTS[season][wellLevel]}
        style={{
          width: `${PIXEL_SCALE * 25}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 4}px`,
        }}
        className="absolute cursor-pointer"
        onClick={() => setOpenUpgradeModal(true)}
      />
      <UpgradeWaterWell
        open={openUpgradeModal}
        onClose={() => setOpenUpgradeModal(false)}
        wellLevel={wellLevel}
        coins={coins}
        inventory={inventory}
        handleUpgradeWaterWell={handleUpgradeWaterWell}
      />
    </BuildingImageWrapper>
  );
};
