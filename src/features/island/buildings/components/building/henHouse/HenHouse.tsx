import React, { SyntheticEvent } from "react";

import building from "assets/buildings/hen_house.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { HenHouseModal } from "./components/HenHouseModal";
import { ClickableBuildingImage } from "../ClickableBuildingImage";

export const ChickenHouse: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <ClickableBuildingImage
      className="relative"
      style={{
        width: `${PIXEL_SCALE * 61}px`,
        height: `${PIXEL_SCALE * 49}px`,
      }}
      onClick={handleClick}
    >
      <img
        src={building}
        style={{
          width: `${PIXEL_SCALE * 61}px`,
          left: `${PIXEL_SCALE * 1}px`,
          bottom: `${PIXEL_SCALE * 2}px`,
        }}
        id="chicken-house"
        className="cursor-pointer hover:img-highlight absolute"
      />
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <HenHouseModal onClose={() => setIsOpen(false)} />
      </Modal>
    </ClickableBuildingImage>
  );
};
