import React, { useContext } from "react";
import { Modal } from "react-bootstrap";

import building from "assets/buildings/hen_house.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { HenHouseModal } from "./components/HenHouseModal";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { MachineInterpreter } from "features/game/expansion/placeable/editingMachine";

export const ChickenHouse: React.FC<BuildingProps> = ({
  isBuilt,
  onRemove,
  buildingId,
}) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    if (gameState.matches("editing")) {
      const editing = gameService.state.children.editing as MachineInterpreter;

      if (editing.state.matches("idle")) {
        editing.send("SELECT_TO_MOVE", {
          id: buildingId,
          placeable: "Hen House",
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
          src={building}
          className="absolute bottom-0"
          style={{
            width: `${PIXEL_SCALE * 61}px`,
            height: `${PIXEL_SCALE * 49}px`,
          }}
        />
      </BuildingImageWrapper>
      <Modal centered show={isOpen} onHide={handleClose}>
        <HenHouseModal onClose={handleClose} />
      </Modal>
    </>
  );
};
