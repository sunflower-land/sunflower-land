import React from "react";

import { pixelGreenBorderStyle } from "features/game/lib/style";

export const SkillPointsLabel = ({ points }: { points: number }) => (
  <div
    className="bg-green-background text-white text-xxs object-contain justify-center items-center whitespace-nowrap max-w-min px-1"
    style={pixelGreenBorderStyle}
  >
    <p>{`Skill Points: ${points}`}</p>
  </div>
);
