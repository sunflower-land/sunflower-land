import React, { useState } from "react";
import { ITEM_DETAILS } from "features/game/types/images";
import { addNoise } from "lib/images";

import cancel from "assets/icons/cancel.png";
import confirm from "assets/icons/confirm.png";
import { CROPS } from "features/game/types/crops";
import { getKeys } from "features/game/types/craftables";

import goblin1 from "assets/npcs/goblin.gif";
import goblin2 from "assets/npcs/goblin_carry.gif";
import goblin3 from "assets/npcs/goblin_chef.gif";
import goblin4 from "assets/npcs/goblin_doing.gif";
import goblin5 from "assets/npcs/goblin_farmer.gif";
import goblin6 from "assets/npcs/goblin_female.gif";
import goblin7 from "assets/npcs/wheat_goblin.gif";
import classNames from "classnames";
import { randomDouble, randomInt } from "lib/utils/random";

const ITEM_COUNT = 16;
const MAX_ATTEMPTS = 3;
const GOBLIN_COUNT = 3;

type Item = {
  src: string;
  isGoblin: boolean;
  rotation: { x: number; y: number };
  skew: number;
  scale: number;
};

const GOBLINS = [goblin1, goblin2, goblin3, goblin4, goblin5, goblin6, goblin7];

const generateImages = () => {
  const newImageItem = (src: any, isGoblin: boolean): Item => {
    return {
      src: src,
      isGoblin: isGoblin,
      rotation: {
        x: randomInt(-25, 26),
        y: randomInt(-25, 26),
      },
      skew: randomInt(-5, 6),
      scale: randomDouble(1.0, 1.2),
    };
  };

  const items: Item[] = [];
  const cropImages = getKeys(CROPS());
  const availableCropImages = cropImages.map(
    (name) => ITEM_DETAILS[name].image
  );

  while (items.length < GOBLIN_COUNT) {
    const randomIndex = randomInt(0, GOBLINS.length);
    items.push(newImageItem(GOBLINS[randomIndex], true));
  }

  while (items.length < ITEM_COUNT) {
    const randomIndex = randomInt(0, availableCropImages.length);
    items.push(newImageItem(availableCropImages[randomIndex], false));
  }

  // shuffle positions
  const shuffled = items.sort(() => 0.5 - Math.random());
  return shuffled;
};

interface Props {
  onOpen: () => void;
  onFail: () => void;
}

export const StopTheGoblins: React.FC<Props> = ({ onOpen, onFail }) => {
  const [wrongAttempts, setWrongAttempts] = useState(new Set<number>());
  const [correctAttempts, setCorrectAttempts] = useState(new Set<number>());
  const [items] = useState(generateImages());

  const attemptsLeft = MAX_ATTEMPTS - wrongAttempts.size;

  const check = (index: number) => {
    if (items[index].isGoblin) {
      const _correctAttempts = new Set([...correctAttempts, index]);
      setCorrectAttempts(_correctAttempts);

      if (_correctAttempts.size === GOBLIN_COUNT) {
        onOpen();
      }

      return;
    }

    const _wrongAttempts = new Set([...wrongAttempts, index]);
    setWrongAttempts(_wrongAttempts);

    if (_wrongAttempts.size >= MAX_ATTEMPTS) {
      onFail();
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <span className="text-center mb-2">Stop the Goblins!</span>
      <div className="flex flex-wrap justify-center items-center">
        {items.map((item, index) => {
          const failed = wrongAttempts.has(index);
          const confirmed = correctAttempts.has(index);

          return (
            <div
              key={index}
              className="w-1/4 h-12 flex justify-center items-center p-1 mb-1 cursor-pointer group"
              onClick={() => check(index)}
            >
              {failed || confirmed ? (
                <img
                  src={failed ? cancel : confirm}
                  className="h-full object-contain"
                />
              ) : (
                <img
                  src={item.src}
                  className="h-full object-contain"
                  onLoad={(e) => addNoise(e.currentTarget)}
                  style={{
                    transform: `perspective(9cm) skew(${item.skew}deg, ${item.skew}deg) rotateX(${item.rotation.x}deg) rotateY(${item.rotation.y}deg) scale(${item.scale})`,
                  }}
                />
              )}
            </div>
          );
        })}
        <span className="text-sm mt-2 text-center">
          Tap the Goblins before they eat your crops
        </span>

        <span
          className={classNames("text-xs mt-2 underline", {
            "text-red-500": attemptsLeft <= 2,
          })}
        >{`Attempts left: ${attemptsLeft}`}</span>
      </div>
    </div>
  );
};
