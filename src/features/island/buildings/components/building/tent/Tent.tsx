import React, { useContext } from "react";

import tent from "assets/buildings/tent.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingProps } from "../Building";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { MachineInterpreter } from "features/game/expansion/placeable/editingMachine";

export const Tent: React.FC<BuildingProps> = ({
  isBuilt,
  onRemove,
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
          placeable: "Tent",
          placeableType: "BUILDING",
          action: "building.moved",
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
        src={tent}
        className="absolute pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 46}px`,
          bottom: `${PIXEL_SCALE * 0}px`,
          left: `${PIXEL_SCALE * 1}px`,
        }}
      />
    </BuildingImageWrapper>
  );
};
