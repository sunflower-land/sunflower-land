import React, { useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { DropdownButtonPanel, DropdownOptionsPanel } from "./Panel";

interface DropdownOption {
  value: string;
  label?: string;
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
  const selectedLabel = selectedOption?.label ?? selectedOption?.value;

  return (
    <div className={`flex flex-col gap-2 relative ${className}`}>
      <DropdownButtonPanel
        className="flex items-center justify-between gap-2"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="flex items-center gap-2 py-1 px-1">
          {selectedOption?.icon && (
            <img src={selectedOption.icon} className="w-5" />
          )}
          <p className="mb-1 ml-1">
            {selectedOption ? selectedLabel : placeholder}
          </p>
        </div>
        <img
          src={SUNNYSIDE.icons.chevron_down}
          className={`w-5 ${showDropdown ? "rotate-180" : ""}`}
        />
      </DropdownButtonPanel>

      {showDropdown && (
        <div className="absolute top-[78%] left-0 right-0 z-50">
          <DropdownOptionsPanel className="flex flex-col max-h-[200px] scrollable overflow-y-auto">
            {options
              .filter((option) => option.value !== value)
              .map((option) => (
                <div
                  key={option.value}
                  className="flex items-center gap-2 py-2 px-1 cursor-pointer hover:bg-[#ead4aa]/50"
                  onClick={() => {
                    setShowDropdown(false);
                    onChange(option.value as T);
                  }}
                >
                  {option.icon && <img src={option.icon} className="w-5" />}
                  <span className="text-sm">
                    {option.label ?? option.value}
                  </span>
                </div>
              ))}
          </DropdownOptionsPanel>
        </div>
      )}
    </div>
  );
};
