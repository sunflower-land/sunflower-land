import React, { useState } from "react";

import goblin from "assets/npcs/goblin_treasure.gif";
import shadow from "assets/npcs/shadow.png";
import sandDug from "assets/land/sand_dug.png";
import close from "assets/icons/close.png";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "react-bootstrap";
import { DynamicNFT } from "features/bumpkins/components/DynamicNFT";
import { Panel } from "components/ui/Panel";

export const GoblinDigging: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div
      className="absolute"
      style={{
        top: `${GRID_WIDTH_PX * 17}px`,
        right: `${GRID_WIDTH_PX * 15}px`,
        width: `${GRID_WIDTH_PX * 2}px`,
      }}
    >
      <img
        src={goblin}
        className="absolute z-20 cursor-pointer hover:img-highlight"
        style={{
          width: `${PIXEL_SCALE * 33}px`,
          left: 0,
          right: 0,
        }}
        onClick={() => setShowModal(true)}
      />
      <img
        src={shadow}
        className="absolute z-10"
        style={{
          width: `${PIXEL_SCALE * 15}px`,
          right: `${PIXEL_SCALE * 9.5}px`,
          top: `${PIXEL_SCALE * 22}px`,
        }}
      />
      <img
        src={sandDug}
        className="absolute z-0"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          right: `${PIXEL_SCALE * -3.3}px`,
          top: `${PIXEL_SCALE * 20.5}px`,
        }}
      />
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <div className="absolute w-72 -left-8 -top-44 -z-10">
          <DynamicNFT
            bumpkinParts={{
              body: "Goblin Potion",
              hair: "Sun Spots",
              pants: "Lumberjack Overalls",
              tool: "Farmer Pitchfork",
              background: "Farm Background",
              shoes: "Black Farmer Boots",
            }}
          />
        </div>
        <Panel>
          <img
            src={close}
            className="absolute cursor-pointer z-20"
            onClick={() => setShowModal(false)}
            style={{
              top: `${PIXEL_SCALE * 6}px`,
              right: `${PIXEL_SCALE * 6}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
          <div className="p-2">
            <p className="mb-4">
              My uncle found a diamond ring digging at this beach.
            </p>
            <p>All I keep finding is boring SFL coins.</p>
          </div>
        </Panel>
      </Modal>
    </div>
  );
};
