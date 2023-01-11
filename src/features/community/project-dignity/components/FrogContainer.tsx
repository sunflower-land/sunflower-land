import React from "react";

import frogStatue from "assets/sfts/frogs/frog_statue.png";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Frog, FROG_SIZE } from "../models/frog";
import { FrogComponent } from "./FrogComponent";

interface Props {
  frogs: Frog[];
  farmId: number | undefined;
}

export const FrogContainer: React.FC<Props> = ({ frogs, farmId }) => {
  return (
    <div
      style={{
        width: `${GRID_WIDTH_PX * 8 * 2}px`, // Max 8(7 frogs + 1 statue), each takes 2x grid width
      }}
      className="flex absolute justify-center left-0 top-0"
    >
      {farmId === 143560 && (
        <img
          src={frogStatue}
          className="z-10"
          style={{
            width: `${FROG_SIZE * PIXEL_SCALE}px`,
          }}
        />
      )}
      {frogs.map((frog, index) => (
        <FrogComponent key={index} frog={frog} />
      ))}
    </div>
  );
};
