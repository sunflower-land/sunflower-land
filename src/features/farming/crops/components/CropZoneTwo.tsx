import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX } from "features/game/lib/constants";

import goblin from "assets/npcs/goblin.gif";
import questionMark from "assets/icons/expression_confused.png";

import { useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";

import { Field } from "./Field";

export const CropZoneTwo: React.FC = () => {
  const { gameService, selectedItem } = useContext(Context);
  const [
    {
      context: { state },
    },
  ] = useActor(gameService);

  const [scrollIntoView] = useScrollIntoView();

  const isUnlocked = state.inventory["Pumpkin Soup"];
  return (
    <>
      <>
        {" "}
        <img
          src={questionMark}
          className="absolute z-10 animate-float"
          style={{
            width: `${GRID_WIDTH_PX * 0.3}px`,
            left: `${GRID_WIDTH_PX * 3.35}px`,
            bottom: `${GRID_WIDTH_PX * 2.7}px`,
          }}
        />
        <img
          src={goblin}
          className="absolute z-10 hover:img-highlight cursor-pointer"
          style={{
            width: `${GRID_WIDTH_PX * 1}px`,
            left: `${GRID_WIDTH_PX * 3}px`,
            bottom: `${GRID_WIDTH_PX * 1.55}px`,
          }}
        />
      </>

      <div
        className="absolute flex justify-center flex-col"
        style={{
          width: `${GRID_WIDTH_PX * 3}px`,
          height: `${GRID_WIDTH_PX * 3}px`,
          left: `${GRID_WIDTH_PX * 1}px`,
          bottom: `${GRID_WIDTH_PX * 0.6}px`,
        }}
      >
        {/* Top row */}
        <div className="flex justify-between">
          <Field selectedItem={selectedItem} fieldIndex={5} />
          <Field selectedItem={selectedItem} fieldIndex={6} />
        </div>
        {/* Middle row */}
        <div className="flex justify-center">
          <Field selectedItem={selectedItem} fieldIndex={7} />
        </div>
        {/* Bottom row */}
        <div className="flex justify-between">
          <Field selectedItem={selectedItem} fieldIndex={8} />
          <Field selectedItem={selectedItem} fieldIndex={9} />
        </div>
      </div>
    </>
  );
};
