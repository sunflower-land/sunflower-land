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
  placeholder?: string;
  maxHeight?: number;
  showSearch?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  className = "",
  disabled = false,
  initialIndex,
  placeholder = "Select an option",
  maxHeight = 14,
  showSearch = false,
}) => {
  const isControlled = value !== undefined;
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [internalValue, setInternalValue] = useState<string | undefined>(() => {
    if (isControlled) return undefined;

    if (
      initialIndex !== undefined &&
      initialIndex >= 0 &&
      initialIndex < options.length
    ) {
      return options[initialIndex];
    }

    return undefined;
  });

  const selectedValue = isControlled ? value : internalValue;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsFocused(false);
        // Clear search when closing dropdown if no value is selected
        if (!selectedValue) {
          setSearchTerm("");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedValue]);

  const handleChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }

    onChange(newValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const filteredOptions = options
    .filter((option) => option.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      // If option matches searchTerm exactly (case insensitive), put it first
      if (a.toLowerCase() === searchTerm.toLowerCase()) return -1;
      if (b.toLowerCase() === searchTerm.toLowerCase()) return 1;
      return 0;
    });

  return (
    <div
      className={classNames(
        "relative",
        !className?.match(/\bw-/g) && "w-full",
        className,
      )}
      ref={dropdownRef}
    >
      <div
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
          "!bg-transparent w-full p-2 h-10 font-secondary flex items-center justify-between cursor-pointer",
          {
            "opacity-50 cursor-not-allowed": disabled,
            "text-gray-500": !selectedValue,
          },
        )}
      >
        {showSearch ? (
          <input
            type="text"
            value={isOpen ? searchTerm : selectedValue || ""}
            onChange={handleInputChange}
            onClick={handleInputClick}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full bg-transparent outline-none cursor-text font-secondary"
            disabled={disabled}
          />
        ) : (
          <span onClick={() => !disabled && setIsOpen(!isOpen)}>
            {selectedValue || placeholder}
          </span>
        )}
        <img
          src={SUNNYSIDE.icons.chevron_down}
          alt="dropdown"
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""} cursor-pointer`}
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) {
              setIsOpen(!isOpen);
              setSearchTerm("");
            }
          }}
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
            className="overflow-y-auto scrollable"
            style={{ maxHeight: `${maxHeight * 4}rem` }}
          >
            {filteredOptions.map((option) => (
              <div
                key={option}
                className={classNames(
                  "p-2 cursor-pointer font-secondary hover:brightness-110",
                  {
                    "bg-[#e4a672]": option === selectedValue,
                  },
                )}
                onClick={() => handleChange(option)}
              >
                {option}
              </div>
            ))}
            {filteredOptions.length === 0 && (
              <div className="p-2 text-gray-500 font-secondary">
                {`No options found`}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
