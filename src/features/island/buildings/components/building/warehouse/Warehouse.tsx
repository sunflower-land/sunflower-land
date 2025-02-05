import React, { useContext } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { MachineState } from "features/game/lib/gameMachine";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { WAREHOUSE_VARIANTS } from "features/island/lib/alternateArt";
const _season = (state: MachineState) => state.context.state.season.season;

export const Warehouse: React.FC<BuildingProps> = ({ onRemove, isBuilt }) => {
  const { gameService } = useContext(Context);
  const season = useSelector(gameService, _season);
  const handleClick = () => {
    if (onRemove) {
      onRemove();
      return;
    }

    if (isBuilt) {
      // Add future on click actions here
      return;
    }
  };

  return (
    <BuildingImageWrapper
      name="Warehouse"
      onClick={handleClick}
      nonInteractible={!onRemove}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 50}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * -1}px`,
        }}
      >
        <img
          src={WAREHOUSE_VARIANTS[season]}
          style={{
            width: `${PIXEL_SCALE * 50}px`,
          }}
        />
      </div>
    </BuildingImageWrapper>
  );
};
