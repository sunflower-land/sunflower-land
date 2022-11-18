import React from "react";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import building from "assets/buildings/fertilisers.png";
import potionMaster from "assets/npcs/potion_master.gif";
import shadow from "assets/npcs/shadow.png";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";

export const Potions: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div
        className="absolute cursor-pointer hover:img-highlight"
        // TODO some sort of coordinate system
        style={{
          width: `${GRID_WIDTH_PX * 6}px`,
          right: `${GRID_WIDTH_PX * 10}px`,
          top: `${GRID_WIDTH_PX * 29.1}px`,
        }}
        onClick={handleClick}
      >
        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            left: `${PIXEL_SCALE * 17.2}px`,
            top: `${PIXEL_SCALE * 15.6}px`,
          }}
        />
        <img
          src={potionMaster}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            left: `${PIXEL_SCALE * 17.2}px`,
            top: `${PIXEL_SCALE * 3.6}px`,
          }}
        />
        <img
          src={building}
          style={{
            width: `${PIXEL_SCALE * 55}px`,
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
          <div className="p-1">
            <p className="mb-4">I am the potion master!</p>
            <p>Give me some time to set up shop.</p>
          </div>
        </Panel>
      </Modal>
    </>
  );
};
