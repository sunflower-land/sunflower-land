import React from "react";

import classNames from "classnames";
import {
  pixelTabBorderStartStyle,
  pixelTabBorderMiddleStyle,
  pixelTabBorderVerticalMiddleStyle,
} from "features/game/lib/style";
import { PIXEL_SCALE } from "features/game/lib/constants";

interface Props {
  isFirstTab?: boolean;
  isActive?: boolean;
  className?: string;
  vertical?: boolean;
  onClick?: () => void;
}

/**
 * Light panel with border effect
 */
export const Tab: React.FC<Props> = ({
  isFirstTab = true,
  vertical = false,
  isActive,
  children,
  className,
  onClick,
}) => {
  if (!isActive) {
    return (
      <div
        className={classNames(
          "flex items-center cursor-pointer px-2",
          className
        )}
        onClick={onClick}
        style={{
          paddingLeft: `${PIXEL_SCALE * 2}px`,
          paddingRight: `${PIXEL_SCALE * 2}px`,
          height: `${PIXEL_SCALE * 16}px`,
        }}
      >
        {children}
      </div>
    );
  }

  const getBorderStyle = () => {
    if (vertical) return pixelTabBorderVerticalMiddleStyle;

    return isFirstTab ? pixelTabBorderStartStyle : pixelTabBorderMiddleStyle;
  };

  return (
    <div
      className={classNames("bg-brown-300 flex items-center px-2", className)}
      style={{
        ...getBorderStyle(),
        paddingLeft: `${PIXEL_SCALE * 2}px`,
        paddingRight: `${PIXEL_SCALE * 2}px`,
        height: `${PIXEL_SCALE * 16}px`,
      }}
    >
      {children}
    </div>
  );
};
