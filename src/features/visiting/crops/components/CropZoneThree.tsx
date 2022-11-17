import React from "react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Field } from "./Field";

export const CropZoneThree: React.FC = () => {
  return (
    <>
      <div
        className="absolute flex justify-between flex-col"
        style={{
          width: `${GRID_WIDTH_PX * 4}px`,
          height: `${GRID_WIDTH_PX * 2.3}px`,
          left: `${GRID_WIDTH_PX * 3}px`,
          top: `${GRID_WIDTH_PX * 0.22}px`,
        }}
      >
        {/* Top row */}
        <div className="flex justify-between items-center">
          <Field fieldIndex={10} />
          <Field fieldIndex={11} />
          <Field fieldIndex={12} />
        </div>
        {/* Bottom row */}
        <div className="flex justify-between items-center z-10">
          <Field fieldIndex={13} />
          <Field fieldIndex={14} />
          <Field fieldIndex={15} />
        </div>
      </div>
    </>
  );
};
