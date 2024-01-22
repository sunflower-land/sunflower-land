import React from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import bee from "assets/icons/bee.webp";

export const BeeSwarm: React.FC = () => (
  <div
    id="swarm"
    className="absolute -top-1 left-1/2 -translate-x-1/2 h-36 w-40 pointer-events-none"
  >
    {Array.from({ length: 7 }).map((_, i) => (
      <img
        key={`swarm-bee-${i + 1}`}
        src={bee}
        alt="Bee"
        className={`absolute left-1/2 -translate-x-1/2 swarm-bee-${i + 1}`}
        style={{
          width: `${PIXEL_SCALE * 7}px`,
        }}
      />
    ))}
  </div>
);
