import * as React from "react";

import { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { EasterEgg, FlowerColor } from "features/game/types/game";
import { availableEgg } from "features/game/events/collectEgg";
import { ITEM_DETAILS } from "features/game/types/images";
import { Flower } from "./components/Flower";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { availableFlower } from "features/game/events/harvestHoney";

type Props = {
  positionIndex: number;
};

const positions = [
  { top: 6.5, left: 9 },
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

  const mintEgg = () => {
    //mint egg
    gameService.send("easterEgg.collected");
    setFlower(null);
  };

  useEffect(() => {
    // check inventory
    const collectibleFlower = availableFlower();
    if (true) {
      setFlower(collectibleFlower);
      const randomPosition = Math.floor(Math.random() * 29);
      setPosition(positions[randomPosition]);
    }
  }, [state.inventory]);

  if (!flower) {
    return null;
  }

  return (
    <div className="w-full h-full relative top-0 left-0 z-0" style={{width:"50%" , height:"50%"}}>
      {/* <img
        src={ITEM_DETAILS[flower].image}
        alt=""
        onClick={mintEgg}
        className="hover:img-highlight cursor-pointer"
        style={{
          position: "absolute",
          top: `${position?.top}%`,
          left: `${position?.left}%`,
          width: "100px",
          background: "red",
          zIndex: 100,
        }}
      /> */}

      {/* <Flower
        flowerSrc={ITEM_DETAILS[flower].image}
        flowerIndex={0}
        flowerPosX={GRID_WIDTH_PX * position?.top }
        flowerPosY={GRID_WIDTH_PX * position?.left}
      /> */}
    </div>
  );
};
