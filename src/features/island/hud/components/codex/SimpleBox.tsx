import React from "react";

import { pixelHalloweenOuterBorderStyle } from "features/game/lib/style";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SquareIcon } from "components/ui/SquareIcon";
import classNames from "classnames";

const INNER_CANVAS_WIDTH = 14;

export interface BoxProps {
  image: string;
  silhouette: boolean;
  className?: string;
  onClick: () => void;
}

export const SimpleBox: React.FC<BoxProps> = ({
  image,
  silhouette,
  className,
  children,
  onClick,
}) => {
  return (
    <div onClick={onClick}>
      <div
        className={`cursor-pointer relative ${className}`}
        style={{
          width: `${PIXEL_SCALE * (INNER_CANVAS_WIDTH + 4)}px`,
          height: `${PIXEL_SCALE * (INNER_CANVAS_WIDTH + 4)}px`,
          marginTop: `${PIXEL_SCALE * 3}px`,
          marginBottom: `${PIXEL_SCALE * 2}px`,
          marginLeft: `${PIXEL_SCALE * 2}px`,
          marginRight: `${PIXEL_SCALE * 3}px`,
          backgroundColor: "#3A4466",
          ...pixelHalloweenOuterBorderStyle,
        }}
      >
        <div className="absolute flex justify-center items-center w-full h-full">
          <SquareIcon
            icon={image}
            width={INNER_CANVAS_WIDTH}
            className={classNames({ silhouette: silhouette })}
          />
        </div>

        {/* Label: Count or Check */}
        {children}
      </div>
    </div>
  );
};
