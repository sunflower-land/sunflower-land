import React from "react";

import icon from "assets/icons/heart.png";
import resale from "assets/buildings/resale.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

export const Resale: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openResale = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Modal show={isOpen} onHide={() => setIsOpen(true)} centered>
        <Panel>
          <div className="p-2">
            <p className="mb-3">Looking for rare items?</p>
            <p className="text-sm mb-3">
              Players can trade special items they crafted in-game.
            </p>
            <p className="text-sm mb-3">
              You can purchase these on secondary marketplaces like Open Sea.
            </p>

            <Button
              onClick={() => {
                window.location.href =
                  "https://opensea.io/collection/sunflower-land-collectibles";
              }}
            >
              View items on Open Sea
            </Button>
          </div>
        </Panel>
      </Modal>
      <MapPlacement x={1} y={-7} height={5} width={4}>
        <div
          className="relative w-full h-full cursor-pointer hover:img-highlight"
          onClick={openResale}
        >
          <img
            src={resale}
            alt="Resale"
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 53}px`,
              left: `${PIXEL_SCALE * 5}px`,
              bottom: `${PIXEL_SCALE * 11}px`,
            }}
          />
          <div
            className="flex justify-center absolute w-full pointer-events-none"
            style={{
              bottom: `${PIXEL_SCALE * 3}px`,
            }}
          >
            <Action className="pointer-events-none" text="Resale" icon={icon} />
          </div>
        </div>
      </MapPlacement>
    </>
  );
};
