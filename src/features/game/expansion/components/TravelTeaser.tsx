import React, { useState } from "react";
import raft from "assets/decorations/raft.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { NPC } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";

export const TravelTeaser: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        className="absolute"
        style={{
          top: `${2 * PIXEL_SCALE}px`,
          left: `${2 * PIXEL_SCALE}px`,
        }}
      >
        <img
          src={raft}
          style={{
            width: `${37 * PIXEL_SCALE}px`,
          }}
        />
        <div
          className="absolute"
          style={{
            top: `${-10 * PIXEL_SCALE}px`,
            left: `${12 * PIXEL_SCALE}px`,
          }}
        >
          <NPC parts={NPC_WEARABLES["pumpkin' pete"]} />
        </div>
      </div>
    </>
  );
};
