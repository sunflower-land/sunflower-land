import React, { useState } from "react";
import classNames from "classnames";

import { sealAudio } from "lib/utils/sfx";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { InnerPanel } from "components/ui/Panel";
import { Seal, SEAL_SIZE } from "../models/seal";

interface Props {
  seal: Seal;
  disableSound?: boolean;
  position: { left: number; top: number };
}

export const SealComponent: React.FC<Props> = ({
  seal,
  disableSound,
  position,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { top, left } = position;

  const playSound = () => {
    if (disableSound) {
      return;
    }

    sealAudio.play();
  };

  return (
    <div
      className="absolute"
      style={{
        width: `${GRID_WIDTH_PX * 3}px`,
        height: `${GRID_WIDTH_PX * 3}px`,
        left: `${GRID_WIDTH_PX * left}px`,
        top: `${GRID_WIDTH_PX * top}px`,
      }}
    >
      <img
        src={seal.pixel_image}
        className="hover:img-highlight cursor-pointer z-10"
        onClick={playSound}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{
          width: `${SEAL_SIZE * PIXEL_SCALE}px`,
        }}
      />
      <InnerPanel
        className={classNames(
          "absolute bottom-12 transition-opacity whitespace-nowrap z-20 pointer-events-none",
          {
            "opacity-100": showTooltip,
            "opacity-0": !showTooltip,
          }
        )}
        style={{
          left: "6.25rem",
        }}
      >
        <div className="flex flex-col text-xxs text-white text-shadow ml-2 mr-2">
          <span className="flex-1">{seal.name}</span>
          <span className="flex-1" style={{ color: seal.rarity?.color }}>
            {seal.rarity?.name}
          </span>
        </div>
      </InnerPanel>
    </div>
  );
};
