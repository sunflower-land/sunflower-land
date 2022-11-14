import React from "react";

import merchant from "assets/npcs/merchant.gif";
import icon from "assets/brand/icon.png";

import { MerchantModal } from "./MerchantModal";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { merchantAudio } from "lib/utils/sfx";
import { Section } from "lib/utils/hooks/useScrollIntoView";

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
      id={Section.Merchant}
      style={{
        width: `${GRID_WIDTH_PX * 3.5}px`,
        height: `${GRID_WIDTH_PX * 3.5}px`,
        left: `${GRID_WIDTH_PX * 27}px`,
        top: `${GRID_WIDTH_PX * 28}px`,
      }}
    >
      <div className="cursor-pointer hover:img-highlight relative">
        <img
          src={merchant}
          alt="merchant"
          onClick={openMerchant}
          className="w-full"
        />
        <Action
          className="absolute -bottom-[30px] -left-[5px]"
          text="Merchant"
          icon={icon}
          onClick={openMerchant}
        />
      </div>

      {isOpen && (
        <MerchantModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
};
