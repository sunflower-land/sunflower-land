import React from "react";

import icon from "assets/icons/heart.png";
import resale from "assets/buildings/resale.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";

export const Resale: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openResale = () => {
    setIsOpen(true);
  };

  return (
    <MapPlacement x={1} y={-7} height={5} width={4}>
      <div
        className="relative w-full h-full" //cursor-pointer hover:img-highlight"
        onClick={openResale}
      >
        <img
          src={resale}
          alt="Resale"
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 53}px`,
            left: `${PIXEL_SCALE * 5}px`,
            bottom: `${PIXEL_SCALE * 11}px`,
          }}
        />
        <div
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            bottom: `${PIXEL_SCALE * 3}px`,
          }}
        >
          <Action
            className="pointer-events-none"
            text="Auctioneer"
            icon={icon}
          />
        </div>
      </div>
    </MapPlacement>
  );
};
