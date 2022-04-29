import React, { useState, useEffect } from "react";
import { InnerPanel } from "components/ui/Panel";
import { secondsToMidString } from "lib/utils/time";
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
  const [time, setTime] = useState(secondsToMidString(timeLeft));

  useEffect(() => {
    const start = Date.now();
    // start time interval
    const interval = setInterval(() => {
      const timeLeftNow = timeLeft - (Date.now() - start) / 1000;
      setTime(secondsToMidString(timeLeftNow));

      // clears interval if panel is not showing
      if (timeLeftNow <= 0 || !showTimeLeft) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [showTimeLeft, timeLeft]);

  return (
    <InnerPanel
      className={classNames(
        "ml-10 transition-opacity absolute whitespace-nowrap sm:opacity-0 bottom-5 w-fit left-5 z-20 pointer-events-none",
        {
          "opacity-100": showTimeLeft,
          "opacity-0": !showTimeLeft,
        }
      )}
    >
      <div className="flex flex-col text-xxs text-white text-shadow ml-2 mr-2">
        <span className="flex-1">{text}</span>
        <span className="flex-1">{time}</span>
      </div>
    </InnerPanel>
  );
};
