import React from "react";

import resources from "assets/buildings/resources.png";
import shadow from "assets/npcs/shadow.png";

import { Action } from "components/ui/Action";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Modal } from "components/ui/Modal";
import { StorageModal } from "features/goblins/storageHouse/components/StorageModal";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { SUNNYSIDE } from "assets/sunnyside";

export const RetreatStorageHouse: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openStorageHouse = () => {
    setIsOpen(true);
  };

  return (
    <MapPlacement x={4} y={7} height={5} width={5}>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight"
        onClick={openStorageHouse}
      >
        <div
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 83}px`,
            left: `${PIXEL_SCALE * -2}px`,
            bottom: `${PIXEL_SCALE * 14}px`,
          }}
        >
          <img
            src={resources}
            style={{
              width: `${PIXEL_SCALE * 83}px`,
            }}
            alt="storage-house"
          />
        </div>
        <img
          src={shadow}
          style={{
            width: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 20}px`,
            left: `${PIXEL_SCALE * 32}px`,
          }}
          className="absolute pointer-events-none"
        />
        <img
          src={SUNNYSIDE.npcs.goblin}
          style={{
            width: `${PIXEL_SCALE * 18}px`,
            bottom: `${PIXEL_SCALE * 22}px`,
            left: `${PIXEL_SCALE * 30}px`,
          }}
          className="absolute"
        />
        <div
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            bottom: `${PIXEL_SCALE * 3}px`,
          }}
        >
          <Action
            className="pointer-events-none"
            text="Storage"
            icon={SUNNYSIDE.resource.wood}
          />
        </div>
      </div>
      <Modal show={isOpen} onHide={() => setIsOpen(false)}>
        <StorageModal onClose={() => setIsOpen(false)} />
      </Modal>
    </MapPlacement>
  );
};
