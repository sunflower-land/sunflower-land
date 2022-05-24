/**
 * Placeholder for future decorations that will fall on a different grid
 */
import React from "react";

import { GRID_WIDTH_PX } from "../lib/constants";
import { Section } from "lib/utils/hooks/useScrollIntoView";
import { FLAGS } from "../types/flags";
import { ITEM_DETAILS } from "../types/images";
import { GameState } from "../types/game";

interface Props {
  state: GameState;
}

export const Flags: React.FC<Props> = ({ state }) => {
  const flags = Object.values(FLAGS).filter(
    (flag) => flag.name in state.inventory
  );

  return (
    <>
      <div
        style={{
          width: `${GRID_WIDTH_PX * 3}px`,
          right: `${GRID_WIDTH_PX * 43.8}px`,
          top: `${GRID_WIDTH_PX * 35.5}px`,
        }}
        className="flex absolute justify-center"
      >
        {flags.map((flag, index) => (
          <img
            key={index}
            style={{
              width: `${GRID_WIDTH_PX * 1.2}px`,
            }}
            id={Section["Flags"]}
            src={ITEM_DETAILS[flag.name].image}
            alt={flag.name}
          />
        ))}
      </div>
    </>
  );
};
