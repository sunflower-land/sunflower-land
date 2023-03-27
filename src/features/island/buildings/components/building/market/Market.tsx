import React from "react";

import market from "assets/buildings/market.png";
import shadow from "assets/npcs/shadow.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { Modal } from "react-bootstrap";
import { ShopItems } from "./ShopItems";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { MachineInterpreter } from "features/game/expansion/placeable/editingMachine";

export const Market: React.FC<BuildingProps> = ({
  isBuilt,
  onRemove,
  buildingId,
}) => {
  const { gameService } = React.useContext(Context);
  const [gameState] = useActor(gameService);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    const editing = gameService.state.children.editing as MachineInterpreter;

    if (gameState.matches("editing")) {
      if (editing.state.matches("selecting")) {
        editing.send("SELECT_TO_MOVE", {
          id: buildingId,
          placeable: "Market",
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

  return (
    <>
      <BuildingImageWrapper onClick={handleClick}>
        <img
          src={market}
          className="absolute bottom-0"
          style={{
            width: `${PIXEL_SCALE * 48}px`,
            height: `${PIXEL_SCALE * 38}px`,
          }}
        />
        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 6}px`,
            right: `${PIXEL_SCALE * 6}px`,
          }}
        />
        <img
          src={SUNNYSIDE.npcs.betty}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            bottom: `${PIXEL_SCALE * 8}px`,
            right: `${PIXEL_SCALE * 4}px`,
            transform: "scaleX(-1)",
          }}
        />
      </BuildingImageWrapper>
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <ShopItems onClose={() => setIsOpen(false)} />
      </Modal>
    </>
  );
};
