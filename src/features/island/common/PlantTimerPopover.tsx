import React from "react";

import { InnerPanel } from "components/ui/Panel";
import classNames from "classnames";
import { secondsToString } from "lib/utils/time";

interface Props {
  showPopover: boolean;
  image: string;
  name: string;
  timeLeft: number;
}

export const PlantTimerPopover: React.FC<Props> = ({
  showPopover,
  image,
  name,
  timeLeft,
}) => {
  return (
    <InnerPanel
      className={classNames(
        "ml-10 transition-opacity absolute whitespace-nowrap sm:opacity-0 bottom-12 w-fit left-7 z-50 pointer-events-none",
        {
          "opacity-100": showPopover,
          "opacity-0": !showPopover,
        }
      )}
    >
      <div className="flex flex-col text-xxs text-white text-shadow mx-2">
        <div className="flex flex-1 items-center justify-center">
          <img src={image} className="w-4 mr-1" />
          <span>{name}</span>
        </div>
        <span className="flex-1">
          {secondsToString(timeLeft, { length: "medium" })}
        </span>
      </div>
    </InnerPanel>
  );
};
