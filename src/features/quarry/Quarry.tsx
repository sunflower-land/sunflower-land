import React, { useContext } from "react";

import goldRock from "assets/resources/gold_rock.png";
import ironRock from "assets/resources/iron_rock.png";

import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { Rock } from "./components/Rock";

const POPOVER_TIME_MS = 1000;

export const Quarry: React.FC = () => {
  return (
    <div
      style={{
        height: `${GRID_WIDTH_PX * 6}px`,
        width: `${GRID_WIDTH_PX * 6}px`,
        left: `calc(50% +  ${GRID_WIDTH_PX * 17}px)`,
        top: `calc(50% -  ${GRID_WIDTH_PX * 17}px)`,
      }}
      className="absolute "
    >
      <div
        className="absolute"
        style={{
          height: `${GRID_WIDTH_PX * 1.5}px`,
          width: `${GRID_WIDTH_PX * 1.5}px`,
        }}
      >
        <Rock image={goldRock} />
      </div>
      <div
        className="absolute"
        style={{
          height: `${GRID_WIDTH_PX * 1.5}px`,
          width: `${GRID_WIDTH_PX * 1.5}px`,
          left: `${GRID_WIDTH_PX * 2}px`,
          top: `${GRID_WIDTH_PX * 3}px`,
        }}
      >
        <Rock image={ironRock} />
      </div>
    </div>
  );
};
