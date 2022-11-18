import React from "react";

import emptyBar from "assets/ui/progress/empty_bar.png";

import { secondsToString } from "lib/utils/time";
import { PIXEL_SCALE } from "features/game/lib/constants";

type progressType = "progress" | "health" | "error";

interface Props {
  percentage: number;
  type: progressType;
  seconds: number;
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
};

export const Bar: React.FC<{ percentage: number; type: progressType }> = ({
  percentage,
  type,
}) => {
  const progressWidth = Math.floor((DIMENSIONS.innerWidth * percentage) / 100);

  return (
    <div
      className="absolute"
      style={{
        width: `${PIXEL_SCALE * DIMENSIONS.width}px`,
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

export const ProgressBar: React.FC<Props> = ({ percentage, type, seconds }) => {
  return (
    <div className="absolute">
      {seconds > 0 && (
        <span
          className="absolute text-xxs text-white text-center z-30"
          style={{
            top: `${PIXEL_SCALE * -5}px`,
            width: `${PIXEL_SCALE * 15}px`,
          }}
        >
          {secondsToString(seconds, { length: "short", isShortFormat: true })}
        </span>
      )}
      <div className="absolute" style={{}}>
        <Bar percentage={percentage} type={type} />
      </div>
    </div>
  );
};
