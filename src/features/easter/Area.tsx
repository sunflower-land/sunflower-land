import * as React from "react";
import red from "src/assets/nfts/easter/red_egg.gif";
import yellow from "src/assets/nfts/easter/yellow_egg.gif";
import purple from "src/assets/nfts/easter/purple_egg.gif";
import blue from "src/assets/nfts/easter/blue_egg.gif";
import green from "src/assets/nfts/easter/green_egg.gif";
import orange from "src/assets/nfts/easter/orange_egg.gif";
import pink from "src/assets/nfts/easter/pink_egg.gif";

import { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";
import { Context } from "features/game/GameProvider";

type Props = {
  positionIndex: number;
};

const eggList = [
  { src: red, name: "Red Easter Egg" },
  { src: yellow, name: "Yellow Easter Egg" },
  { src: purple, name: "Purple Easter Egg" },
  { src: blue, name: "Blue Easter Egg" },
  { src: green, name: "Green Easter Egg" },
  { src: orange, name: "Orange Easter Egg" },
  { src: pink, name: "Pink Easter Egg" },
];

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

export const Area = (props: Props) => {
  const { gameService } = useContext(Context);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [currentEggSource, setCurrentEggSource] = useState(red);

  const fourHours = 1000 * 60 * 60 * 4;
  let startDateTime = new Date(Date.UTC(2022, 3, 12, 12));

  let periods: { egg: string; time: Date }[] = [];
  let eggIndexTemp = 0;

  for (
    let time = startDateTime;
    time < new Date(Date.UTC(2022, 3, 25, 12));
    time = new Date(time.getTime() + fourHours)
  ) {
    // @ts-ignore
    if (new Date() > periods[periods.length - 1] && new Date() < time) {
      setCurrentIteration(currentIteration + 1);
    }
    periods.push({ time, egg: eggList[eggIndexTemp].name });

    if (eggIndexTemp < 6) {
      eggIndexTemp++;
    } else {
      eggIndexTemp = 0;
    }
  }

  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const { positionIndex } = props;
  const [position, setPosition] = useState<any>(null);
  const [eggIndex, setEggIndex] = useState(0);

  const mintEgg = () => {
    //mint egg
  };

  useEffect(() => {
    // check inventory

    setCurrentEggSource(
      eggList.find((item) => item.name === periods[currentIteration].egg)?.src
    );

    // check period egg and inventory
    if (state.inventory[eggList[currentIteration].name]) {
      setPosition(null);
    } else {
      setPosition(positions[positionIndex]);
    }
  }, []);

  console.log(position, currentEggSource);

  console.log(periods);

  return (
    <div className="w-full h-full absolute top-0 left-0">
      <img
        src={currentEggSource}
        alt=""
        onClick={() => mintEgg()}
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
