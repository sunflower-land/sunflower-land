import React from "react";

import merchant from "assets/npcs/merchant.gif";
import icon from "assets/icons/token_2.png";

import { MerchantModal } from "./MerchantModal";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { merchantAudio } from "lib/utils/sfx";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";

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
    <MapPlacement x={-3} y={2} height={3} width={3}>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight"
        id={Section.Merchant}
        onClick={openMerchant}
      >
        <div
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 49}px`,
            left: `${PIXEL_SCALE * -1}px`,
            bottom: `${PIXEL_SCALE * 14}px`,
          }}
        >
          <img
            src={merchant}
            style={{
              width: `${PIXEL_SCALE * 49}px`,
            }}
            alt="Merchant"
          />
        </div>
        <div
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            bottom: `${PIXEL_SCALE * 3}px`,
          }}
        >
          <Action className="pointer-events-none" text="Merchant" icon={icon} />
        </div>
      </div>
      {isOpen && (
        <MerchantModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </MapPlacement>
  );
};
