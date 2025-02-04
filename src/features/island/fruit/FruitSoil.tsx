import React, { useContext } from "react";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { Context } from "features/game/GameProvider";
import { SOIL_IMAGES } from "../plots/lib/plant";

const _island = (state: MachineState) => state.context.state.island.type;

export const FruitSoil: React.FC = () => {
  const { gameService } = useContext(Context);
  const island = useSelector(gameService, _island);

  const soilImage = SOIL_IMAGES[island].regular;

  return (
    <div className="absolute w-full h-full cursor-pointer hover:img-highlight">
      <img
        src={soilImage}
        className="absolute pointer-events-none"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
          left: `${PIXEL_SCALE * 8}px`,
          bottom: `${PIXEL_SCALE * 9}px`,
        }}
      />
    </div>
  );
};
