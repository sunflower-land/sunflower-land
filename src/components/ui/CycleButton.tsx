import React, { useState } from "react";
import { Button } from "./Button";

interface CycleButtonProps {
  options: string[];
  onChange: (selectedOption: string) => void;
  className?: string;
}

const CycleButton: React.FC<CycleButtonProps> = ({
  options,
  onChange,
  className,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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
