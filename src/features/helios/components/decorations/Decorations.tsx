import React from "react";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import building from "assets/buildings/decorations.png";
import retroGirl from "assets/npcs/retro_girl.gif";
import shadow from "assets/npcs/shadow.png";

import { Modal } from "react-bootstrap";
import { DecorationShopItems } from "./component/DecorationShopItems";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";

export const Decorations: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };
  return (
    <>
      <div
        className="z-10 absolute cursor-pointer hover:img-highlight"
        // TODO some sort of coordinate system
        style={{
          width: `${GRID_WIDTH_PX * 6}px`,
          right: `${GRID_WIDTH_PX * 17.6}px`,
          top: `${GRID_WIDTH_PX * 25.2}px`,
        }}
        onClick={handleClick}
      >
        <img
          src={retroGirl}
          className="absolute z-20"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            left: `${GRID_WIDTH_PX * -1.2}px`,
            top: `${GRID_WIDTH_PX * 1.6}px`,
          }}
        />
        <img
          src={shadow}
          className="absolute z-10"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            left: `${GRID_WIDTH_PX * -1.2}px`,
            top: `${GRID_WIDTH_PX * 2.45}px`,
          }}
        />
        <img
          src={building}
          style={{
            width: `${PIXEL_SCALE * 50}px`,
          }}
        />
      </div>
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <div className="absolute w-72 -left-8 -top-44 -z-10">
          <DynamicNFT
            bumpkinParts={{
              body: "Beige Farmer Potion",
              hair: "Red Long Hair",
              pants: "Farmer Overalls",
              shirt: "Bumpkin Art Competition Merch",
              tool: "Farmer Pitchfork",
              background: "Farm Background",
              shoes: "Black Farmer Boots",
            }}
          />
        </div>
        <DecorationShopItems onClose={() => setIsOpen(false)} />
      </Modal>
    </>
  );
};
