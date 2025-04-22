import React from "react";

import { pixelDarkBorderStyle } from "features/game/lib/style";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SquareIcon } from "components/ui/SquareIcon";
import classNames from "classnames";
import { Label } from "components/ui/Label";

const INNER_CANVAS_WIDTH = 14;

export interface BoxProps {
  image: string;
  silhouette: boolean;
  className?: string;
  inventoryCount?: number;
  onClick: () => void;
}

export const SimpleBox: React.FC<React.PropsWithChildren<BoxProps>> = ({
  image,
  silhouette,
  className,
  children,
  inventoryCount,
  onClick,
}) => {
  return (
    <div onClick={onClick}>
      <div
        className={`bg-brown-600 cursor-pointer relative ${className}`}
        style={{
          width: `${PIXEL_SCALE * (INNER_CANVAS_WIDTH + 4)}px`,
          height: `${PIXEL_SCALE * (INNER_CANVAS_WIDTH + 4)}px`,
          marginTop: `${PIXEL_SCALE * 3}px`,
          marginBottom: `${PIXEL_SCALE * 2}px`,
          marginLeft: `${PIXEL_SCALE * 2}px`,
          marginRight: `${PIXEL_SCALE * 3}px`,
          ...pixelDarkBorderStyle,
        }}
      >
        {inventoryCount && (
          <Label
            className="absolute z-10 -top-3 -right-3"
            type="default"
            style={{
              padding: "0 2.5",
              height: "24px",
            }}
          >
            {inventoryCount}
          </Label>
        )}
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
