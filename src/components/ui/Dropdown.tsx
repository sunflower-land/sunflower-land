import React, { useState, useRef, useEffect } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import classNames from "classnames";
import { PIXEL_SCALE } from "features/game/lib/constants";

import bg from "assets/ui/input_box_border.png";
import activeBg from "assets/ui/active_input_box_border.png";

interface DropdownProps {
  options: string[];
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
  initialIndex?: number;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  className = "",
  disabled = false,
  initialIndex = 0,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedValue, setSelectedValue] = useState(options[initialIndex]);

  // Initialize with either provided value or initial index value
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (newValue: string) => {
    setSelectedValue(newValue);
    onChange(newValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        tabIndex={0}
        style={{
          borderImageRepeat: "stretch",
          borderStyle: "solid",
          borderImage: `url(${isFocused || isOpen ? activeBg : bg})`,
          borderWidth: `${PIXEL_SCALE * 4}px`,
          borderImageSlice: isFocused || isOpen ? "4 fill" : "4 4 4 4 fill",
          padding: 0,
          imageRendering: "pixelated",
          outline: "none",
        }}
        className={classNames(
          "!bg-transparent cursor-pointer w-full p-2 h-10 font-secondary flex items-center justify-between",
          {
            "opacity-50 cursor-not-allowed": disabled,
          },
        )}
      >
        <span>{selectedValue}</span>
        <img
          src={SUNNYSIDE.icons.chevron_down}
          alt="dropdown"
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && !disabled && (
        <div
          className="absolute w-full z-50 mt-1"
          style={{
            borderImageRepeat: "stretch",
            borderStyle: "solid",
            borderImage: `url(${bg})`,
            borderWidth: `${PIXEL_SCALE * 4}px`,
            borderImageSlice: "4 4 4 4 fill",
            imageRendering: "pixelated",
          }}
        >
          <div
            className="max-h-48 overflow-y-auto scrollable"
            style={{ scrollbarWidth: "thin" }}
          >
            {options.map((option) => (
              <div
                key={option}
                className={classNames(
                  "p-2 cursor-pointer font-secondary hover:brightness-110",
                  {
                    "bg-blue-500 text-white": option === selectedValue,
                  },
                )}
                onClick={() => handleChange(option)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
