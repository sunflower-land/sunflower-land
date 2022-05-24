import React from "react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Field } from "./Field";

export const CropZoneOne: React.FC = () => (
  <div
    className="absolute flex justify-center flex-col "
    style={{
      width: `${GRID_WIDTH_PX * 3}px`,
      height: `${GRID_WIDTH_PX * 3}px`,
      left: `${GRID_WIDTH_PX * 13}px`,
      top: `${GRID_WIDTH_PX * 0.85}px`,
    }}
  >
    {/* Top row */}
    <div className="flex justify-between">
      <Field fieldIndex={0} />
      <Field fieldIndex={1} />
    </div>
    {/* Middle row */}
    <div className="flex justify-center">
      <Field fieldIndex={2} />
    </div>
    {/* Bottom row */}
    <div className="flex justify-between">
      <Field fieldIndex={3} />
      <Field fieldIndex={4} />
    </div>
  </div>
);
