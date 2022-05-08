import React from "react";

import tabBorder from "assets/ui/panel/tab_border.png";
import classNames from "classnames";

interface Props {
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Light panel with border effect
 */
export const Tab: React.FC<Props> = ({
  children,
  className,
  isActive,
  onClick,
}) => {
  if (!isActive) {
    return (
      <div
        className={classNames(
          "px-1 py-2 mr-2 flex items-center cursor-pointer",
          className
        )}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={classNames(
        "bg-brown-300 px-1 py-2 mr-2 flex items-center",
        className
      )}
      // Custom styles to get pixellated border effect
      style={{
        // border: "6px solid transparent",
        borderStyle: "solid",
        borderWidth: "6px",
        borderImage: `url(${tabBorder}) 30 stretch`,
        borderImageSlice: "25%",
        imageRendering: "pixelated",
        borderImageRepeat: "repeat",
        borderRadius: "20px 20px 0 0",
      }}
    >
      {children}
    </div>
  );
};
