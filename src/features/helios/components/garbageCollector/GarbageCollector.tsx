import React, { useState } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";

import building from "assets/buildings/garbage.png";
import stall from "assets/buildings/garbage_stall.png";

import { Modal } from "react-bootstrap";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { NPC } from "features/island/bumpkin/components/NPC";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { GarbageCollectorModal } from "./components/GarbageCollectorModal";
import { ITEM_DETAILS } from "features/game/types/images";
import { GarbageDiscard } from "./components/GarbageDiscard";

export const GarbageCollector: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [currentTab, setCurrentTab] = useState<number>(0);

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <MapPlacement x={-6} y={-9} height={3} width={4}>
        <div
          className="relative w-full h-full cursor-pointer hover:img-highlight"
          onClick={handleClick}
        >
          <img
            src={building}
            className="absolute"
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

          <div
            className="absolute z-10"
            style={{
              width: `${PIXEL_SCALE * 14}px`,
              left: `${PIXEL_SCALE * 32}px`,
              bottom: `${PIXEL_SCALE * 41}px`,
            }}
          >
            <NPC
              parts={{
                body: "Goblin Potion",
                hair: "Teal Mohawk",
                shirt: "Fire Shirt",
              }}
            />
          </div>
        </div>
      </MapPlacement>
      <Modal centered show={isOpen} onHide={() => setIsOpen(false)}>
        <CloseButtonPanel
          onClose={() => setIsOpen(false)}
          bumpkinParts={{
            body: "Goblin Potion",
            hair: "Teal Mohawk",
            pants: "Farmer Pants",
            shirt: "Fire Shirt",
            tool: "Bumpkin Puppet",
          }}
          tabs={[
            {
              icon: ITEM_DETAILS["Solar Flare Ticket"].image,
              name: "Sell",
            },
            {
              icon: ITEM_DETAILS["Sunflower Seed"].image,
              name: "Discard",
            },
          ]}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        >
          {currentTab === 0 && <GarbageCollectorModal />}
          {currentTab === 1 && <GarbageDiscard />}
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
