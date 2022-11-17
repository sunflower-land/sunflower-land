import React, { useContext, useState } from "react";

import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Field } from "./Field";

export const CropZoneThree: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { gameService, selectedItem } = useContext(Context);

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
          <Field selectedItem={selectedItem} fieldIndex={10} />
          <Field selectedItem={selectedItem} fieldIndex={11} />
          <Field selectedItem={selectedItem} fieldIndex={12} />
        </div>
        {/* Bottom row */}
        <div className="flex justify-between items-center">
          <Field selectedItem={selectedItem} fieldIndex={13} />
          <Field selectedItem={selectedItem} fieldIndex={14} />
          <Field selectedItem={selectedItem} fieldIndex={15} />
        </div>
      </div>
    </>
  );
};
