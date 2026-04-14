import React from "react";

import { InnerPanel } from "components/ui/Panel";
import classNames from "classnames";
import { secondsToString } from "lib/utils/time";

interface Props {
  showPopover: boolean;
  image: string;
  description: string;
  timeLeft: number;
  secondaryImage?: string | undefined;
  secondaryDescription?: string;
}

export const TimerPopover: React.FC<Props> = ({
  showPopover,
  image,
  description,
  timeLeft,
  secondaryImage,
  secondaryDescription,
}) => {
  const hasSecondRow = secondaryImage != null || secondaryDescription != null;

  return (
    <InnerPanel
      className={classNames(
        "transition-opacity absolute whitespace-nowrap w-fit z-50 pointer-events-none",
        {
          "opacity-100": showPopover,
          "opacity-0": !showPopover,
        },
      )}
    >
      <div className="flex flex-col text-xs mx-2 gap-0.5">
        <div className="flex flex-1 items-center justify-center">
          <img src={image} className="w-4 mr-1" />
          <span>{description}</span>
        </div>
        {hasSecondRow && (
          <div className="flex flex-1 items-center justify-center">
            {secondaryImage && (
              <img src={secondaryImage} className="w-4 mr-1" />
            )}
            {secondaryDescription && <span>{secondaryDescription}</span>}
          </div>
        )}
        <span className="flex-1 text-center font-secondary">
          {secondsToString(timeLeft, { length: "medium" })}
        </span>
      </div>
    </InnerPanel>
  );
};
