import React, { useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { TimerPopover } from "features/island/common/TimerPopover";
import { ITEM_DETAILS } from "features/game/types/images";
import type { IronRockName } from "features/game/types/resources";
import { READONLY_RESOURCE_COMPONENTS } from "features/island/resources/Resource";
import type { GameState, TemperateSeasonName } from "features/game/types/game";

interface Props {
  season: TemperateSeasonName;
  island: GameState["island"];
  timeLeft: number;
  name: IronRockName;
}

const DepletedIronComponent: React.FC<Props> = ({
  season,
  island,
  timeLeft,
  name,
}) => {
  const [showTimeLeft, setShowTimeLeft] = useState(false);
  const Image = READONLY_RESOURCE_COMPONENTS({
    season,
    island,
  })[name];

  return (
    <div
      className="absolute w-full h-full"
      onMouseEnter={() => setShowTimeLeft(true)}
      onMouseLeave={() => setShowTimeLeft(false)}
    >
      <div className="absolute w-full h-full pointer-events-none">
        <div className="opacity-50">
          <Image />
        </div>
        <div
          className="flex justify-center absolute w-full"
          style={{
            top: `${PIXEL_SCALE * -20}px`,
          }}
        >
          <TimerPopover
            image={ITEM_DETAILS["Iron"].image}
            description={name}
            showPopover={showTimeLeft}
            timeLeft={timeLeft}
          />
        </div>
      </div>
    </div>
  );
};

export const DepletedIron = React.memo(DepletedIronComponent);
