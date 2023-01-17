import React, { useState } from "react";
import pirate from "assets/npcs/pirate_goblin.gif";
import { GRID_WIDTH_PX, PIXEL_SCALE } from "features/game/lib/constants";

export const Pirate: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div
      className="absolute"
      style={{
        left: `${GRID_WIDTH_PX * 1}px`,
        top: `${GRID_WIDTH_PX * 1}px`,
      }}
    >
      <img
        src={pirate}
        style={{
          width: `${PIXEL_SCALE * 19}px`,
        }}
      />
    </div>
  );
};
