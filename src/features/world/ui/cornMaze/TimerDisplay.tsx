import React from "react";
import { secondsToString } from "lib/utils/time";
import { Label } from "components/ui/Label";
import { SquareIcon } from "components/ui/SquareIcon";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";

interface Props {
  startedAt: number;
  timeLeft: number;
}

export const TimerDisplay: React.FC<Props> = ({ startedAt, timeLeft }) => {
  const runningOutOfTime = timeLeft > 0 && timeLeft < 25;

  return (
    <>
      <p
        className={classNames(
          "absolute right-3 bottom-12 md:bottom-20 italic text-xs md:text-sm transition-transform duration-1000 ease-in-out",
          {
            "translate-x-48 md:translate-x-56": !runningOutOfTime,
            "-translate-x-0": runningOutOfTime,
          }
        )}
      >
        Return to the portal!
      </p>
      <div
        className={classNames(
          "absolute right-2 bottom-0 scale-150 md:scale-[2] origin-bottom-right transition-transform duration-500",
          {
            "translate-y-16": startedAt === 0,
            "-translate-y-2 md:-translate-y-6": startedAt > 0,
          }
        )}
      >
        <Label
          type={runningOutOfTime || timeLeft === 0 ? "danger" : "info"}
          className={classNames(
            "transition-colors duration-200 flex flex-col",
            {
              "warn-pulse": runningOutOfTime,
            }
          )}
        >
          <div className="flex">
            <SquareIcon
              icon={SUNNYSIDE.icons.stopwatch}
              width={5}
              className="-mb-0.5"
            />
            <span className="ml-1">
              {timeLeft > 0 && secondsToString(timeLeft, { length: "medium" })}
              {timeLeft === 0 && <span>Times up!</span>}
            </span>
          </div>
        </Label>
      </div>
    </>
  );
};
