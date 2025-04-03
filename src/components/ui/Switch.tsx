import React from "react";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import lockIcon from "assets/icons/lock.png";

const Switch: React.FC<{
  checked: boolean;
  onChange: () => void;
  label: string;
  className?: string;
  disabled?: boolean;
}> = ({ checked, onChange, label, className, disabled }) => {
  return (
    <div
      className={classNames(
        "flex items-center justify-between w-full cursor-pointer h-8",
        className,
      )}
      onClick={disabled ? undefined : onChange}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm">{label}</span>
        {disabled && <img src={lockIcon} className="h-6" />}
      </div>
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
