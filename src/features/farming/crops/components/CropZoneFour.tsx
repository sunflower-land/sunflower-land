import React, { useContext } from "react";

import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Field } from "./Field";

export const CropZoneFour: React.FC = () => {
  const { gameService, selectedItem } = useContext(Context);

  return (
    <>
      <div
        className="absolute flex justify-between flex-col"
        style={{
          width: `${GRID_WIDTH_PX * 4}px`,
          height: `${GRID_WIDTH_PX * 2.3}px`,
          left: `${GRID_WIDTH_PX * 3}px`,
          top: `${GRID_WIDTH_PX * 3}px`,
        }}
      >
        <div className="flex justify-between items-center">
          <Field selectedItem={selectedItem} fieldIndex={16} />
          <Field selectedItem={selectedItem} fieldIndex={17} />
          <Field selectedItem={selectedItem} fieldIndex={18} />
        </div>
        <div className="flex justify-between items-center">
          <Field selectedItem={selectedItem} fieldIndex={19} />
          <Field selectedItem={selectedItem} fieldIndex={20} />
          <Field selectedItem={selectedItem} fieldIndex={21} />
        </div>
      </div>
    </>
  );
};
