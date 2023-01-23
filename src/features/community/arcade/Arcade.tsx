import React from "react";

import { ArcadeModal } from "features/community/arcade/ArcadeModal";

import { PIXEL_SCALE } from "features/game/lib/constants";
import arcade from "assets/community/arcade/images/arcade_machine.png";

export const Arcade = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <div
        className="absolute cursor-pointer hover:img-highlight"
        style={{
          width: `${PIXEL_SCALE * 16}px`,
        }}
        onClick={() => setIsOpen(true)}
      >
        <img
          id="arcade"
          src={arcade}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 16}px`,
            left: "0px",
            bottom: "0px",
          }}
        />
      </div>
      <ArcadeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
