import React, { useEffect, useRef, useState } from "react";
import sharkRight from "assets/animals/shark-right.gif";
import sharkLeft from "assets/animals/shark-left.gif";
import { randomInt } from "lib/utils/random";

const blankPng =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const imageSources = [sharkLeft, blankPng, sharkRight, blankPng];

const getSharkPosition = () => {
  const randomLeft = randomInt(0, 74);
  const randomTop = randomInt(0, 91);
  return { top: randomTop, left: randomLeft };
};

const Shark = () => {
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
    timer.current = setInterval(renderSharkPosition, randomInt(60000, 90000));

    return () => clearInterval(timer.current);
  }, []);

  return (
    <div
      className="absolute top-1/2 -translate-y-20 w-full"
      style={{
        height: "280px",
        left: "280px",
        width: "calc(100% - 390px)",
      }}
    >
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
