import React, { useEffect, useState } from "react";

import emptyBar from "assets/ui/progress/empty_bar.png";
import { secondsToString, TimeFormatLength } from "lib/utils/time";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { progressBarBorderStyle } from "features/game/lib/style";

type progressType = "progress" | "health" | "error" | "buff" | "quantity";

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  percentage: number;
  type: progressType;
  seconds?: number;
  formatLength: TimeFormatLength;
}

const DIMENSIONS = {
  width: 15,
  height: 7,
  innerWidth: 11,
  innerHeight: 2,
  marginTop: 2,
  marginLeft: 2,
};

interface progressStyle {
  color: string;
  backgroundColor: string;
}

const PROGRESS_COLORS: Record<progressType, progressStyle> = {
  progress: {
    color: "#63c74d",
    backgroundColor: "#193c3e",
  },
  health: {
    color: "#0099db",
    backgroundColor: "#0d2f6d",
  },
  error: {
    color: "#e43b44",
    backgroundColor: "#3e2731",
  },
  buff: {
    color: "#b65389",
    backgroundColor: "#193c3e",
  },
  quantity: {
    color: "#ffb01e",
    backgroundColor: "#543a2b",
  },
};

/**
 * Resizable bar that is used in UI/HUD.  Does not handle transparency well.
 * @param percentage Percentage of the bar (0 to 100).
 * @param type The bar type (determines what color it has).
 * @param outerDimensions The outer dimensions of the bar in game pixels.
 * @param _.width The outer width of the bar in game pixels.
 * @param _.height The outer height of the bar in game pixels.
 * @returns The resizable bar.
 */
export const ResizableBar: React.FC<{
  percentage: number;
  type: progressType;
  outerDimensions?: {
    width: number;
    height: number;
  };
}> = ({ percentage, type, outerDimensions = { width: 15, height: 7 } }) => {
  const innerWidth = outerDimensions.width - 4;
  const clampedProgress = Math.max(0, Math.min(percentage, 100)) / 100;
  const progressFillPercentage =
    (Math.floor(clampedProgress * innerWidth) / innerWidth) * 100;
  const colorInfo = PROGRESS_COLORS[type];
  const backgroundColor = colorInfo.backgroundColor;
  const color = colorInfo.color;

  return (
    <div
      className="relative"
      style={{
        ...progressBarBorderStyle,
        width: `${PIXEL_SCALE * outerDimensions.width}px`,
        height: `${PIXEL_SCALE * outerDimensions.height}px`,
        backgroundColor,
        // backgroundImage: `linear-gradient(to right, ${color} 0%, ${color} ${progressFillPercentage}%, ${backgroundColor} ${progressFillPercentage}%, ${backgroundColor} 100%)`,
      }}
    >
      <div
        className="relative h-full"
        style={{
          transition: "width 0.5s",

          backgroundColor: color,
          width: `${progressFillPercentage}%`,
        }}
      />
    </div>
  );
};

/**
 * Non-resizable bar that is used in the map.  Handles transparency well.
 * @param percentage Percentage of the bar (0 to 100).
 * @param type The bar type (determines what color it has).
 * @returns The non-rresizable bar.
 */
export const Bar: React.FC<{ percentage: number; type: progressType }> = ({
  percentage,
  type,
}) => {
  const progressWidth = Math.floor(
    (DIMENSIONS.innerWidth * Math.min(percentage, 100)) / 100
  );

  return (
    <div
      className="relative"
      style={{
        width: `${PIXEL_SCALE * DIMENSIONS.width}px`,
        height: `${PIXEL_SCALE * DIMENSIONS.height}px`,
      }}
    >
      {/* Progress bar frame */}
      <img
        className="absolute"
        src={emptyBar}
        style={{
          width: `${PIXEL_SCALE * DIMENSIONS.width}px`,
        }}
      />
      <img
        className="absolute z-30 opacity-50"
        src={emptyBar}
        style={{
          width: `${PIXEL_SCALE * DIMENSIONS.width}px`,
        }}
      />

      {/* Progress bar inner background */}
      <div
        className="absolute"
        style={{
          backgroundColor: PROGRESS_COLORS[type].backgroundColor,
          top: `${PIXEL_SCALE * DIMENSIONS.marginTop}px`,
          left: `${PIXEL_SCALE * DIMENSIONS.marginLeft}px`,
          width: `${PIXEL_SCALE * DIMENSIONS.innerWidth}px`,
          height: `${PIXEL_SCALE * DIMENSIONS.innerHeight}px`,
        }}
      />
      <div
        className="absolute z-30 opacity-80"
        style={{
          backgroundColor: PROGRESS_COLORS[type].backgroundColor,
          top: `${PIXEL_SCALE * DIMENSIONS.marginTop}px`,
          left: `${PIXEL_SCALE * DIMENSIONS.marginLeft}px`,
          width: `${PIXEL_SCALE * DIMENSIONS.innerWidth}px`,
          height: `${PIXEL_SCALE * DIMENSIONS.innerHeight}px`,
        }}
      />

      {/* Progress */}
      <div
        className="absolute"
        style={{
          backgroundColor: PROGRESS_COLORS[type].color,
          top: `${PIXEL_SCALE * DIMENSIONS.marginTop}px`,
          left: `${PIXEL_SCALE * DIMENSIONS.marginLeft}px`,
          width: `${PIXEL_SCALE * progressWidth}px`,
          height: `${PIXEL_SCALE * DIMENSIONS.innerHeight}px`,
        }}
      />
      <div
        className="absolute z-30 opacity-80"
        style={{
          backgroundColor: PROGRESS_COLORS[type].color,
          top: `${PIXEL_SCALE * DIMENSIONS.marginTop}px`,
          left: `${PIXEL_SCALE * DIMENSIONS.marginLeft}px`,
          width: `${PIXEL_SCALE * progressWidth}px`,
          height: `${PIXEL_SCALE * DIMENSIONS.innerHeight}px`,
        }}
      />
    </div>
  );
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  type,
  formatLength,
  seconds = 0,
  ...divProps
}) => {
  return (
    <div className="absolute" {...divProps}>
      {seconds > 0 && (
        <div
          className="flex justify-center absolute w-full pointer-events-none z-30"
          style={{
            top: `${PIXEL_SCALE * -5.5}px`,
            width: `${PIXEL_SCALE * 15}px`,
          }}
        >
          <span
            className="font-pixel  !text-[22px] text-white text-center"
            style={{
              padding: "0px 1px",
              height: "9px",
              lineHeight: "7px",
              top: "6px",
              position: "relative",
              textShadow: "1px 1px black",
            }}
          >
            {secondsToString(seconds, {
              length: formatLength,
              isShortFormat: true,
            })}
          </span>
        </div>
      )}

      <div className="absolute">
        <Bar percentage={percentage} type={type} />
      </div>
    </div>
  );
};

interface LiveProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  startAt: number;
  endAt: number;
  formatLength: TimeFormatLength;
  onComplete: () => void;
  type?: ProgressBarProps["type"];
}

/**
 * A progress bar which re-renders it's own timer
 * This avoids parents needing to render on their own
 */
export const LiveProgressBar: React.FC<LiveProgressBarProps> = ({
  startAt,
  endAt,
  formatLength,
  onComplete,
  type = "progress",
  ...divProps
}) => {
  const [secondsLeft, setSecondsLeft] = useState((endAt - Date.now()) / 1000);

  const totalSeconds = (endAt - startAt) / 1000;
  const percentage = (100 * (totalSeconds - secondsLeft)) / totalSeconds;

  const active = endAt >= startAt;

  useEffect(() => {
    if (active) {
      const interval = setInterval(() => {
        setSecondsLeft((endAt - Date.now()) / 1000);

        if (Date.now() > endAt) {
          onComplete();
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [active]);

  return (
    <ProgressBar
      seconds={secondsLeft}
      formatLength={formatLength}
      percentage={percentage}
      type={type}
      {...divProps}
    />
  );
};
