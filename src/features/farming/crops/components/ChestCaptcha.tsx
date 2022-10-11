import React, { useRef, useState } from "react";

import background1 from "assets/captcha/chest_background_1.png";
import background2 from "assets/captcha/chest_background_2.png";
import background3 from "assets/captcha/chest_background_3.png";
import background4 from "assets/captcha/chest_background_4.png";
import background5 from "assets/captcha/chest_background_5.png";
import background6 from "assets/captcha/chest_background_6.png";

import secure from "assets/npcs/synced.gif";
import cancel from "assets/icons/cancel.png";

import { addNoise } from "lib/images";
import { randomBoolean, randomDouble, randomInt } from "lib/utils/random";

interface Props {
  onOpen: () => void;
  onFail: () => void;
}

const ATTEMPTS = 3;

const backgrounds = [
  background1,
  background2,
  background3,
  background4,
  background5,
  background6,
];

export const ChestCaptcha: React.FC<Props> = ({ onOpen, onFail }) => {
  const [failedCount, setFailedCount] = useState(0);
  const offsetX = useRef(randomInt(1, 46));
  const offsetY = useRef(randomInt(1, 46));
  const isChestOnLeft = useRef(randomBoolean());
  const isChestOnTop = useRef(randomBoolean());
  const rotateX = useRef(randomInt(-15, 16));
  const rotateY = useRef(randomInt(-15, 16));
  const skew = useRef(randomInt(-3, 4));
  const scale = useRef(randomDouble(0.8, 1));
  const background = useRef(backgrounds[randomInt(0, backgrounds.length)]);

  const miss = () => {
    setFailedCount((prev) => prev + 1);

    if (failedCount + 1 >= ATTEMPTS) {
      onFail();
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-between w-full cursor-pointer"
      onClick={miss}
    >
      <div className="relative w-full rounded-md">
        <img
          src={background.current}
          onLoad={(e) => addNoise(e.currentTarget, 0.05)}
          className="w-full rounded-md"
        />
        <img
          src={secure}
          className="absolute w-16"
          style={{
            transform: `perspective(9cm) skew(${skew.current}deg, ${skew.current}deg) rotateX(${rotateX.current}deg) rotateY(${rotateY.current}deg) scale(${scale.current})`,
            ...(isChestOnTop.current
              ? { top: `${offsetY.current}%` }
              : { bottom: `${offsetY.current}%` }),
            ...(isChestOnLeft.current
              ? { left: `${offsetX.current}%` }
              : { right: `${offsetX.current}%` }),
          }}
          onLoad={(e) => addNoise(e.currentTarget)}
          onClick={(e) => {
            e.stopPropagation();
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
