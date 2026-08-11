import React from "react";
import classNames from "classnames";

import sparkleSheet from "assets/animals/mutant_sparkle.png";
import { PIXEL_SCALE } from "features/game/lib/constants";

const FRAME_WIDTH = 20;
const FRAME_HEIGHT = 19;

interface BurstProps {
  /** Rendered width of the sprite in pixels */
  width: number;
  /** Seconds for one loop. Vary it so bursts don't twinkle in unison */
  duration: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A looping burst of vibrant pixel sparkles.
 */
export const SparkleBurst: React.FC<BurstProps> = ({
  width,
  duration,
  className,
  style,
}) => (
  <div
    className={classNames("sparkle-burst", className)}
    style={
      {
        "--sparkle-frame-width": `${width}px`,
        width: `${width}px`,
        height: `${(width * FRAME_HEIGHT) / FRAME_WIDTH}px`,
        backgroundImage: `url(${sparkleSheet})`,
        animationDuration: `${duration}s`,
        ...style,
      } as React.CSSProperties
    }
  />
);

/**
 * Marks an animal that is carrying a mutant reward. Fills its closest
 * positioned parent, so drop it inside the animal's container.
 */
export const MutantSparkles: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div
    className={classNames("absolute inset-0 pointer-events-none", className)}
  >
    <SparkleBurst
      width={PIXEL_SCALE * FRAME_WIDTH}
      duration={1.05}
      className="absolute -top-1 -left-2"
    />
    <SparkleBurst
      width={PIXEL_SCALE * FRAME_WIDTH}
      duration={1.4}
      className="absolute -bottom-1 -right-2"
      style={{ transform: "scaleX(-1)" }}
    />
  </div>
);
