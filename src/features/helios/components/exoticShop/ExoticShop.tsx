import React from "react";
import { Modal } from "components/ui/Modal";

import { PIXEL_SCALE } from "features/game/lib/constants";

import { SUNNYSIDE } from "assets/sunnyside";
import shadow from "assets/npcs/shadow.png";

import { ExoticShopItems } from "./component/ExoticShopItems";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";

export const ExoticShop: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <MapPlacement x={2} y={-5} height={3} width={5}>
        <div
          className="relative w-full h-full cursor-pointer hover:img-highlight"
          onClick={handleClick}
        >
          <img
            src={SUNNYSIDE.building.farmersMarket}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 80}px`,
              bottom: `${PIXEL_SCALE * 6}px`,
            }}
          />
          <img
            src={shadow}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 15}px`,
              right: `${PIXEL_SCALE * 16}px`,
              bottom: `${PIXEL_SCALE * -4}px`,
            }}
          />
          <img
            src={SUNNYSIDE.npcs.exotic_girl}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 14}px`,
              right: `${PIXEL_SCALE * 16}px`,
              bottom: `${PIXEL_SCALE * -2}px`,
              transform: "scaleX(-1)",
            }}
          />
        </div>
      </MapPlacement>
      <Modal show={isOpen} onHide={() => setIsOpen(false)}>
        <ExoticShopItems onClose={() => setIsOpen(false)} />
      </Modal>
    </>
  );
};
