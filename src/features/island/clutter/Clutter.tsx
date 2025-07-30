import React, { useContext } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ClutterName } from "features/game/types/clutter";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";

interface Props {
  id: string;
  type: ClutterName;
}

export const Clutter: React.FC<Props> = ({ id, type }) => {
  const { gameService } = useContext(Context);
  const dailyCollections =
    gameService.getSnapshot().context.visitorState?.socialFarming
      ?.dailyClutterCollections;
  const isCollected =
    dailyCollections?.[gameService.state.context.farmId]?.[id];

  if (isCollected) {
    return null;
  }

  const collectClutter = () => {
    gameService.send("clutter.collected", {
      id,
      visitedFarmId: gameService.state.context.farmId,
      clutterType: type,
    });
  };

  return (
    <>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight flex items-center justify-center"
        onClick={collectClutter}
      >
        <img
          src={ITEM_DETAILS[type].image}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 10}px`,
          }}
        />
      </div>
    </>
  );
};
