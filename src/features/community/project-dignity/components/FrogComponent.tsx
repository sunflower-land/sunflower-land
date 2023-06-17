import React, { useState } from "react";
import classNames from "classnames";

import { frogSounds } from "lib/utils/sfx";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { InnerPanel } from "components/ui/Panel";
import { Frog, FROG_SIZE } from "../models/frog";

interface Props {
  frog: Frog;
  disableSound?: boolean;
}

export const FrogComponent: React.FC<Props> = ({ frog, disableSound }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const playSound = () => {
    if (disableSound) {
      return;
    }

    const rndIndex = Math.floor(Math.random() * frogSounds.length);
    console.log(rndIndex);
    frogSounds[rndIndex].play();
  };

  return (
    <div className="relative">
      <img
        src={frog.pixel_image}
        className="hover:img-highlight cursor-pointer z-10"
        onClick={playSound}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{
          width: `${FROG_SIZE * PIXEL_SCALE}px`,
        }}
      />

      <div
        className="flex justify-center absolute w-full pointer-events-none"
        style={{
          top: `${PIXEL_SCALE * -18}px`,
        }}
      >
        <InnerPanel
          className={classNames(
            "absolute transition-opacity whitespace-nowrap z-20 pointer-events-none p-2 flex flex-col text-xxs",
            {
              "opacity-100": showTooltip,
              "opacity-0": !showTooltip,
            }
          )}
        >
          <span>{frog.name}</span>
          <span style={{ color: frog.rarity?.color }}>{frog.rarity?.name}</span>
        </InnerPanel>
      </div>
    </div>
  );
};
