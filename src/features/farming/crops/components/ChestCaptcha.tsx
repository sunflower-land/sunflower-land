import React, { useLayoutEffect, useRef, useState } from "react";

import background from "assets/captcha/chest_background_2.png";
import background2 from "assets/captcha/chest_background_3.png";

import secure from "assets/npcs/synced.gif";
import cancel from "assets/icons/cancel.png";

import { addNoise, RandomID } from "lib/images";

interface Props {
  onOpen: () => void;
  onFail: () => void;
}

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const ATTEMPTS = 3;

export const ChestCaptcha: React.FC<Props> = ({ onOpen, onFail }) => {
  const [failedCount, setFailedCount] = useState(0);
  const offset = useRef(randomIntFromInterval(0, 80));
  const skew = useRef(randomIntFromInterval(-3, 3));
  const id = useRef(RandomID());

  useLayoutEffect(() => {
    addNoise(id.current);
  }, []);

  const miss = () => {
    setFailedCount((prev) => prev + 1);

    if (failedCount + 1 >= ATTEMPTS) {
      onFail();
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-betweenh-full w-full"
      onClick={miss}
    >
      <div className="flex items-center  py-4 w-full relative overflow-hidden rounded-md px-4">
        <img
          // Alternate between backgrounds
          src={skew.current > 0 ? background : background2}
          className="w-full absolute inset-0"
        />
        <img
          src={secure}
          id={id.current}
          className="w-16 hover:img-highlight cursor-pointer"
          style={{
            transform: `perspective(9cm) skew(${skew.current}deg, ${skew.current}deg) rotateX(${skew.current}deg) rotateY(${skew.current}deg)`,
            marginLeft: `${offset.current}%`,
          }}
          onClick={(e) => {
            e.preventDefault();
            onOpen();
          }}
        />
      </div>

      <div className="h-6 flex justify-center items-center mb-2 mt-1">
        {Array(failedCount)
          .fill(null)
          .map((_, index) => (
            <img key={index} src={cancel} className="h-full object-fit mr-2" />
          ))}
      </div>

      <span className="text-sm">Tap the chest to open it</span>
    </div>
  );
};
