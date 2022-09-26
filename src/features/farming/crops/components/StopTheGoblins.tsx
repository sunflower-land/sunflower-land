import React, { useState } from "react";
import { ITEM_DETAILS } from "features/game/types/images";
import { RandomID } from "lib/images";

import cancel from "assets/icons/cancel.png";
import confirm from "assets/icons/confirm.png";
import { CROPS } from "features/game/types/crops";
import { getKeys } from "features/game/types/craftables";

import goblin1 from "assets/npcs/goblin.gif";
import goblin2 from "assets/npcs/goblin_carry.gif";
import goblin3 from "assets/npcs/goblin_chef.gif";
import goblin4 from "assets/npcs/goblin_female.gif";
import goblin5 from "assets/npcs/goblin_doing.gif";
import classNames from "classnames";

const ITEM_COUNT = 16;
const MAX_ATTEMPTS = 3;
const GOBLIN_COUNT = 3;

function getRndInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

type Item = {
  src: string;
  id: string;
  isGoblin: boolean;
  rotation: { x: number; y: number };
  skew: number;
};

const GOBLINS = [goblin1, goblin2, goblin3, goblin4, goblin5];

function generateImages() {
  const items: Item[] = [];
  const cropImages = getKeys(CROPS());
  const availableImages = cropImages.map((name) => ITEM_DETAILS[name].image);

  while (items.length < GOBLIN_COUNT) {
    const randomIndex = Math.floor(Math.random() * GOBLINS.length);

    items.push({
      src: GOBLINS[randomIndex],
      id: RandomID(),
      isGoblin: true,
      rotation: {
        x: getRndInteger(-15, 15),
        y: getRndInteger(-15, 15),
      },
      skew: getRndInteger(0, 5),
    });
  }

  while (items.length < ITEM_COUNT) {
    const randomIndex = Math.floor(Math.random() * availableImages.length);

    items.push({
      src: availableImages[randomIndex],
      id: RandomID(),
      isGoblin: false,
      rotation: {
        x: getRndInteger(-15, 25),
        y: getRndInteger(-15, 25),
      },
      skew: getRndInteger(0, 5),
    });
  }

  // Shuffle
  const shuffled = items.sort(() => 0.5 - Math.random());

  return shuffled;
}

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
      setCorrectAttempts((prev) => new Set([...prev, index]));

      if (correctAttempts.size === GOBLIN_COUNT - 1) {
        onOpen();
      }

      return;
    }

    setWrongAttempts((prev) => new Set([...prev, index]));

    if (attemptsLeft <= 1) {
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
                  id={item.id}
                  className="h-full object-contain group-hover:img-highlight "
                  style={{
                    transform: `perspective(9cm) skew(${item.skew}deg, ${item.skew}deg) rotateX(${item.rotation.x}deg) rotateY(${item.rotation.y}deg)`,
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
