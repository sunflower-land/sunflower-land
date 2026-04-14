import React from "react";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelLightBorderStyle } from "features/game/lib/style";

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
}) => {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div className="relative" onClick={handleClick}>
      <div
        className={classNames("bg-brown-100 relative cursor-pointer", {
          "bg-brown-100 cursor-not-allowed opacity-75": disabled,
        })}
        style={{
          width: `${PIXEL_SCALE * 10}px`,
          height: `${PIXEL_SCALE * 10}px`,
          ...pixelLightBorderStyle,
        }}
      />
      {checked && (
        <img
          src={SUNNYSIDE.icons.confirm}
          alt="checked"
          className="absolute left-1 bottom-1 w-8"
        />
      )}
    </div>
  );
};
