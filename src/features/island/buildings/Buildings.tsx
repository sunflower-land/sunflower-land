import React, { useState } from "react";

import roundButton from "assets/ui/button/round_button.png";
import hammer from "assets/icons/hammer.png";

import { PIXEL_SCALE } from "features/game/lib/constants";
import { BuildingsModal } from "./BuildingsModal";

export const Buildings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="fixed z-50 cursor-pointer hover:img-highlight"
        style={{
          right: `${PIXEL_SCALE * 3}px`,
          bottom: `${PIXEL_SCALE * 51}px`,
          width: `${PIXEL_SCALE * 22}px`,
        }}
      >
        <img
          src={roundButton}
          className="absolute"
          style={{
            width: `${PIXEL_SCALE * 22}px`,
          }}
        />
        <img
          src={hammer}
          className="absolute"
          style={{
            top: `${PIXEL_SCALE * 4}px`,
            left: `${PIXEL_SCALE * 5}px`,
            width: `${PIXEL_SCALE * 13}px`,
          }}
        />
      </div>
      <BuildingsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};
