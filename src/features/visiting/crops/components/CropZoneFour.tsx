import React from "react";

import { GRID_WIDTH_PX } from "features/game/lib/constants";

import goblinDig from "assets/npcs/goblin_dig.gif";

import { Field } from "./Field";

export const CropZoneFour: React.FC = () => {
  return (
    <>
      <>
        <img
          src={goblinDig}
          className="absolute z-20 hover:img-highlight cursor-pointer -scale-x-100"
          style={{
            width: `${GRID_WIDTH_PX * 5}px`,
            left: `${GRID_WIDTH_PX * 4.8}px`,
            top: `${GRID_WIDTH_PX * 3}px`,
          }}
        />
      </>

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
          <Field fieldIndex={16} />
          <Field fieldIndex={17} />
          <Field fieldIndex={18} />
        </div>
        <div className="flex justify-between items-center z-10">
          <Field fieldIndex={19} />
          <Field fieldIndex={20} />
          <Field fieldIndex={21} />
        </div>
      </div>
    </>
  );
};
