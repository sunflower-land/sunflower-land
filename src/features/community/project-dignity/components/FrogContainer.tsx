import React from "react";

import frogStatue from "assets/nfts/frogs/frog_statue.png";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Frog } from "../models/frog";
import { FrogComponent } from "./FrogComponent";

interface Props {
  frogs: Frog[];
  farmId: number | undefined;
}

export const FrogContainer: React.FC<Props> = ({ frogs, farmId }) => {
  return (
    <div
      style={{
        width: `${GRID_WIDTH_PX * 12}px`,
        left: `${GRID_WIDTH_PX * 14}px`,
        top: `${GRID_WIDTH_PX * 2.2}px`,
      }}
      className="flex absolute justify-center"
    >
      {farmId === 143560 && (
        <img
          src={frogStatue}
          className="z-10"
          style={{
            width: `${GRID_WIDTH_PX * 2}px`,
          }}
        />
      )}
      {frogs.map((frog, index) => (
        <FrogComponent key={index} frog={frog} />
      ))}
    </div>
  );
};
