import React, { useContext } from "react";

import npc from "assets/npcs/blacksmith.gif";
import shadow from "assets/npcs/shadow.png";
import workbench from "assets/buildings/workbench.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { WorkbenchModal } from "./components/WorkbenchModal";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { MachineInterpreter } from "features/game/expansion/placeable/editingMachine";

export const WorkBench: React.FC<BuildingProps> = ({
  isBuilt,
  onRemove,
  buildingId,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const handleClick = () => {
    if (gameState.matches("editing")) {
      const editing = gameService.state.children.editing as MachineInterpreter;

      if (editing.state.matches("idle")) {
        editing.send("SELECT_TO_MOVE", {
          id: buildingId,
          placeable: "Workbench",
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
      setIsOpen(true);
      return;
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <BuildingImageWrapper onClick={handleClick}>
        <img
          src={workbench}
          className="absolute bottom-0"
          style={{
            width: `${PIXEL_SCALE * 47}px`,
            height: `${PIXEL_SCALE * 36}px`,
          }}
        />
        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 14}px`,
            right: `${PIXEL_SCALE * 11}px`,
          }}
        />
        <img
          src={npc}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            bottom: `${PIXEL_SCALE * 16}px`,
            right: `${PIXEL_SCALE * 12}px`,
          }}
        />
      </BuildingImageWrapper>
      <WorkbenchModal isOpen={isOpen} onClose={handleClose} />
    </>
  );
};
