import React from "react";
import { InnerPanel } from "components/ui/Panel";
import { secondsToString } from "lib/utils/time";
import classNames from "classnames";

interface Props {
  text?: string;
  timeLeft: number;
  showTimeLeft?: boolean;
}

export const TimeLeftPanel: React.FC<Props> = ({
  text = "",
  showTimeLeft = false,
  timeLeft,
}) => {
  return (
    <InnerPanel
      className={classNames(
        "absolute transition-opacity whitespace-nowrap w-fit z-50 pointer-events-none",
        {
          "opacity-100": showTimeLeft,
          "opacity-0": !showTimeLeft,
        },
      )}
    >
      <div className="flex flex-col text-xxs p-1">
        <span className="flex-1 mb-0.5">{text}</span>
        <span className="flex-1 font-secondary">
          {secondsToString(timeLeft, { length: "medium" })}
        </span>
      </div>
    </InnerPanel>
  );
};
