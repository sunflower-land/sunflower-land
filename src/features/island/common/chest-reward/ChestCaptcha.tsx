import React, { useState } from "react";

import { addNoise } from "lib/images";
import { randomBoolean, randomDouble, randomInt } from "lib/utils/random";
import { SUNNYSIDE } from "assets/sunnyside";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  onOpen: () => void;
  onFail: () => void;
}

const ATTEMPTS = 3;

const chests = [SUNNYSIDE.npcs.synced, SUNNYSIDE.decorations.treasure_chest];

const backgrounds = [
  SUNNYSIDE.captcha.background1,
  SUNNYSIDE.captcha.background2,
  SUNNYSIDE.captcha.background3,
  SUNNYSIDE.captcha.background4,
  SUNNYSIDE.captcha.background5,
  SUNNYSIDE.captcha.background6,
  SUNNYSIDE.captcha.background7,
  SUNNYSIDE.captcha.background8,
];

export const ChestCaptcha: React.FC<Props> = ({ onOpen, onFail }) => {
  const [failedCount, setFailedCount] = useState(0);
  const [offsetX] = useState<number>(randomInt(1, 46));
  const [offsetY] = useState<number>(randomInt(1, 46));
  const [isChestOnLeft] = useState<boolean>(randomBoolean());
  const [isChestOnTop] = useState<boolean>(randomBoolean());
  const [rotateX] = useState<number>(randomInt(-15, 16));
  const [rotateY] = useState<number>(randomInt(-15, 16));
  const [skew] = useState<number>(randomInt(-3, 4));
  const [scale] = useState<number>(randomDouble(0.8, 1));
  const [background] = useState<string>(
    backgrounds[randomInt(0, backgrounds.length)],
  );
  const [chest] = useState<string>(chests[randomInt(0, chests.length)]);
  const { t } = useAppTranslation();
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
          src={background}
          onLoad={(e) => addNoise(e.currentTarget, 0.05)}
          className="w-full rounded-md"
        />
        <img
          src={chest}
          className="absolute w-16"
          style={{
            transform: `perspective(9cm) skew(${skew}deg, ${skew}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
            ...(isChestOnTop
              ? { top: `${offsetY}%` }
              : { bottom: `${offsetY}%` }),
            ...(isChestOnLeft
              ? { left: `${offsetX}%` }
              : { right: `${offsetX}%` }),
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
            <img
              key={index}
              src={SUNNYSIDE.icons.cancel}
              className="h-full object-fit mr-2"
            />
          ))}
      </div>

      <span className="text-sm mb-2">{t("statements.chest.captcha")}</span>
    </div>
  );
};
