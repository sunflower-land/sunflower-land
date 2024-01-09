import React, { useEffect } from "react";
import { Modal } from "react-bootstrap";

import building from "assets/buildings/hen_house.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { HenHouseModal } from "./components/HenHouseModal";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";
import { barnAudio, loadAudio } from "lib/utils/sfx";

export const ChickenHouse: React.FC<BuildingProps> = ({
  isBuilt,
  onRemove,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

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
          src={building}
          className="absolute bottom-0 pointer-events-none"
          style={{
            width: `${PIXEL_SCALE * 61}px`,
            height: `${PIXEL_SCALE * 49}px`,
            left: `${PIXEL_SCALE * 1}px`,
          }}
        />
      </BuildingImageWrapper>
      <Modal centered show={isOpen} onHide={handleClose}>
        <HenHouseModal onClose={handleClose} />
      </Modal>
    </>
  );
};
