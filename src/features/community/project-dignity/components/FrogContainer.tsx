import React from "react";

import frogStatue from "assets/sfts/frogs/frog_statue.png";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";
import { Frog, FROG_SIZE } from "../models/frog";
import { FrogComponent } from "./FrogComponent";

interface Props {
  frogs: Frog[];
  farmId: number | undefined;
  position?: { left: string; top: string };
}

export const FrogContainer: React.FC<Props> = ({ frogs, farmId, position }) => {
  if (!position) {
    position = {
      left: `${GRID_WIDTH_PX * 12}px`,
      top: `${GRID_WIDTH_PX * 2.2}px`,
    };
  }

  return (
    <div
      style={{
        width: `${GRID_WIDTH_PX * 8 * 2}px`, // Max 8(7 frogs + 1 statue), each takes 2x grid width
        ...position,
      }}
      className="flex absolute justify-center"
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
