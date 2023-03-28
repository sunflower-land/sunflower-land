import React, { useContext } from "react";

import toolshed from "assets/buildings/toolshed.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MachineInterpreter } from "features/game/expansion/placeable/editingMachine";

export const Toolshed: React.FC<BuildingProps> = ({
  onRemove,
  isBuilt,
  buildingId,
}) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const handleClick = () => {
    if (gameState.matches("editing")) {
      const editing = gameService.state.children.editing as MachineInterpreter;

      if (editing.state.matches("idle")) {
        editing.send("SELECT_TO_MOVE", {
          id: buildingId,
          placeable: "Toolshed",
          placeableType: "BUILDING",
        });
        return;
      }
      return;
    }
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
    <BuildingImageWrapper onClick={handleClick} nonInteractible={!onRemove}>
      <img
        src={toolshed}
        style={{
          width: `${PIXEL_SCALE * 39}px`,
          bottom: `${PIXEL_SCALE * 4}px`,
          left: `${PIXEL_SCALE * 0}px`,
        }}
        className="absolute pointer-events-none"
      />
    </BuildingImageWrapper>
  );
};
