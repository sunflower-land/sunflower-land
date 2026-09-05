import React from "react";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { pixelLightBorderStyle } from "features/game/lib/style";

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: number;
  "aria-label"?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  disabled = false,
  size = PIXEL_SCALE * 10,
  "aria-label": ariaLabel,
}) => {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <div
      className="relative"
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      aria-label={ariaLabel}
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          handleClick();
        }
      }}
    >
      <div
        className={classNames("bg-brown-100 relative cursor-pointer", {
          "bg-brown-100 cursor-not-allowed opacity-75": disabled,
        })}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          ...pixelLightBorderStyle,
        }}
      />
      {checked && (
        <img
          src={SUNNYSIDE.icons.confirm}
          alt="checked"
          className="absolute"
          style={{
            width: `${size * 0.8}px`,
            left: `${size * 0.1}px`,
            bottom: `${size * 0.1}px`,
          }}
        />
      )}
    </div>
  );
};
