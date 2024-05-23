import React from "react";

import { Modal } from "components/ui/Modal";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";

import building from "assets/buildings/blacksmith_building.gif";

import { HeliosBlacksmithItems } from "./component/HeliosBlacksmithItems";
import { SUNNYSIDE } from "assets/sunnyside";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { OuterPanel } from "components/ui/Panel";

export const HeliosBlacksmith: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <>
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
      </MapPlacement>
      <Modal show={isOpen} onHide={() => setIsOpen(false)}>
        <CloseButtonPanel
          bumpkinParts={{
            body: "Beige Farmer Potion",
            hair: "Blacksmith Hair",
            pants: "Brown Suspenders",
            shirt: "Red Farmer Shirt",
            tool: "Hammer",
            background: "Farm Background",
            shoes: "Black Farmer Boots",
          }}
          tabs={[{ icon: SUNNYSIDE.icons.hammer, name: "Craft" }]}
          onClose={() => setIsOpen(false)}
          container={OuterPanel}
        >
          <HeliosBlacksmithItems />
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
