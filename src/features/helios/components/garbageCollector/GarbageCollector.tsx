import React from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import building from "assets/buildings/garbage.png";
import stall from "assets/buildings/garbage_stall.png";
import shadow from "assets/npcs/shadow.png";

import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { SUNNYSIDE } from "assets/sunnyside";
import { NPC } from "features/island/bumpkin/components/DynamicMiniNFT";

export const GarbageCollector: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <MapPlacement x={-6} y={-9} height={3} width={4}>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight"
        onClick={handleClick}
      >
        <img
          src={building}
          className="absolute "
          style={{
            width: `${PIXEL_SCALE * 62}px`,
            left: `${PIXEL_SCALE * 9}px`,
            bottom: `${PIXEL_SCALE * 20}px`,
          }}
        />
        <img
          src={stall}
          className="absolute z-20"
          style={{
            width: `${PIXEL_SCALE * 36}px`,
            left: `${PIXEL_SCALE * 22}px`,
            bottom: `${PIXEL_SCALE * 6}px`,
          }}
        />
        <img
          src={shadow}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            left: `${PIXEL_SCALE * 32}px`,
            bottom: `${PIXEL_SCALE * 12}px`,
          }}
        />
        <div
          className="absolute z-10"
          style={{
            width: `${PIXEL_SCALE * 14}px`,
            left: `${PIXEL_SCALE * 32}px`,
            bottom: `${PIXEL_SCALE * 17}px`,
          }}
        >
          <NPC body="Goblin Potion" hair="Teal Mohawk" shirt="Fire Shirt" />
        </div>
      </div>
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <Panel
          bumpkinParts={{
            body: "Goblin Potion",
            hair: "Teal Mohawk",
            pants: "Farmer Pants",
            shirt: "Fire Shirt",
            tool: "Bumpkin Puppet",
          }}
        >
          <img
            src={SUNNYSIDE.icons.close}
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
