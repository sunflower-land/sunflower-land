import React from "react";

import wishingWell from "assets/buildings/wishing_well.png";
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
        width: `${GRID_WIDTH_PX * 2.1}px`,
        right: `${GRID_WIDTH_PX * 12.1}px`,
        top: `${GRID_WIDTH_PX * 8.8}px`,
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
            className="absolute -bottom-[36px] -left-[5px]"
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
