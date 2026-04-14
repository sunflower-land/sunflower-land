import { PIXEL_SCALE } from "features/game/lib/constants";
import React from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
/**
 * @param children - The content of the button.
 * @param onClick - The function to call when the button is clicked.
 * @param disabled - Whether the button is disabled.
 * @param buttonSize - The size of the button. Default is 22.
 * additional styling around the button should be handled a separate div around the button
 */
interface RoundButtonProps {
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
  disabled?: boolean;
  className?: string;
  buttonSize?: number;
}

export const RoundButton: React.FC<
  React.PropsWithChildren<RoundButtonProps>
> = ({ children, onClick, disabled, className, buttonSize = 22 }) => {
  return (
    <div
      onClick={onClick}
      className={classNames("relative flex", className, {
        "cursor-pointer hover:img-highlight group": !disabled,
      })}
      style={{
        width: `${PIXEL_SCALE * buttonSize}px`,
        height: `${PIXEL_SCALE * buttonSize}px`,
      }}
    >
      <img
        src={SUNNYSIDE.ui.round_button_pressed}
        className="absolute"
        style={{
          width: `${PIXEL_SCALE * buttonSize}px`,
        }}
      />
      <img
        src={SUNNYSIDE.ui.round_button}
        className="absolute group-active:hidden"
        style={{
          width: `${PIXEL_SCALE * buttonSize}px`,
        }}
      />
      {children}
    </div>
  );
};
