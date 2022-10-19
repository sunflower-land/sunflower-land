import React from "react";
import { InnerPanel } from "components/ui/Panel";
import { secondsToMidString } from "lib/utils/time";
import classNames from "classnames";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";

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
  useUiRefresher({ active: showTimeLeft });

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
        <span className="flex-1">{secondsToMidString(timeLeft)}</span>
      </div>
    </InnerPanel>
  );
};
