import * as React from "react";

import { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { EasterEgg } from "features/game/types/game";
import { availableEgg } from "features/game/events/collectEgg";
import { ITEM_DETAILS } from "features/game/types/images";

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

export const EasterEggHunt: React.FC = () => {
  const { gameService } = useContext(Context);

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const [egg, setEgg] = useState<EasterEgg | null>(null);

  const [position, setPosition] = useState<any>(null);

  const mintEgg = () => {
    //mint egg
    gameService.send("easterEgg.collected");
    setEgg(null);
  };

  useEffect(() => {
    // check inventory
    const collectibleEgg = availableEgg();
    if (!state.inventory[collectibleEgg] && state.inventory["Egg Basket"]) {
      setEgg(collectibleEgg);
      const randomPosition = Math.floor(Math.random() * 29);
      setPosition(positions[randomPosition]);
    }
  }, [state.inventory]);

  if (!egg) {
    return null;
  }

  return (
    <div className="w-full h-full absolute top-0 left-0">
      <img
        src={ITEM_DETAILS[egg].image}
        alt=""
        onClick={mintEgg}
        className="hover:img-highlight cursor-pointer"
        style={{
          position: "absolute",
          top: `${position?.top}%`,
          left: `${position?.left}%`,
          width: "20px",
          zIndex: 100,
        }}
      />
    </div>
  );
};
