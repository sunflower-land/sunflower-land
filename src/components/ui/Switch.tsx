import React, { useState } from "react";

import TurnOn from "assets/ui/toggle/turn_on.png";
import TurnOff from "assets/ui/toggle/turn_off.png";

interface Props {
  value: boolean;
  onChange: (value: boolean) => void;
}

export const Switch: React.FC<Props> = ({ value, onChange }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative w-12 h-6 cursor-pointer"
      onClick={() => onChange(!value)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={value ? TurnOff : TurnOn}
        className="absolute top-0 left-0 w-12 h-6"
      />
      <div
        className={`absolute top-0 left-0 w-12 h-6 ${
          isHovered ? "bg-gray-300 bg-opacity-40" : ""
        }`}
      />
    </div>
  );
};
