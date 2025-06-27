import React, { useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { DropdownButtonPanel, DropdownOptionsPanel } from "./Panel";

interface DropdownOption {
  value: string;
  icon?: string;
}

interface DropdownProps<T extends string> {
  options: DropdownOption[];
  value?: T;
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
}

export const DropdownPanel = <T extends string>({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
}: DropdownProps<T>) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className={`flex flex-col gap-2 relative ${className}`}>
      <DropdownButtonPanel
        className="flex items-center justify-between gap-2"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="flex items-center gap-2">
          {selectedOption?.icon && (
            <img src={selectedOption.icon} className="w-5" />
          )}
          <p className="mb-1 ml-1">
            {selectedOption ? selectedOption.value : placeholder}
          </p>
        </div>
        <img
          src={SUNNYSIDE.icons.chevron_down}
          className={`w-5 ${showDropdown ? "rotate-180" : ""}`}
        />
      </DropdownButtonPanel>

      {showDropdown && (
        <div className="absolute top-[78%] left-0 right-0 z-50">
          <DropdownOptionsPanel className="flex flex-col">
            {options.map((option) => (
              <div
                key={option.value}
                className="flex items-center gap-2 py-2 cursor-pointer hover:bg-[#ead4aa]/50"
                onClick={() => {
                  setShowDropdown(false);
                  onChange(option.value as T);
                }}
              >
                {option.icon && <img src={option.icon} className="w-5" />}
                <span className="text-sm">{option.value}</span>
              </div>
            ))}
          </DropdownOptionsPanel>
        </div>
      )}
    </div>
  );
};
