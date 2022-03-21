import React from "react";

import progressEmpty from "assets/ui/progress/blue_empty.png";
import progressAlmost from "assets/ui/progress/blue_almost.png";
import progressHalf from "assets/ui/progress/blue_half.png";

interface Props {
  percentage: number;
}

export const HealthBar: React.FC<Props> = ({ percentage }) => {
  if (percentage >= 50) {
    return <img src={progressHalf} className="w-10" />;
  }

  if (percentage >= 25) {
    return <img src={progressAlmost} className="w-10" />;
  }

  return <img src={progressEmpty} className="w-10" />;
};
