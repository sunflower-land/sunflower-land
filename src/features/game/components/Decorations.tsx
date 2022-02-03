/**
 * Placeholder for future decorations that will fall on a different grid
 */
import React from "react";
import sunflowerRock from "assets/nfts/sunflower_rock.png";
import sunflowerTombstone from "assets/nfts/sunflower_tombstone.png";
import { GRID_WIDTH_PX } from "../lib/constants";

export const Decorations: React.FC = () => {
  return (
    <>
      <img
        style={{
          width: `${GRID_WIDTH_PX * 4}px`,
          right: `${GRID_WIDTH_PX * 27.5}px`,
          top: `${GRID_WIDTH_PX * 27.5}px`,
        }}
        className="absolute"
        src={sunflowerRock}
        alt="Sunflower rock"
      />
      <img
        style={{
          width: `${GRID_WIDTH_PX * 1}px`,
          left: `${GRID_WIDTH_PX * 22}px`,
          top: `${GRID_WIDTH_PX * 26.8}px`,
        }}
        className="absolute"
        src={sunflowerTombstone}
        alt="Sunflower tombstone"
      />
    </>
  );
};
