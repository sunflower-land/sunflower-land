import React from "react";

import progressStart from "../../images/ui/progress/start.png";
import progressQuarter from "../../images/ui/progress/quarter.png";
import progressHalf from "../../images/ui/progress/half.png";
import progressAlmost from "../../images/ui/progress/almost.png";
import progressFull from "../../images/ui/progress/full.png";
import { secondsToString } from "../../utils/time";

interface Props {
  percentage: number;
  seconds: number;
}

export const Bar: React.FC<Props> = ({ percentage }) => {
  if (percentage >= 1) {
    return <img src={progressFull} className="tree-progress" />;
  }
  if (percentage >= 3 / 4) {
    return <img src={progressAlmost} className="tree-progress" />;
  }

  if (percentage >= 1 / 2) {
    return <img src={progressHalf} className="tree-progress" />;
  }

  if (percentage >= 1 / 4) {
    return <img src={progressQuarter} className="tree-progress" />;
  }

  return <img src={progressStart} className="tree-progress" />;
};

export const Progress: React.FC<Props> = ({ percentage, seconds }) => {
  return (
    <>
      <Bar percentage={percentage} seconds={seconds} />
      {/* {seconds > 0 && (
        <span className="tree-progress-text">{secondsToString(seconds)}</span>
      )} */}
    </>
  );
};
