import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import building from "assets/buildings/fertilisers.png";
import potionMaster from "assets/npcs/potion_master.gif";
import shadow from "assets/npcs/shadow.png";
import close from "assets/icons/close.png";

import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";

export const Potions: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <MapPlacement x={3} y={-9} height={3} width={4}>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight"
        onClick={handleClick}
      >
        <img
          src={building}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 55}px`,
            left: `${PIXEL_SCALE * 4}px`,
            bottom: `${PIXEL_SCALE * 6}px`,
          }}
        />
        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            left: `${PIXEL_SCALE * 19}px`,
            bottom: `${PIXEL_SCALE * 25}px`,
          }}
        />
        <img
          src={potionMaster}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            left: `${PIXEL_SCALE * 19}px`,
            bottom: `${PIXEL_SCALE * 27}px`,
          }}
        />
      </div>
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <Panel
          bumpkinParts={{
            body: "Beige Farmer Potion",
            hair: "Sun Spots",
            pants: "Farmer Overalls",
            shirt: "Red Farmer Shirt",
            tool: "Farmer Pitchfork",
            background: "Farm Background",
            shoes: "Black Farmer Boots",
          }}
        >
          <img
            src={close}
            className="absolute cursor-pointer z-20"
            onClick={() => setIsOpen(false)}
            style={{
              top: `${PIXEL_SCALE * 6}px`,
              right: `${PIXEL_SCALE * 6}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
          <div className="p-1">
            <p className="mb-4">I am the potion master!</p>
            <p className="mb-2">Give me some time to set up shop.</p>
          </div>
        </Panel>
      </Modal>
    </MapPlacement>
  );
};
