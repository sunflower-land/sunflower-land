import React, { useContext, useEffect, useState } from "react";
import { Modal } from "components/ui/Modal";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { HenHouseModal } from "./components/HenHouseModal";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { barnAudio, loadAudio } from "lib/utils/sfx";
import { HEN_HOUSE_VARIANTS } from "features/island/lib/alternateArt";
import { hasFeatureAccess } from "lib/flags";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { GameState } from "features/game/types/game";
import { useSelector } from "@xstate/react";
import { useNavigate } from "react-router-dom";

const _betaInventory = (state: MachineState) => {
  const pass = state.context.state.inventory["Beta Pass"];

  return { inventory: { "Beta Pass": pass } } as GameState;
};

export const ChickenHouse: React.FC<BuildingProps> = ({
  isBuilt,
  onRemove,
  island,
}) => {
  const { gameService } = useContext(Context);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const betaInventory = useSelector(gameService, _betaInventory);

  useEffect(() => {
    loadAudio([barnAudio]);
  }, []);

  const handleClick = () => {
    if (onRemove) {
      onRemove();
      return;
    }

    if (isBuilt) {
      // Add future on click actions here
      barnAudio.play();

      if (hasFeatureAccess(betaInventory, "ANIMAL_BUILDINGS")) {
        navigate("/hen-house");
        return;
      }

      setIsOpen(true);
      return;
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <BuildingImageWrapper name="Hen House" onClick={handleClick}>
        <img
          src={HEN_HOUSE_VARIANTS[island]}
          className="absolute bottom-0 pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 61}px`,
            left: `${PIXEL_SCALE * 1}px`,
          }}
        />
      </BuildingImageWrapper>
      <Modal show={isOpen} onHide={handleClose}>
        <HenHouseModal onClose={handleClose} />
      </Modal>
    </>
  );
};
