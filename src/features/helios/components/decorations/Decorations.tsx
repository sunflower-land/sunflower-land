import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import { SUNNYSIDE } from "assets/sunnyside";
import shadow from "assets/npcs/shadow.png";
import { Modal } from "components/ui/Modal";
import { DecorationShopItems } from "./component/DecorationShopItems";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";

export const Decorations: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <MapPlacement x={-6} y={-5} height={3} width={5}>
        <div
          className="relative w-full h-full cursor-pointer hover:img-highlight"
          onClick={handleClick}
        >
          <img
            src={shadow}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 15}px`,
              left: `${PIXEL_SCALE * 2}px`,
              bottom: `${PIXEL_SCALE * 4}px`,
            }}
          />
          <img
            src={SUNNYSIDE.npcs.exotic_girl}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 14}px`,
              left: `${PIXEL_SCALE * 2}px`,
              bottom: `${PIXEL_SCALE * 6}px`,
            }}
          />
          <img
            src={SUNNYSIDE.building.decorationsBuilding}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 50}px`,
              right: `${PIXEL_SCALE * 8}px`,
              bottom: `${PIXEL_SCALE * 6}px`,
            }}
          />
        </div>
      </MapPlacement>
      <Modal show={isOpen} onHide={() => setIsOpen(false)}>
        <DecorationShopItems onClose={() => setIsOpen(false)} />
      </Modal>
    </>
  );
};
