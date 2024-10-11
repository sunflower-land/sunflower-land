import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Bar } from "components/ui/ProgressBar";

export const LevelProgress = ({
  level,
  className,
}: {
  level: number;
  className?: string;
}) => {
  return (
    <div className={`absolute ${className}`}>
      <div className="absolute">
        <Bar percentage={10} type="progress" />
      </div>
      <div className="absolute w-5 z-50 -left-1 top-0">
        <img
          src={SUNNYSIDE.icons.heart}
          alt={`Level ${level}`}
          className="w-full"
        />

        <div className="absolute top-1/2 left-1/2 leading-3 transform -translate-x-1/2 -translate-y-1/2 -mt-[1px] text-[16px] text-white">
          {level}
        </div>
      </div>
    </div>
  );
};
