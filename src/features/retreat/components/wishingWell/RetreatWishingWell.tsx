import React, { useContext, useEffect } from "react";

import wishingWell from "assets/buildings/wishing_well.png";
import icon from "assets/icons/sfl.webp";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { loadAudio, wishingWellAudio } from "lib/utils/sfx";
import { Context } from "features/game/GoblinProvider";
import { useActor } from "@xstate/react";
import { WishingWellModal } from "features/goblins/wishingWell/WishingWellModal";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";

export const RetreatWishingWell: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [goblinState, send] = useActor(goblinService);

  useEffect(() => {
    loadAudio([wishingWellAudio]);
  }, []);

  const openWell = () => {
    wishingWellAudio.play();
    send("OPENING_WISHING_WELL");
    //Checks if wishingWellAudio is playing, if false, plays the sound
    if (!wishingWellAudio.playing()) {
      wishingWellAudio.play();
    }
  };

  return (
    <MapPlacement x={5} y={14} height={4} width={4}>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight"
        onClick={openWell}
      >
        <img
          src={wishingWell}
          alt="Wishing Well"
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 34}px`,
            left: `${PIXEL_SCALE * 15}px`,
            bottom: `${PIXEL_SCALE * 14}px`,
          }}
        />
        <div
          className="flex justify-center absolute w-full pointer-events-none"
          style={{
            bottom: `${PIXEL_SCALE * 3}px`,
          }}
        >
          <Action className="pointer-events-none" text="Wish" icon={icon} />
        </div>
      </div>

      {goblinState.matches("wishing") && <WishingWellModal />}
    </MapPlacement>
  );
};
