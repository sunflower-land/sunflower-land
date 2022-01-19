import React, { useContext, useState } from "react";

import { Context } from "features/game/GameProvider";

import { Field } from "./components/Field";
import { CROPS } from "./lib/crops";
import { Section } from "lib/utils/useScrollIntoView";
import { Market } from "./components/Market";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
// import { Market } from "./components/Market";

interface Props {}

export const Crops: React.FC<Props> = () => {
  const { state, selectedItem } = useContext(Context);

  return (
    // Container
    <div
      style={{
        width: `${GRID_WIDTH_PX * 25}px`,
        height: `${GRID_WIDTH_PX * 12}px`,
        left: `calc(50% - ${GRID_WIDTH_PX * 13}px)`,
        top: `calc(50% - ${GRID_WIDTH_PX * 23}px)`,
      }}
      className="absolute"
    >
      {/* Navigation Center Point */}
      <span
        id={Section.Crops}
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />

      <Market />

      <div
        className="absolute flex justify-center flex-col"
        style={{
          width: `${GRID_WIDTH_PX * 3}px`,
          height: `${GRID_WIDTH_PX * 3}px`,
          left: `${GRID_WIDTH_PX * 13}px`,
          top: `${GRID_WIDTH_PX * 0.25}px`,
        }}
      >
        {/* Top row */}
        <div className="flex justify-between">
          <Field selectedItem={selectedItem} field={state.fields[0]} />
          <Field selectedItem={selectedItem} field={state.fields[1]} />
        </div>
        {/* Middle row */}
        <div className="flex justify-center">
          <Field selectedItem={selectedItem} field={state.fields[2]} />
        </div>
        {/* Bottom row */}
        <div className="flex justify-between">
          <Field selectedItem={selectedItem} field={state.fields[3]} />
          <Field selectedItem={selectedItem} field={state.fields[4]} />
        </div>
      </div>

      <div
        className="absolute flex justify-center flex-col"
        style={{
          width: `${GRID_WIDTH_PX * 3}px`,
          height: `${GRID_WIDTH_PX * 3}px`,
          left: `${GRID_WIDTH_PX * 1}px`,
          bottom: `${GRID_WIDTH_PX * 1}px`,
        }}
      >
        {/* Top row */}
        <div className="flex justify-between">
          <Field selectedItem={selectedItem} field={state.fields[5]} />
          <Field selectedItem={selectedItem} field={state.fields[6]} />
        </div>
        {/* Middle row */}
        <div className="flex justify-center">
          <Field selectedItem={selectedItem} field={state.fields[7]} />
        </div>
        {/* Bottom row */}
        <div className="flex justify-between">
          <Field selectedItem={selectedItem} field={state.fields[8]} />
          <Field selectedItem={selectedItem} field={state.fields[9]} />
        </div>
      </div>

      <div
        className="absolute flex justify-center flex-col"
        style={{
          width: `${GRID_WIDTH_PX * 3}px`,
          height: `${GRID_WIDTH_PX * 3}px`,
          left: `${GRID_WIDTH_PX * 1}px`,
          bottom: `${GRID_WIDTH_PX * 1}px`,
        }}
      >
        {/* Top row */}
        <div className="flex justify-between">
          <Field selectedItem={selectedItem} field={state.fields[5]} />
          <Field selectedItem={selectedItem} field={state.fields[6]} />
        </div>
        {/* Middle row */}
        <div className="flex justify-center">
          <Field selectedItem={selectedItem} field={state.fields[7]} />
        </div>
        {/* Bottom row */}
        <div className="flex justify-between">
          <Field selectedItem={selectedItem} field={state.fields[8]} />
          <Field selectedItem={selectedItem} field={state.fields[9]} />
        </div>
      </div>

      <div
        className="absolute flex justify-between flex-col"
        style={{
          width: `${GRID_WIDTH_PX * 4}px`,
          height: `${GRID_WIDTH_PX * 2.3}px`,
          left: `${GRID_WIDTH_PX * 3}px`,
          top: `-${GRID_WIDTH_PX * 0.5}px`,
        }}
      >
        {/* Top row */}
        <div className="flex justify-between items-center">
          <Field selectedItem={selectedItem} field={state.fields[10]} />
          <Field selectedItem={selectedItem} field={state.fields[11]} />
          <Field selectedItem={selectedItem} field={state.fields[12]} />
        </div>
        {/* Bottom row */}
        <div className="flex justify-between items-center z-10">
          <Field selectedItem={selectedItem} field={state.fields[13]} />
          <Field selectedItem={selectedItem} field={state.fields[14]} />
          <Field selectedItem={selectedItem} field={state.fields[15]} />
        </div>
      </div>

      <div
        className="absolute flex justify-between flex-col"
        style={{
          width: `${GRID_WIDTH_PX * 4}px`,
          height: `${GRID_WIDTH_PX * 2.3}px`,
          left: `${GRID_WIDTH_PX * 3}px`,
          top: `${GRID_WIDTH_PX * 2.5}px`,
        }}
      >
        <div className="flex justify-between items-center">
          <Field selectedItem={selectedItem} field={state.fields[16]} />
          <Field selectedItem={selectedItem} field={state.fields[17]} />
          <Field selectedItem={selectedItem} field={state.fields[18]} />
        </div>
        <div className="flex justify-between items-center z-10">
          <Field selectedItem={selectedItem} field={state.fields[19]} />
          <Field selectedItem={selectedItem} field={state.fields[20]} />
          <Field selectedItem={selectedItem} field={state.fields[21]} />
        </div>
      </div>
    </div>
  );
};
