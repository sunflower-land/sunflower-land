import React, { useContext } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { ClutterName } from "features/game/types/clutter";
import { ITEM_DETAILS } from "features/game/types/images";
import { Context } from "features/game/GameProvider";

interface Props {
  id: string;
  isFirstRender: boolean;
  type: ClutterName;
}

export const Clutter: React.FC<Props> = ({ id, type }) => {
  const { gameService } = useContext(Context);

  const collectClutter = () => {
    gameService.send("clutter.collected", {
      id,
      visitorId: gameService.state.context.farmId,
    });
    gameService.send("SAVE");
  };

  return (
    <>
      <div
        className="relative w-full h-full cursor-pointer hover:img-highlight flex items-center justify-center"
        onClick={() => collectClutter()}
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
