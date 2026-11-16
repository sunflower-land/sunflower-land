import React from "react";
import { ResizableBar } from "components/ui/ProgressBar";

export interface ProgressProps {
  startTime: number;
  paused: boolean;
  growsUntil?: number;
  readyAt?: number;
  totalGrowTime: number;
  growTimeRemaining: number;
  /** The modal's live clock (`useCropMachineLiveNow`) — no internal timer. */
  now: number;
}

export const PackGrowthProgressBar = ({
  progress,
}: {
  /**
   * 0–100, computed by the modal: work-based for a windowed pack
   * (`getCropMachinePackProgress`), `calculateCropProgress` for a legacy one.
   */
  progress: number;
}) => (
  <ResizableBar
    percentage={progress}
    type="progress"
    outerDimensions={{
      width: 70,
      height: 8,
    }}
  />
);
