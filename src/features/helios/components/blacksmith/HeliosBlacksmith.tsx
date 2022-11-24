import React from "react";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import building from "assets/buildings/blacksmith_building.gif";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";

export const HeliosBlacksmith: React.FC = () => {
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
          right: `${GRID_WIDTH_PX * 20.7}px`,
          top: `${GRID_WIDTH_PX * 20.4}px`,
        }}
        onClick={handleClick}
      >
        <img
          src={building}
          style={{
            width: `${PIXEL_SCALE * 98}px`,
          }}
        />
      </div>
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <Panel
          bumpkinParts={{
            body: "Beige Farmer Potion",
            hair: "Blacksmith Hair",
            pants: "Brown Suspenders",
            shirt: "Red Farmer Shirt",
            tool: "Hammer",
            background: "Farm Background",
            shoes: "Black Farmer Boots",
          }}
        >
          <div className="p-1">
            <p className="mb-4 ml-1">Coming soon...</p>
          </div>
        </Panel>
      </Modal>
    </>
  );
};
