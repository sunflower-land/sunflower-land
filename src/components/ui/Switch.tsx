import React from "react";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";

const Switch: React.FC<{
  checked: boolean;
  onChange: () => void;
  label: string;
  className?: string;
}> = ({ checked, onChange, label, className }) => {
  return (
    <div
      className={classNames(
        "flex items-center justify-between w-full cursor-pointer h-8",
        className,
      )}
      onClick={onChange}
    >
      <span className="text-sm">{label}</span>
      {checked && (
        <img src={SUNNYSIDE.ui.turn_off} alt="selected" className="w-16" />
      )}
      {!checked && (
        <img src={SUNNYSIDE.ui.turn_on} alt="unselected" className="w-16" />
      )}
    </div>
  );
};

export default Switch;
