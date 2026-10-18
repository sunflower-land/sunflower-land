import React, { useState } from "react";

import halfFullOilReserve from "assets/resources/oil/oil_reserve_half.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { TimerPopover } from "features/island/common/TimerPopover";
import { ITEM_DETAILS } from "features/game/types/images";

interface Props {
  timeLeft: number;
}

export const RecoveringOilReserve: React.FC<Props> = ({ timeLeft }) => {
  const [showTimeLeft, setShowTimeLeft] = useState(false);

  return (
    <div
      onMouseEnter={() => setShowTimeLeft(true)}
      onMouseLeave={() => setShowTimeLeft(false)}
    >
      <img
        src={halfFullOilReserve}
        className="opacity-50"
        style={{
          width: `${PIXEL_SCALE * 30}px`,
        }}
        alt="Full oil reserve"
      />
      <div
        className="flex justify-center absolute w-full"
        style={{
          top: `${PIXEL_SCALE * -16}px`,
        }}
      >
        <TimerPopover
          image={ITEM_DETAILS["Oil"].image}
          description="Oil Reserve"
          showPopover={showTimeLeft}
          timeLeft={timeLeft}
        />
      </div>
    </div>
  );
};
