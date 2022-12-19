import React from "react";
import blacksmith from "assets/buildings/goblin_blacksmith.gif";
import icon from "assets/icons/hammer.png";

import { Action } from "components/ui/Action";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { blacksmithAudio } from "lib/utils/sfx";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { Modal } from "react-bootstrap";
import { Panel } from "components/ui/Panel";

export const RetreatBlacksmith: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openBlacksmith = () => {
    setIsOpen(true);
    //Checks if blacksmithAudio is playing, if false, plays the sound
    if (!blacksmithAudio.playing()) {
      blacksmithAudio.play();
    }
  };

  return (
    <MapPlacement x={3} y={-2} height={5} width={8}>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight"
        onClick={openBlacksmith}
      >
        <img
          src={blacksmith}
          alt="market"
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 121}px`,
            right: `${PIXEL_SCALE * 1}px`,
            bottom: `${PIXEL_SCALE * 6}px`,
          }}
        />
        <div
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            bottom: `${PIXEL_SCALE * 3}px`,
          }}
        >
          <Action className="pointer-events-none" text="Craft" icon={icon} />
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <Panel>Coming soon</Panel>
      </Modal>
    </MapPlacement>
  );
};
