import { GoblinLand } from "features/goblins/GoblinLand";
import React, { useRef, useEffect } from "react";

import goblinBackground from "assets/land/goblin_background.png";

import { GoblinProvider } from "./GoblinProvider";
import mapMovement from "./lib/mapMovement";
import ScrollContainer from "react-indiana-drag-scroll";

export const Goblins: React.FC = () => {
  const container = useRef(null);

  useEffect(() => {
    mapMovement.addListeners(container.current);
    return () => {
      mapMovement.removeListeners();
    };
  }, [container]);

  // Load data
  return (
    <GoblinProvider>
      <ScrollContainer
        className="bg-green-background overflow-scroll relative w-full h-full"
        innerRef={container}
      >
        <div
          className="relative h-goblinGameboard w-goblinGameboard"
          // TODO dynamic game board size based on tile dimensions
        >
          <img
            src={goblinBackground}
            className="absolute inset-0 w-full h-full"
          />
          <GoblinLand />
        </div>
      </ScrollContainer>
    </GoblinProvider>
  );
};
