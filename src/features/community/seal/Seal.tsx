import React from "react";

import { SealModal } from "features/community/seal/SealModal";

import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { randomInt } from "lib/utils/random";

import seal_1 from "features/community/assets/seals/1.png";
import seal_2 from "features/community/assets/seals/2.png";
import seal_3 from "features/community/assets/seals/3.png";
import seal_4 from "features/community/assets/seals/4.png";
import seal_5 from "features/community/assets/seals/5.png";
import seal_6 from "features/community/assets/seals/6.png";
import seal_7 from "features/community/assets/seals/7.png";
import seal_8 from "features/community/assets/seals/8.png";
import seal_9 from "features/community/assets/seals/9.png";
import seal_10 from "features/community/assets/seals/10.png";

const imgSeals = [
  seal_1,
  seal_2,
  seal_3,
  seal_4,
  seal_5,
  seal_6,
  seal_7,
  seal_8,
  seal_9,
  seal_10,
];

const getRandomSeal = () => {
  const randomSeal = randomInt(0, 10);
  return imgSeals[randomSeal];
};

const getShowSealRandom = () => {
  const showSeal = randomInt(0, 5); // 5 is exclusive
  return showSeal === 1; // [0, 1, 2, 3] = 1 is 25% of the time;
};

interface Props {
  left: number;
  top: number;
}

export const LostSeal: React.FC<Props> = ({ left, top }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const sealImg = getRandomSeal();
  const showSeal = getShowSealRandom();

  return (
    <div
      className="absolute"
      style={{
        width: `${GRID_WIDTH_PX * 4}px`,
        height: `${GRID_WIDTH_PX * 4}px`,
        left: `${GRID_WIDTH_PX * left}px`,
        top: `${GRID_WIDTH_PX * top}px`,
      }}
    >
      <div className="relative">
        <img
          id="seal"
          src={sealImg}
          className="relative hover:cursor-pointer hover:img-highlight"
          style={{
            width: `${PIXEL_SCALE * 28}px`,
            display: showSeal ? "block" : "none",
          }}
          onClick={() => setIsOpen(true)}
        />
      </div>

      {isOpen && (
        <SealModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          sealImg={sealImg}
        />
      )}
    </div>
  );
};
