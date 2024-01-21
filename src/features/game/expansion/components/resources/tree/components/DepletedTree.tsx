import React, { useState } from "react";
import stump from "assets/resources/tree/stump.png";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { TimeLeftPanel } from "components/ui/TimeLeftPanel";
import { translate } from "lib/i18n/translate";

interface Props {
  timeLeft: number;
}

const DepletedTreeComponent: React.FC<Props> = ({ timeLeft }) => {
  const [showTimeLeft, setShowTimeLeft] = useState(false);

  return (
    <div
      className="absolute w-full h-full"
      onMouseEnter={() => setShowTimeLeft(true)}
      onMouseLeave={() => setShowTimeLeft(false)}
    >
      <div className="absolute w-full h-full pointer-events-none">
        <img
          src={stump}
          className="absolute opacity-50"
          style={{
            width: `${GRID_WIDTH_PX}px`,
            bottom: `${PIXEL_SCALE * 5}px`,
            left: `${PIXEL_SCALE * 8}px`,
          }}
        />
        <div
          className="flex justify-center absolute w-full"
          style={{
            top: `${PIXEL_SCALE * -10}px`,
          }}
        >
          <TimeLeftPanel
            text={translate("resources.recoversIn")}
            timeLeft={timeLeft}
            showTimeLeft={showTimeLeft}
          />
        </div>
      </div>
    </div>
  );
};

export const DepletedTree = React.memo(DepletedTreeComponent);
