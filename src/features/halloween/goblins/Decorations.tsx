/**
 * Placeholder for future decorations that will fall on a different grid
 */
import React from "react";

import bloodGoblin from "assets/events/halloween/assets/npcs/blood_goblin.gif";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

export const HalloweenDecorations: React.FC = () => {
  return (
    <>
      <img
        style={{
          width: `${GRID_WIDTH_PX * 1.4}px`,
          left: `${GRID_WIDTH_PX * -4.5}px`,
          top: `${GRID_WIDTH_PX * 22.6}px`,
        }}
        className="absolute"
        src={bloodGoblin}
        alt="Blood Goblin"
      />
    </>
  );
};
