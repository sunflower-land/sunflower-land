import React from "react";

import progressStart from "assets/ui/progress/start.png";
import progressQuarter from "assets/ui/progress/quarter.png";
import progressHalf from "assets/ui/progress/half.png";
import progressAlmost from "assets/ui/progress/almost.png";
import progressFull from "assets/ui/progress/full.png";

import { secondsToString } from "lib/utils/time";

interface Props {
  percentage: number;
  seconds: number;
}

export const Bar: React.FC<Props> = ({ percentage }) => {
  if (percentage >= 100) {
    return <img src={progressFull} className="w-10" />;
  }
  if (percentage >= 75) {
    return <img src={progressAlmost} className="w-10" />;
  }

  if (percentage >= 50) {
    return <img src={progressHalf} className="w-10" />;
  }

  if (percentage >= 25) {
    return <img src={progressQuarter} className="w-10" />;
  }

  return <img src={progressStart} className="w-10" />;
};

export const ProgressBar: React.FC<Props> = ({ percentage, seconds }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      {seconds > 0 && (
        <span className="text-shadow text-xxs text-white -mb-0.5">
          {secondsToString(seconds)}
        </span>
      )}
      <Bar percentage={percentage} seconds={seconds} />
    </div>
  );
};
