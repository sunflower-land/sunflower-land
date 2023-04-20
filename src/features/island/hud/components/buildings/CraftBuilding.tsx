import React, { useState } from "react";

import { GameState } from "features/game/types/game";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SUNNYSIDE } from "assets/sunnyside";

import { CraftBuildingModal } from "./CraftBuildingModal";

interface Props {
  state: GameState;
}

export const CraftBuilding: React.FC<Props> = ({ state }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="flex flex-col items-center fixed z-50"
        style={{
          right: `${PIXEL_SCALE * 3}px`,
          top: `${PIXEL_SCALE * 38}px`,
        }}
      >
        <div
          onClick={() => setIsOpen(true)}
          className="relative flex z-50 cursor-pointer hover:img-highlight"
          style={{
            marginLeft: `${PIXEL_SCALE * 2}px`,
            marginBottom: `${PIXEL_SCALE * 25}px`,
            width: `${PIXEL_SCALE * 22}px`,
          }}
        >
          <img
            src={SUNNYSIDE.ui.round_button}
            className="absolute"
            style={{
              width: `${PIXEL_SCALE * 22}px`,
            }}
          />
          <img
            src={SUNNYSIDE.icons.hammer}
            className="absolute"
            style={{
              top: `${PIXEL_SCALE * 5}px`,
              left: `${PIXEL_SCALE * 5}px`,
              width: `${PIXEL_SCALE * 12}px`,
            }}
          />
        </div>
      </div>

      <CraftBuildingModal
        show={isOpen}
        onHide={() => setIsOpen(false)}
        state={state}
      />
    </>
  );
};
