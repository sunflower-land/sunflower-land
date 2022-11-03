import React from "react";

import idle from "assets/npcs/moonseeker_full_sheet.png";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "../lib/constants";
import Spritesheet, {
  SpriteSheetInstance,
} from "components/animation/SpriteAnimator";
const MOON_SEEKER_POSITIONS: { x: number; y: number }[] = [
  {
    x: 10,
    y: 10,
  },
  {
    x: 18,
    y: 5,
  },
  {
    x: 26,
    y: 8,
  },
  {
    x: 33,
    y: 7,
  },
  {
    x: 45,
    y: 2,
  },
  {
    x: 56,
    y: 8,
  },
  {
    x: 66,
    y: 5,
  },
  {
    x: 72,
    y: 6,
  },
  {
    x: 80,
    y: 3,
  },
  {
    x: 89,
    y: 12,
  },
  {
    x: 36,
    y: 30,
  },
  {
    x: 3,
    y: 14,
  },
  {
    x: 2,
    y: 22,
  },
  {
    x: 22,
    y: 18,
  },
  {
    x: 26,
    y: 19,
  },
  {
    x: 34,
    y: 15,
  },
  {
    x: 40,
    y: 13,
  },
  {
    x: 50,
    y: 22,
  },
  {
    x: 55,
    y: 25,
  },
  {
    x: 65,
    y: 16,
  },
  {
    x: 72,
    y: 15,
  },
  {
    x: 80,
    y: 18,
  },
  {
    x: 86,
    y: 20,
  },
  {
    x: 95,
    y: 21,
  },
  {
    x: 5,
    y: 28,
  },
  {
    x: 12,
    y: 26,
  },
  {
    x: 22,
    y: 26,
  },
  {
    x: 29,
    y: 25,
  },
  {
    x: 34,
    y: 27,
  },
  {
    x: 44,
    y: 25,
  },
  {
    x: 57,
    y: 29,
  },
  {
    x: 64,
    y: 24,
  },
  {
    x: 69,
    y: 26,
  },
  {
    x: 79,
    y: 26,
  },
  {
    x: 89,
    y: 25,
  },
  {
    x: 97,
    y: 27,
  },
  {
    x: 6,
    y: 36,
  },
  {
    x: 22,
    y: 36,
  },
  {
    x: 27,
    y: 33,
  },
  {
    x: 31,
    y: 35,
  },
  {
    x: 42,
    y: 35,
  },
  {
    x: 45,
    y: 37,
  },
  {
    x: 48,
    y: 36,
  },
  {
    x: 51,
    y: 37.5,
  },
  {
    x: 55,
    y: 34.5,
  },
  {
    x: 60,
    y: 34,
  },
  {
    x: 70,
    y: 37,
  },
  {
    x: 77,
    y: 34,
  },
  {
    x: 84,
    y: 30,
  },
  {
    x: 90,
    y: 37,
  },
  {
    x: 88,
    y: 39,
  },
  {
    x: 94,
    y: 40,
  },
];

const MoonSeeker: React.FC = () => {
  return (
    <Spritesheet
      className="cursor-pointer absolute left-0 bottom-0"
      onClick={(spritesheet: SpriteSheetInstance) => {
        spritesheet.goToAndPlay(7);
      }}
      style={{
        width: `${PIXEL_SCALE * 17}px`,

        imageRendering: "pixelated",
      }}
      image={idle}
      widthFrame={18}
      heightFrame={17}
      endAt={6}
      fps={11}
      steps={13}
      direction={`forward`}
      autoplay={true}
      loop={true}
    />
  );
};

const start = new Date("2022-11-01");
const takeOverDays = 21;

function getCountToShow(total: number) {
  try {
    const daysPassed = (Date.now() - start.getTime()) / (24 * 60 * 60 * 1000);
    const percentage = (daysPassed / takeOverDays) * 100;
    return Math.ceil((total / 100) * percentage);
  } catch {
    return 20;
  }
}
export const MoonSeekers: React.FC = () => {
  // TODO - base on time
  const seekers = MOON_SEEKER_POSITIONS;

  const invaders = seekers.slice(0, getCountToShow(seekers.length));
  return (
    <>
      {invaders.map((position, index) => (
        <div
          className="absolute"
          key={index}
          style={{
            left: `${GRID_WIDTH_PX * position.x}px`,
            top: `${GRID_WIDTH_PX * position.y}px`,
            width: `${GRID_WIDTH_PX}px`,
            transform: `scaleX(${index % 2 === 0 ? 1 : -1})`,
          }}
        >
          <MoonSeeker />
        </div>
      ))}
    </>
  );
};
