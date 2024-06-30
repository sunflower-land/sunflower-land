import React from "react";

import classNames from "classnames";
import {
  pixelTabBorderStartStyle,
  pixelTabBorderMiddleStyle,
  pixelTabBorderVerticalMiddleStyle,
} from "features/game/lib/style";
import { PIXEL_SCALE } from "features/game/lib/constants";
import lockIcon from "assets/skills/lock.png";
import { useIsDarkMode } from "lib/utils/hooks/useIsDarkMode";

interface Props {
  isFirstTab?: boolean;
  isActive?: boolean;
  className?: string;
  vertical?: boolean;
  onClick?: () => void;
  disabled?: boolean;
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
  disabled,
}) => {
  const { isDarkMode } = useIsDarkMode();

  if (!isActive) {
    return (
      <div
        className={classNames(
          "flex items-center cursor-pointer px-2",
          className,
          { "opacity-50 cursor-not-allowed": disabled }
        )}
        onClick={disabled ? undefined : onClick}
        style={{
          paddingLeft: `${PIXEL_SCALE * 2}px`,
          paddingRight: `${PIXEL_SCALE * 2}px`,
          height: `${PIXEL_SCALE * 16}px`,
          // color: "#f6ecd8",
        }}
      >
        {disabled && (
          <img src={lockIcon} className="w-3 absolute top-2 right-3 z-10" />
        )}
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
      className={classNames("flex items-center px-2", className, {
        "opacity-50 cursor-not-allowed": disabled,
      })}
      style={{
        ...getBorderStyle(),
        paddingLeft: `${PIXEL_SCALE * 2}px`,
        paddingRight: `${PIXEL_SCALE * 2}px`,
        height: `${PIXEL_SCALE * 16}px`,
        background: isDarkMode ? "#c28669" : "#e4a672",
      }}
    >
      {children}
    </div>
  );
};
