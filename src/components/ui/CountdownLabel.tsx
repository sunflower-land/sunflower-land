import React from "react";
import { secondsToString } from "lib/utils/time";
import { Label } from "./Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { SquareIcon } from "./SquareIcon";

interface Props {
  timeLeft: number;
  endText?: string;
}

/**
 * The countdown label showing the timer in medium format with a timer icon.
 * @param timeLeft The time left in seconds.
 * @param endText The text appended to the end of the time display.
 */
export const CountdownLabel: React.FC<Props> = ({ timeLeft, endText }) => {
  return (
    <Label type="info">
      <SquareIcon
        icon={SUNNYSIDE.icons.stopwatch}
        width={5}
        className="-mb-0.5"
      />
      <span className="ml-1">
        {secondsToString(timeLeft, { length: "medium" })}
        {endText ? ` ${endText}` : ""}
      </span>
    </Label>
  );
};
