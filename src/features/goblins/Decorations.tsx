/**
 * Placeholder for future decorations that will fall on a different grid
 */
import React from "react";

import woodGoblin from "assets/npcs/big_goblin_axe.gif";

import { Section } from "lib/utils/hooks/useScrollIntoView";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

export const Decorations: React.FC = () => {
  return (
    <>
      <img
        style={{
          width: `${GRID_WIDTH_PX * 1.4}px`,
          left: `${GRID_WIDTH_PX * -4.5}px`,
          top: `${GRID_WIDTH_PX * 22.6}px`,
        }}
        id={Section["Sunflower Statue"]}
        className="absolute"
        src={woodGoblin}
        alt="Sunflower Statue"
      />
    </>
  );
};
