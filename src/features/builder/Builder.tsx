import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { useScrollIntoView } from "lib/utils/hooks/useScrollIntoView";
import React, { useRef } from "react";
import ScrollContainer from "react-indiana-drag-scroll";

import background from "assets/land/levels/level_1.png";
import { GameProvider } from "features/game/GameProvider";
import { ToastProvider } from "features/game/toast/ToastQueueProvider";
import waterMovement from "assets/decorations/water_movement.png";

const BUILDABLES: Record<
  string,
  {
    component: React.FC;
    icon: string;
  }
> = {
  appleTree: {
    component: () => null,
    icon: "",
  },
};
export const Builder: React.FC = () => {
  const container = useRef(null);

  const [scrollIntoView] = useScrollIntoView();

  // Load data
  return (
    <GameProvider>
      <ToastProvider>
        <ScrollContainer
          className="relative w-full h-full bg-[#0099db] overflow-scroll"
          innerRef={container}
        >
          <div
            className="relative flex"
            style={{
              width: `${40 * GRID_WIDTH_PX}px`,
              height: `${40 * GRID_WIDTH_PX}px`,
            }}
          >
            <img
              src={background}
              className="absolute inset-0 w-full h-full z-10"
            />
          </div>
          <div
            className="absolute inset-0 bg-repeat"
            style={{
              width: `${80 * GRID_WIDTH_PX}px`,
              height: `${80 * GRID_WIDTH_PX}px`,
              backgroundImage: `url(${waterMovement})`,
              backgroundSize: "400px",
              imageRendering: "pixelated",
            }}
          />
        </ScrollContainer>
      </ToastProvider>
    </GameProvider>
  );
};
