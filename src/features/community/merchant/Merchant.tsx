import React from "react";

import merchant from "assets/npcs/merchant.png";
import icon from "assets/brand/icon.png";

import { MerchantModal } from "./MerchantModal";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { merchantAudio } from "lib/utils/sfx";

export const Merchant: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openMerchant = () => {
    setIsOpen(true);
    //Checks if merchantAudio is playing, if false, plays the sound
    if (!merchantAudio.playing()) {
      merchantAudio.play();
    }
  };

  return (
    <div
      className="relative"
      // TODO some sort of coordinate system
      style={{
        width: `${GRID_WIDTH_PX * 3}px`,
        right: `${GRID_WIDTH_PX * 2}px`,
        top: `${GRID_WIDTH_PX * -2}px`,
      }}
    >
      <div className="cursor-pointer hover:img-highlight">
        <img
          src={merchant}
          alt="merchant"
          onClick={openMerchant}
          className="w-full"
        />
        {
          <Action
            className="absolute -bottom-[36px] -left-[5px]"
            text="Merchant"
            icon={icon}
            onClick={openMerchant}
          />
        }
      </div>

      {isOpen && (
        <MerchantModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
};
