import React, { useEffect, useRef, useState } from "react";
import sharkRight from "assets/animals/shark-right.gif";
import sharkLeft from "assets/animals/shark-left.gif";
import { randomBetweenMaxInclusive } from "../../lib/randomBetweenMaxInclusive";

const blankPng =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const imageSources = [sharkLeft, blankPng, sharkRight, blankPng];

const getSharkPosition = () => {
  const randomLeft = randomBetweenMaxInclusive(0, 73);
  const randomTop = randomBetweenMaxInclusive(0, 90);
  return { top: randomTop, left: randomLeft };
};

interface Props {
  side?: string;
}

const Shark: React.FC<Props> = ({ side }) => {
  const timer = useRef<any>(null);
  const [position, setPosition] = useState(getSharkPosition());
  const [imageSourceIndex, setImageSourceIndex] = useState<number>(1);

  const renderSharkPosition = () => {
    setPosition(getSharkPosition());
  };

  const handleImageSourceIndex = () => {
    const isLastSourceIndex = imageSourceIndex === 3;
    const nextIndex = imageSourceIndex + 1;
    isLastSourceIndex ? setImageSourceIndex(0) : setImageSourceIndex(nextIndex);
  };

  useEffect(() => {
    handleImageSourceIndex();
  }, [position]);

  useEffect(() => {
    timer.current = setInterval(
      renderSharkPosition,
      randomBetweenMaxInclusive(60000, 90000)
    );

    return () => clearInterval(timer.current);
  }, []);

  return (
    <div className={`absolute ${side}-0 h-2/5 w-full`}>
      <img
        className="absolute"
        src={imageSources[imageSourceIndex]}
        alt="shark"
        style={{
          top: `${position.top}%`,
          left: `${position.left}%`,
        }}
      />
    </div>
  );
};

export default Shark;
