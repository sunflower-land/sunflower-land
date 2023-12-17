import React, { useEffect } from "react";

import goblinTailor from "assets/buildings/goblin_tailor2.gif";
import clothesRack from "assets/decorations/clothes-rack.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { loadAudio, tailorAudio } from "lib/utils/sfx";
import { ItemsModal } from "features/goblins/tailor/ItemsModal";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";
import { SUNNYSIDE } from "assets/sunnyside";

export const RetreatTailor: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    loadAudio([tailorAudio]);
  }, []);

  const openTailor = () => {
    setIsOpen(true);
    //Checks if tailorAudio is playing, if false, plays the sound
    if (!tailorAudio.playing()) {
      tailorAudio.play();
    }
  };

  return (
    <MapPlacement x={-7} y={1} height={4} width={4}>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight"
        onClick={openTailor}
      >
        <img
          src={goblinTailor}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 48}px`,
            left: `${PIXEL_SCALE * 8}px`,
            bottom: `${PIXEL_SCALE * 16}px`,
          }}
        />
        <img
          src={clothesRack}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 41}px`,
            right: `${PIXEL_SCALE * -44}px`,
            bottom: `${PIXEL_SCALE * 22}px`,
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
            text="Wearables"
            icon={SUNNYSIDE.icons.player}
          />
        </div>
      </div>
      <ItemsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </MapPlacement>
  );
};
