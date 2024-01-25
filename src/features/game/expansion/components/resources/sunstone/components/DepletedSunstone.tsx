import React, { useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import { ITEM_DETAILS } from "features/game/types/images";

interface Props {
  timeLeft: number;
}

const DepletedSunstoneComponent: React.FC<Props> = ({ timeLeft }) => {
  const [showTimeLeft, setShowTimeLeft] = useState(false);

  return (
    <div
      className="absolute w-full h-full"
      onMouseEnter={() => setShowTimeLeft(true)}
      onMouseLeave={() => setShowTimeLeft(false)}
    >
      <div className="absolute w-full h-full pointer-events-none">
        <img
          src={ITEM_DETAILS["Sunstone Rock"].image}
          className="absolute opacity-50"
          style={{
            width: `${PIXEL_SCALE * 18}px`,
            bottom: `${PIXEL_SCALE * 7}px`,
            left: `${PIXEL_SCALE * 7}px`,
          }}
        />
        <div
          className="flex justify-center absolute w-full"
          style={{
            top: `${PIXEL_SCALE * -20}px`,
          }}
        >
          <TimeLeftPanel
            text="Recovers in:"
            timeLeft={timeLeft}
            showTimeLeft={showTimeLeft}
          />
        </div>
      </div>
    </div>
  );
};

export const DepletedSunstone = React.memo(DepletedSunstoneComponent);
