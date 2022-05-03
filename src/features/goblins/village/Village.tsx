import React from "react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Section } from "lib/utils/hooks/useScrollIntoView";

export const Village: React.FC = () => {
  return (
    <div
      style={{
        width: `${GRID_WIDTH_PX * 25}px`,
        height: `${GRID_WIDTH_PX * 16.6}px`,
        left: `calc(50% - ${GRID_WIDTH_PX * 8}px)`,
        top: `calc(50% - ${GRID_WIDTH_PX * 11.6}px)`,
      }}
      className="absolute"
    >
      {/* Navigation Center Point */}
      <span
        id={Section.GoblinVillage}
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
};
