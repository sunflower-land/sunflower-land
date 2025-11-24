import React, { useEffect, useState } from "react";
import { useSpring, animated } from "react-spring";

import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString, TimeFormatLength } from "lib/utils/time";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { progressBarBorderStyle } from "features/game/lib/style";

export type ProgressType =
  | "progress"
  | "health"
  | "error"
  | "buff"
  | "quantity";

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  percentage: number;
  type: ProgressType;
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

const PROGRESS_COLORS: Record<ProgressType, progressStyle> = {
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
  type: ProgressType;
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
 * @returns The non-resizable bar.
 */
export const Bar: React.FC<{ percentage: number; type: ProgressType }> = ({
  percentage,
  type,
}) => {
  const progressWidth = Math.floor(
    (DIMENSIONS.innerWidth * Math.min(percentage, 100)) / 100,
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
        src={SUNNYSIDE.ui.emptyBar}
        style={{
          width: `${PIXEL_SCALE * DIMENSIONS.width}px`,
        }}
      />
      <img
        className="absolute z-30 opacity-50"
        src={SUNNYSIDE.ui.emptyBar}
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

/**
 * Animated non-resizable bar that is used in the map. Handles transparency well and animates progress changes.
 * @param percentage Percentage of the bar (0 to 100).
 * @param type The bar type (determines what color it has).
 * @returns The animated non-resizable bar.
 */
export const AnimatedBar: React.FC<{
  percentage: number;
  type: ProgressType;
  shouldWrap?: boolean;
}> = ({ percentage, type, shouldWrap = true }) => {
  const [prevPercentage, setPrevPercentage] = useState(
    Math.min(percentage, 100),
  );
  const clampedPercentage = Math.min(percentage, 100);

  // Detect if we need to wrap (percentage decreased)
  const shouldReset = shouldWrap && prevPercentage > clampedPercentage;

  const { width } = useSpring({
    from: { width: shouldReset ? 0 : undefined },
    to: { width: clampedPercentage },
    config: {
      tension: 120,
      friction: 30,
      clamp: true,
    },
    reset: shouldReset,
  });

  // Track previous percentage for wrap detection
  useEffect(() => {
    setPrevPercentage(clampedPercentage);
  }, [clampedPercentage]);

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
        src={SUNNYSIDE.ui.emptyBar}
        style={{
          width: `${PIXEL_SCALE * DIMENSIONS.width}px`,
        }}
      />
      <img
        className="absolute z-30 opacity-50"
        src={SUNNYSIDE.ui.emptyBar}
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

      {/* Animated Progress */}
      <animated.div
        className="absolute"
        style={{
          backgroundColor: PROGRESS_COLORS[type].color,
          top: `${PIXEL_SCALE * DIMENSIONS.marginTop}px`,
          left: `${PIXEL_SCALE * DIMENSIONS.marginLeft}px`,
          height: `${PIXEL_SCALE * DIMENSIONS.innerHeight}px`,
          width: width?.to(
            (w) => `${(PIXEL_SCALE * DIMENSIONS.innerWidth * w) / 100}px`,
          ),
        }}
      />
      <animated.div
        className="absolute z-30 opacity-80"
        style={{
          backgroundColor: PROGRESS_COLORS[type].color,
          top: `${PIXEL_SCALE * DIMENSIONS.marginTop}px`,
          left: `${PIXEL_SCALE * DIMENSIONS.marginLeft}px`,
          height: `${PIXEL_SCALE * DIMENSIONS.innerHeight}px`,
          // Remove the state setters from this transformation callback
          width: width?.to((w) => {
            return `${(PIXEL_SCALE * DIMENSIONS.innerWidth * w) / 100}px`;
          }),
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
  const currentLanguage = localStorage.getItem("language") || "en";

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
            className={`text-white text-center ${
              currentLanguage === "zh-CN" ? "font-Ark" : "font-pixel"
            }`}
            style={{
              padding: "0px 1px",
              height: "9px",
              lineHeight: "7px",
              top: `${currentLanguage === "zh-CN" ? "4px" : "6px"}`,
              position: "relative",
              textShadow: "1px 1px black",
              whiteSpace: "nowrap",
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
