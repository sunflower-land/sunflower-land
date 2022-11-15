import React, { useState } from "react";

import goblin from "assets/npcs/shovel_seller.gif";
import shadow from "assets/npcs/shadow.png";
import sandShovel from "assets/tools/sand_shovel.png";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";

export const ShovelShop: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div
      className="absolute z-10"
      style={{
        left: `${GRID_WIDTH_PX * 15}px`,
        bottom: `${GRID_WIDTH_PX * 17}px`,
        width: `${GRID_WIDTH_PX * 2}px`,
      }}
    >
      <img
        src={goblin}
        className="absolute z-20 cursor-pointer hover:img-highlight"
        id="shovel-shop"
        style={{
          width: `${PIXEL_SCALE * 19}px`,
          left: 0,
          bottom: 0,
        }}
        onClick={() => setShowModal(true)}
      />
      <img
        src={shadow}
        className="absolute z-10"
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          right: `${PIXEL_SCALE * 15}px`,
          top: `${PIXEL_SCALE * -3.5}px`,
        }}
      />
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <div className="absolute w-72 -left-8 -top-44 -z-10">
          <DynamicNFT
            bumpkinParts={{
              body: "Goblin Potion",
              hair: "Teal Mohawk",
              shirt: "Red Farmer Shirt",
              pants: "Farmer Pants",
              tool: "Farmer Pitchfork",
              background: "Farm Background",
              shoes: "Black Farmer Boots",
            }}
          />
        </div>
        <Panel>
          <p className="mb-4">Buy a shovel and dig for treasure!</p>
          <img src={sandShovel} className="w-1/4 m-auto my-2" />
        </Panel>
      </Modal>
    </div>
  );
};
