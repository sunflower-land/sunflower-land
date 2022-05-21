import React from "react";
import { Modal } from "react-bootstrap";

import shop from "assets/buildings/shop_building.png";
import plant from "assets/icons/plant.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Action } from "components/ui/Action";

import { ShopItems } from "./ShopItems";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { shopAudio } from "lib/utils/sfx";

export const Shop: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleShopClick = () => {
    setIsOpen(true);
    //Checks if shopAudio is playing, if false, plays the sound
    if (!shopAudio.playing()) {
      shopAudio.play();
    }
  };

  return (
    <div
      id={Section.Shop}
      className="absolute cursor-pointer hover:img-highlight"
      style={{
        width: `${GRID_WIDTH_PX * 3}px`,
        left: `${GRID_WIDTH_PX * 3}px`,
        top: `${GRID_WIDTH_PX * 5}px`,
      }}
    >
      <img src={shop} alt="shop" onClick={handleShopClick} className="w-full" />
      <Action
        className="absolute top-5 left-4"
        text="Shop"
        icon={plant}
        onClick={handleShopClick}
      />
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <ShopItems onClose={() => setIsOpen(false)} />
      </Modal>
    </div>
  );
};
