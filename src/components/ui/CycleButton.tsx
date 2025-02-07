import React, { useState } from "react";
import { Button } from "./Button";

interface CycleButtonProps {
  options: string[];
  onChange: (selectedOption: string) => void;
  className?: string;
  initialIndex?: number;
}

const CycleButton: React.FC<CycleButtonProps> = ({
  options,
  onChange,
  className,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleClick = () => {
    const nextIndex = (currentIndex + 1) % options.length;
    setCurrentIndex(nextIndex);
    onChange(options[nextIndex]);
  };

  return (
    <Button className={className} onClick={handleClick}>
      {options[currentIndex]}
    </Button>
  );
};

export default CycleButton;
