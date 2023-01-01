import React from "react";
import { Modal } from "react-bootstrap";

import building from "assets/buildings/hen_house.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { HenHouseModal } from "./components/HenHouseModal";
import { BuildingImageWrapper } from "../BuildingImageWrapper";
import { BuildingProps } from "../Building";

export const ChickenHouse: React.FC<BuildingProps> = ({
  isBuilt,
  onRemove,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
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
