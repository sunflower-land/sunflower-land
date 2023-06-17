import React, { useState } from "react";
import classNames from "classnames";

import { sealAudio } from "lib/utils/sfx";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { InnerPanel } from "components/ui/Panel";
import { Seal, SEAL_SIZE } from "../models/seal";
import { MapPlacement } from "features/game/expansion/components/MapPlacement";

interface Props {
  seal: Seal;
  disableSound?: boolean;
  position: { x: number; y: number };
}

export const SealComponent: React.FC<Props> = ({
  seal,
  disableSound,
  position,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const playSound = () => {
    if (disableSound) {
      return;
    }

    sealAudio.play();
  };

  return (
    <MapPlacement width={2} height={2} x={position.x} y={position.y}>
      <div
        className="absolute cursor-pointer z-10 hover:img-highlight"
        onClick={playSound}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{
          width: `${GRID_WIDTH_PX * 2}px`,
          height: `${GRID_WIDTH_PX * 2}px`,
        }}
      >
        <div
          className="absolute pointer-events-none"
          onClick={playSound}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          style={{
            width: `${PIXEL_SCALE * SEAL_SIZE}px`,
            height: `${PIXEL_SCALE * SEAL_SIZE}px`,
            left: `${GRID_WIDTH_PX * -1}px`,
            top: `${GRID_WIDTH_PX * -1}px`,
          }}
        >
          <img
            src={seal.pixel_image}
            className="pointer-events-none"
            style={{
              width: `${PIXEL_SCALE * SEAL_SIZE}px`,
            }}
          />
        </div>
      </div>

      <div
        className="flex justify-center absolute w-full pointer-events-none"
        style={{
          top: `${PIXEL_SCALE * -24}px`,
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
          <span>{seal.name}</span>
          <span style={{ color: seal.rarity?.color }}>{seal.rarity?.name}</span>
        </InnerPanel>
      </div>
    </MapPlacement>
  );
};
