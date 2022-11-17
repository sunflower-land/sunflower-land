import React, { SyntheticEvent } from "react";

import market from "assets/buildings/market.png";
import betty from "assets/npcs/betty.gif";
import shadow from "assets/npcs/shadow.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { ShopItems } from "./ShopItems";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import { ClickableBuildingImage } from "../ClickableBuildingImage";

export const Market: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = (e: SyntheticEvent) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      <ClickableBuildingImage
        className="relative"
        style={{
          width: `${PIXEL_SCALE * 48}px`,
          height: `${PIXEL_SCALE * 38}px`,
        }}
        onClick={handleClick}
      >
        <div
          id="market-parent"
          className="absolute bottom-4"
          style={{
            width: `${PIXEL_SCALE * 48}px`,
          }}
        >
          <img
            src={market}
            style={{
              width: `${PIXEL_SCALE * 48}px`,
              height: `${PIXEL_SCALE * 38}px`,
            }}
            className="cursor-pointer hover:img-highlight"
          />
          <img
            src={betty}
            className="absolute pointer-events-none z-20"
            style={{
              width: `${PIXEL_SCALE * 16}px`,
              bottom: `${PIXEL_SCALE * 8}px`,
              right: `${PIXEL_SCALE * 4}px`,
              transform: "scaleX(-1)",
            }}
          />
          <img
            src={shadow}
            className="absolute z-10 pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * 15}px`,
              bottom: `${PIXEL_SCALE * 6}px`,
              right: `${PIXEL_SCALE * 6}px`,
            }}
          />
        </div>
      </ClickableBuildingImage>
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <div className="absolute w-72 -left-8 -top-44 -z-10">
          <DynamicNFT
            bumpkinParts={{
              body: "Beige Farmer Potion",
              hair: "Rancher Hair",
              pants: "Farmer Overalls",
              shirt: "Red Farmer Shirt",
              tool: "Parsnip",
              background: "Farm Background",
              shoes: "Black Farmer Boots",
            }}
          />
        </div>
        <ShopItems onClose={() => setIsOpen(false)} />
      </Modal>
    </>
  );
};
