import React, { useState } from "react";
import crimstone_1 from "assets/resources/crimstone/crimstone_rock_1.webp";
import crimstone_2 from "assets/resources/crimstone/crimstone_rock_2.webp";
import crimstone_3 from "assets/resources/crimstone/crimstone_rock_3.webp";
import crimstone_4 from "assets/resources/crimstone/crimstone_rock_4.webp";
import crimstone_5 from "assets/resources/crimstone/crimstone_rock_5.webp";
import crimstone_6 from "assets/resources/crimstone/crimstone_rock_6.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { TimerPopover } from "features/island/common/TimerPopover";
import { ITEM_DETAILS } from "features/game/types/images";
import { getCrimstoneStage } from "../getCrimstoneStage";

interface Props {
  timeLeft: number;
  minesLeft: number;
  now: number;
  readyAt: number;
}

const DepletedCrimstoneComponent: React.FC<Props> = ({
  timeLeft,
  minesLeft,
  now,
  readyAt,
}) => {
  const [showTimeLeft, setShowTimeLeft] = useState(false);

  const crimstone = [
    crimstone_1,
    crimstone_2,
    crimstone_3,
    crimstone_4,
    crimstone_5,
    crimstone_6,
  ][getCrimstoneStage(minesLeft, now, readyAt) - 1];

  return (
    <div
      className="absolute w-full h-full"
      onMouseEnter={() => setShowTimeLeft(true)}
      onMouseLeave={() => setShowTimeLeft(false)}
    >
      <div className="absolute w-full h-full pointer-events-none">
        <img
          src={crimstone}
          className="absolute opacity-50"
          style={{
            width: `${PIXEL_SCALE * 24}px`,
            bottom: `${PIXEL_SCALE * 1}px`,
            right: `${PIXEL_SCALE * 4}px`,
          }}
        />
        <div
          className="flex justify-center absolute w-full"
          style={{
            top: `${PIXEL_SCALE * -20}px`,
          }}
        >
          <TimerPopover
            image={ITEM_DETAILS["Crimstone"].image}
            description="Crimstone Rock"
            showPopover={showTimeLeft}
            timeLeft={timeLeft}
          />
        </div>
      </div>
    </div>
  );
};

export const DepletedCrimstone = React.memo(DepletedCrimstoneComponent);
