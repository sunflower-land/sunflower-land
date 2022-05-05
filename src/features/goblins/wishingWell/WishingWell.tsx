import React from "react";
<<<<<<< HEAD

import wishingWell from "assets/buildings/goblin_wishing_well.png";
=======
import { Modal } from "react-bootstrap";

import wishingWell from "assets/buildings/wishing_well.png";
>>>>>>> 84f9a4b (Wishing well upgrades)
import icon from "assets/brand/icon.png";

import { WishingWellModal } from "./WishingWellModal";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { wishingWellAudio } from "lib/utils/sfx";

export const WishingWell: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openWell = () => {
    wishingWellAudio.play();
    setIsOpen(true);
  };
  return (
    <div
      className="absolute"
      // TODO some sort of coordinate system
      style={{
<<<<<<< HEAD
        width: `${GRID_WIDTH_PX * 2.1}px`,
        right: `${GRID_WIDTH_PX * 12.1}px`,
        top: `${GRID_WIDTH_PX * 8.8}px`,
=======
        width: `${GRID_WIDTH_PX * 2}px`,
        right: `${GRID_WIDTH_PX * 12.2}px`,
        top: `${GRID_WIDTH_PX * -1}px`,
>>>>>>> 84f9a4b (Wishing well upgrades)
      }}
    >
      <div className="cursor-pointer hover:img-highlight">
        <img
          src={wishingWell}
          alt="market"
          onClick={openWell}
          className="w-full"
        />
        {
          <Action
<<<<<<< HEAD
            className="absolute -bottom-[36px] -left-[5px]"
=======
            className="absolute -bottom-6 -left-2"
>>>>>>> 84f9a4b (Wishing well upgrades)
            text="Wish"
            icon={icon}
            onClick={openWell}
          />
        }
      </div>

      {isOpen && (
        <WishingWellModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
};
