import React from "react";

import scientist from "../assets/lab.gif";
import icon from "../assets/icons/pot.png";

import { ScientistModal } from "./ScientistModal";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { merchantAudio } from "lib/utils/sfx";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";

export const Scientist: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const openScientist = () => {
    setIsOpen(true);
    //Checks if merchantAudio is playing, if false, plays the sound
    if (!merchantAudio.playing()) {
      merchantAudio.play();
    }
  };

  return (
    <MapPlacement x={-16} y={5} height={4} width={4}>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight"
        onClick={openScientist}
      >
        <img
          src={scientist}
          alt="scientist"
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 40}px`,
            left: `${PIXEL_SCALE * 12}px`,
            bottom: `${PIXEL_SCALE * 16}px`,
          }}
        />
        <div
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            bottom: `${PIXEL_SCALE * 3}px`,
          }}
        >
          <Action
            className="pointer-events-none"
            text="Scientist"
            icon={icon}
          />
        </div>
      </div>
      {isOpen && (
        <ScientistModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </MapPlacement>
  );
};
