import React from "react";
import classnames from "classnames";
import { pixelLightBorderStyle } from "features/game/lib/style";
import { isTouchDevice } from "features/world/lib/device";

interface Props {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | undefined;
}

/**
 * A button which is trigger on touch, not release
 */
export const SensitiveButton: React.FC<Props> = ({
  children,
  onClick,
  disabled,
  className,
  type,
}) => {
  return (
    <button
      className={classnames(
        "bg-brown-200 w-full p-1 text-xs object-contain justify-center items-center hover:bg-brown-300 cursor-pointer flex disabled:opacity-50 ",
        className
      )}
      type={type}
      disabled={disabled}
      style={pixelLightBorderStyle}
      // TODO only use one
      onMouseDown={!isTouchDevice() ? onClick : undefined}
      onTouchStart={onClick}
    >
      <div className="mb-1">{children}</div>
    </button>
  );
};
