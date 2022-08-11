import { secondsToMidString } from "lib/utils/time";
import React, { useEffect, useState } from "react";

import { Overlay } from "react-bootstrap";
import { InnerPanel } from "./Panel";

interface Props {
  target: HTMLElement;
  timeLeft: number;
  text?: string;
  showTimeLeft?: boolean;
}

export const TimeLeftOverlay: React.FC<Props> = ({
  text = "",
  showTimeLeft = false,
  timeLeft,
  target,
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
    <Overlay target={target} show={showTimeLeft} placement="right">
      {(arrowprops) => (
        <div {...arrowprops} className="z-10">
          <InnerPanel className="transition-opacity whitespace-nowrap w-fit pointer-events-none">
            <div className="flex flex-col text-xxs text-white text-shadow ml-2 mr-2">
              <span className="flex-1">{text}</span>
              <span className="flex-1">{time}</span>
            </div>
          </InnerPanel>
        </div>
      )}
    </Overlay>
  );
};
