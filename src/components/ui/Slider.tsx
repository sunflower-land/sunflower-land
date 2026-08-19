import React from "react";
import classNames from "classnames";

interface Props {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  "aria-label"?: string;
}

export const Slider: React.FC<Props> = ({
  value,
  onChange,
  disabled = false,
  "aria-label": ariaLabel,
}) => {
  const percent = Math.round(value * 100);

  return (
    <input
      type="range"
      min={0}
      max={1}
      step={0.01}
      value={value}
      disabled={disabled}
      aria-label={ariaLabel}
      className={classNames("pixel-range w-full", {
        "opacity-50 cursor-not-allowed": disabled,
      })}
      style={{
        background: `linear-gradient(to right, #b96f50 0%, #b96f50 ${percent}%, #EAD4AA ${percent}%, #EAD4AA 100%)`,
      }}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  );
};
