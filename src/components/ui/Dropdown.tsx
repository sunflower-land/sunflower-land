import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { PIXEL_SCALE } from "features/game/lib/constants";
import React from "react";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  className?: string;
}
const Dropdown: React.FC<Props> = ({
  label,
  value,
  onChange,
  options,
  className,
}) => {
  return (
    <div
      className={classNames(
        "flex items-center justify-between w-full",
        className,
      )}
    >
      <span className="text-sm">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-40 p-1 text-sm object-contain justify-center items-center hover:brightness-90 cursor-pointer flex disabled:opacity-50"
        style={{
          borderImage: `url(${SUNNYSIDE.ui.primaryButton}) 3 3 4 3 fill`,
          borderWidth: `8px 8px 10px 8px`,
          imageRendering: "pixelated",
          borderImageRepeat: "stretch",
          borderRadius: `${PIXEL_SCALE * 5}px`,
          background: "none",
          appearance: "none",
        }}
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#e4a672]">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
