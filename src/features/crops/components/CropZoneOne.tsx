import React, { useContext } from "react";

import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Field } from "./Field";

export const CropZoneOne: React.FC = () => {
  const { selectedItem } = useContext(Context);

  return (
    <div
      className="absolute flex justify-center flex-col "
      id="first-sunflower"
      style={{
        width: `${GRID_WIDTH_PX * 3}px`,
        height: `${GRID_WIDTH_PX * 3}px`,
        left: `${GRID_WIDTH_PX * 13}px`,
        top: `${GRID_WIDTH_PX * 0.85}px`,
      }}
    >
      {/* Top row */}
      <div className="flex justify-between">
        <Field
          selectedItem={selectedItem}
          fieldIndex={0}
          onboarding
          canHarvest={true}
        />
        <Field
          selectedItem={selectedItem}
          fieldIndex={1}
          onboarding
          canHarvest={true}
        />
      </div>
      {/* Middle row */}
      <div className="flex justify-center">
        <Field
          selectedItem={selectedItem}
          fieldIndex={2}
          onboarding
          canHarvest={true}
        />
      </div>
      {/* Bottom row */}
      <div className="flex justify-between">
        <Field selectedItem={selectedItem} fieldIndex={3} canHarvest={true} />
        <Field selectedItem={selectedItem} fieldIndex={4} canHarvest={true} />
      </div>
    </div>
  );
};
