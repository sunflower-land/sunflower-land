import React, { useContext, useEffect, useState } from "react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Flower } from "./components/Flower";
import { Apicultor } from "./components/Apicultor";
import { FlowerColor, FlowerType } from "features/game/types/game";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { availableFlower } from "features/game/events/harvestHoney";

type Props = {
  positionIndex: number;
};

const positions = [
  { top: 16.5, left: 29 },
  { top: 16.5, left: 20 },
  { top: 25, left: 18.5 },
  { top: 38.5, left: 3.6 },
  { top: 37, left: 30.3 },
  { top: 45, left: 33 },
  { top: 48, left: 96.8 },
  { top: 29, left: 97 },
  { top: 33, left: 61.5 },
  { top: 13, left: 94 },
  { top: 2, left: 88 },
  { top: 3, left: 62 },
  { top: 5, left: 44 },
  { top: 15, left: 39 },
  { top: 20, left: 37.7 },
  { top: 54, left: 17 },
  { top: 44, left: 19 },
  { top: 53, left: 65.5 },
  { top: 45.3, left: 81.75 },
  { top: 35, left: 84.3 },
  { top: 42.3, left: 42 },
  { top: 34, left: 68 },
  { top: 3, left: 51 },
  { top: 2, left: 73 },
  { top: 11, left: 34 },
  { top: 33, left: 14 },
  { top: 49, left: 9 },
  { top: 57, left: 36 },
  { top: 12, left: 89 },
  { top: 15, left: 60 },
];

export const Garden: React.FC = () => {
  const { gameService } = useContext(Context);

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);
  const [flower, setFlower] = useState<FlowerColor | null>(null);
  const [position, setPosition] = useState<any>(null);

  const pollinateFlower = () => {
    //mint egg
    gameService.send("flower.pollinated");
    setFlower(null);
  };

  useEffect(() => {
    // check inventory
    const collectibleFlower = availableFlower();
    if (state.flowers) {
      setFlower(collectibleFlower);
      const randomPosition = Math.floor(Math.random() * 29);
      setPosition(positions[randomPosition]);
    }
  }, [state.inventory]);

  if (!state.inventory["Bee Hive"]) {
    return null;
  }

  return (
    <div
      id="garden"
      style={
        {
          // left: `calc(50% + ${GRID_WIDTH_PX * 20}px)`,
          // top: `calc(50% +  ${GRID_WIDTH_PX * 5}px)`,
        }
      }
      className="absolute w-full h-full top-0 left-0   "
    >
      <div className="relative ">
        <Flower
        flowerSrc="none"
          flowerIndex={0}
          flowerPosX={GRID_WIDTH_PX * position?.top}
          flowerPosY={GRID_WIDTH_PX * position?.left}
        />
      </div>
      {/* <div
          className="absolute"
          style={{
            height: `${GRID_WIDTH_PX * 1.5}px`,
            width: `${GRID_WIDTH_PX * 1.5}px`,
            left: `${GRID_WIDTH_PX * -1.75}px`,
            top: `${GRID_WIDTH_PX * -3.65}px`,
          }}
        >
          <Flower flowerIndex={1} flowerPosX={position?.top} flowerPosY={position?.left} />
        </div>

        <div
          className="absolute"
          style={{
            height: `${GRID_WIDTH_PX * 1.5}px`,
            width: `${GRID_WIDTH_PX * 1.5}px`,
            left: `${GRID_WIDTH_PX * -1.75}px`,
            top: `${GRID_WIDTH_PX * 0.5}px`,
          }}
        >
          <Flower flowerIndex={2} flowerPosX={position?.top} flowerPosY={position?.left} />
        </div>

        <div
          className="absolute"
          style={{
            height: `${GRID_WIDTH_PX * 1.5}px`,
            width: `${GRID_WIDTH_PX * 1.5}px`,
            left: `${GRID_WIDTH_PX * -6.85}px`,
            top: `${GRID_WIDTH_PX * 0.5}px`,
          }}
        >
          <Flower flowerIndex={3} flowerPosX={position?.top} flowerPosY={position?.left} />
        </div>  */}
    </div>
  );
};
