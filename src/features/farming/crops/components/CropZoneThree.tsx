import React, { useContext, useState } from "react";

import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

import goblinWatering from "assets/npcs/goblin_watering.gif";

import { Field } from "./Field";

export const CropZoneThree: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { gameService, selectedItem } = useContext(Context);

  return (
    <>
      <>
        <img
          src={goblinWatering}
          className="absolute z-10 hover:img-highlight cursor-pointer"
          onClick={() => setShowModal(true)}
          style={{
            width: `${GRID_WIDTH_PX * 5}px`,
            left: `${GRID_WIDTH_PX * 0.2}px`,
            top: `${-GRID_WIDTH_PX * 1.5}px`,
          }}
        />
      </>

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
