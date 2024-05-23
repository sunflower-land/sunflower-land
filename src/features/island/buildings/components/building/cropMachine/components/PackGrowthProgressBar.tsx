import React, { useEffect, useState } from "react";
import { calculateCropProgress } from "../lib/calculateCropProgress";
import { ResizableBar } from "components/ui/ProgressBar";

export interface ProgressProps {
  startTime: number;
  paused: boolean;
  growsUntil?: number;
  readyAt?: number;
  totalGrowTime: number;
  growTimeRemaining: number;
}

export const PackGrowthProgressBar = ({
  startTime,
  totalGrowTime,
  growsUntil,
  readyAt,
  growTimeRemaining,
  paused,
}: ProgressProps) => {
  // Calculate initial progress as default
  const [progress, setProgress] = useState(
    calculateCropProgress({
      startTime,
      totalGrowTime,
      readyAt,
      growsUntil,
      growTimeRemaining,
    })
  );

  useEffect(() => {
    if (progress < 100 && !paused) {
      const interval = setInterval(() => {
        setProgress(
          calculateCropProgress({
            startTime,
            totalGrowTime,
            readyAt,
            growsUntil,
            growTimeRemaining,
          })
        );
      }, 1000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, paused, startTime, totalGrowTime]);

  return (
    <ResizableBar
      percentage={progress}
      type="progress"
      outerDimensions={{
        width: 70,
        height: 8,
      }}
    />
  );
};
