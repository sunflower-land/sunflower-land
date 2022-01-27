import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

import { Field } from "./Field";

interface Props {}

export const CropZoneOne: React.FC<Props> = () => {
  const { gameService, selectedItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  return (
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
        <Field
          selectedItem={selectedItem}
          field={state.fields[0]}
          fieldIndex={0}
        />
        <Field
          selectedItem={selectedItem}
          field={state.fields[1]}
          fieldIndex={1}
        />
      </div>
      {/* Middle row */}
      <div className="flex justify-center">
        <Field
          selectedItem={selectedItem}
          field={state.fields[2]}
          fieldIndex={2}
        />
      </div>
      {/* Bottom row */}
      <div className="flex justify-between">
        <Field
          selectedItem={selectedItem}
          field={state.fields[3]}
          fieldIndex={3}
        />
        <Field
          selectedItem={selectedItem}
          field={state.fields[4]}
          fieldIndex={4}
        />
      </div>
    </div>
  );
};
