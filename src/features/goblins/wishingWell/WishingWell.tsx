import React, { useContext } from "react";

import wishingWell from "assets/buildings/wishing_well.png";
import icon from "assets/brand/icon.png";

import { WishingWellModal } from "./WishingWellModal";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Action } from "components/ui/Action";
import { wishingWellAudio } from "lib/utils/sfx";
import { Context } from "features/game/GoblinProvider";
import { useActor } from "@xstate/react";

export const WishingWell: React.FC = () => {
  const { goblinService } = useContext(Context);
  const [_, send] = useActor(goblinService);
  const [isOpen, setIsOpen] = React.useState(false);

  const openWell = () => {
    wishingWellAudio.play();
    send("OPENING_WISHING_WELL");
    setIsOpen(true);
    //Checks if wishingWellAudio is playing, if false, plays the sound
    if (!wishingWellAudio.playing()) {
      wishingWellAudio.play();
    }
  };
  return (
    <div
      className="z-10 absolute"
      // TODO some sort of coordinate system
      style={{
        width: `${GRID_WIDTH_PX * 2.1}px`,
        right: `${GRID_WIDTH_PX * 12.15}px`,
        top: `${GRID_WIDTH_PX * 8.2}px`,
      }}
    >
      <div className="cursor-pointer hover:img-highlight">
        <img
          src={wishingWell}
          alt="market"
          onClick={openWell}
          className="w-full"
        />
        {
          <Action
            className="absolute -bottom-[36px] -left-[5px]"
            text="Wish"
            icon={icon}
            onClick={openWell}
          />
        }
      </div>

      {isOpen && (
        <WishingWellModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
};
