import React from "react";

import { InnerPanel } from "components/ui/Panel";
import classNames from "classnames";
import { secondsToString } from "lib/utils/time";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  showPopover: boolean;
  image: string;
  name: string;
  timeLeft: number;
  position?: {
    top: number;
    left: number;
  };
}

export const TimerPopover: React.FC<Props> = ({
  showPopover,
  image,
  name,
  timeLeft,
  position = { top: -16, left: 16 },
}) => {
  return (
    <InnerPanel
      className={classNames(
        "transition-opacity absolute whitespace-nowrap sm:opacity-0 w-fit z-50 pointer-events-none",
        {
          "opacity-100": showPopover,
          "opacity-0": !showPopover,
        }
      )}
      style={{
        top: `${PIXEL_SCALE * position.top}px`,
        left: `${PIXEL_SCALE * position.left}px`,
      }}
    >
      <div className="flex flex-col text-xxs text-white text-shadow mx-2">
        <div className="flex flex-1 items-center justify-center">
          <img src={image} className="w-4 mr-1" />
          <span>{name}</span>
        </div>
        <span className="flex-1 text-center">
          {secondsToString(timeLeft, { length: "medium" })}
        </span>
      </div>
    </InnerPanel>
  );
};
