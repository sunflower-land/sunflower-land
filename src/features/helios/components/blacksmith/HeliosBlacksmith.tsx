import React from "react";

import { Modal } from "react-bootstrap";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";

import building from "assets/buildings/blacksmith_building.gif";
import close from "assets/icons/close.png";
import hammer from "assets/icons/hammer.png";

import { Panel } from "components/ui/Panel";
import { Tab } from "components/ui/Tab";
import { HeliosBlacksmithItems } from "./component/HeliosBlacksmithItems";
import { Inventory } from "features/game/types/game";

type Props = {
  inventory: Inventory;
};

export const HeliosBlacksmith: React.FC<Props> = ({ inventory }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  const Content = () => {
    return (
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
        className="relative"
        hasTabs
      >
        <div
          className="absolute flex"
          style={{
            top: `${PIXEL_SCALE * 1}px`,
            left: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 1}px`,
          }}
        >
          <Tab isActive>
            <img src={hammer} className="h-5 mr-2" />
            <span className="text-sm">Craft</span>
          </Tab>
          <img
            src={close}
            className="absolute cursor-pointer z-20"
            onClick={() => setIsOpen(false)}
            style={{
              top: `${PIXEL_SCALE * 1}px`,
              right: `${PIXEL_SCALE * 1}px`,
              width: `${PIXEL_SCALE * 11}px`,
            }}
          />
        </div>
        <HeliosBlacksmithItems onClose={() => setIsOpen(false)} />
      </Panel>
    );
  };

  return (
    <MapPlacement x={-8} y={0} height={4} width={6}>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight"
        onClick={handleClick}
      >
        <div
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 98}px`,
            bottom: `${PIXEL_SCALE * 6}px`,
            left: `${PIXEL_SCALE * -1}px`,
          }}
        >
          <img
            src={building}
            style={{
              width: `${PIXEL_SCALE * 98}px`,
            }}
          />
        </div>
      </div>
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <Content />
      </Modal>
    </MapPlacement>
  );
};
