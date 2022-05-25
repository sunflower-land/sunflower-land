import { useActor } from "@xstate/react";
import React, { useContext } from "react";

import chickenImg from "assets/resources/chicken.png";
import { Context } from "features/game/GameProvider";
import { eggIsReady } from "features/game/events/collectEgg";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

interface Props {
  index: number;
}
export const Chicken: React.FC<Props> = ({ index }) => {
  const { gameService } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const feed = () => {
    gameService.send("chicken.feed", {
      index,
    });
  };

  const collectEgg = () => {
    gameService.send("chicken.collectEgg", {
      index,
    });
  };

  const chicken = state.chickens[index];
  const isReadyToCollect = chicken && eggIsReady(chicken);

  return (
    <div
      style={{
        width: `${GRID_WIDTH_PX * 1}px`,
      }}
    >
      {isReadyToCollect && (
        <img
          src={chickenImg}
          className="w-full cursor-pointer  hover:img-highlight opacity-50"
          onClick={collectEgg}
        />
      )}
      {!chicken && (
        <img
          src={chickenImg}
          className="w-full cursor-pointer hover:img-highlight"
          onClick={feed}
        />
      )}
    </div>
  );
};
