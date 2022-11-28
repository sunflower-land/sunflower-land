import React from "react";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

import building from "assets/buildings/blacksmith_building.gif";
import close from "assets/icons/close.png";
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
          <div className="px-1 py-2">
            <p className="mb-4">Please be patient son...</p>
            <p>Hopefully my back don&apos;t really hurt this much anymore.</p>
          </div>
        </Panel>
      </Modal>
    </>
  );
};
