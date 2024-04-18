// Select.tsx - a simple select component using game type styles & colors

import React from "react";
import classnames from "classnames";
import { pixelLightBorderStyle } from "features/game/lib/style";

type Option = {
  value: string;
  label: string;
};

interface Props {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const Select: React.FC<Props> = ({
  options,
  value,
  onChange,
  className,
}) => {
  return (
    <select
      className={classnames(
        "bg-brown-200 w-min px-1 select-none text-xs object-contain justify-center items-center hover:bg-brown-300 cursor-pointer flex disabled:opacity-50",
        className
      )}
      style={pixelLightBorderStyle}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
