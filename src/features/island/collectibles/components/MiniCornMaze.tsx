import React from "react";

import miniCornMaze from "assets/decorations/mini_corn_maze.webp";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { SFTDetailPopover } from "components/ui/SFTDetailPopover";

export const MiniCornMaze: React.FC = () => {
  return (
    <SFTDetailPopover name="Mini Corn Maze">
      <>
        <img
          src={miniCornMaze}
          style={{
            width: `${PIXEL_SCALE * 16}px`,
          }}
          className="absolute left-1/2 -translate-x-1/2 bottom-0"
          alt="Mini Corn Maze"
        />
      </>
    </SFTDetailPopover>
  );
};
