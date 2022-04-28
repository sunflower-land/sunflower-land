import { GoblinVillage } from "features/goblins/GoblinVillage";
import React, { useRef, useEffect } from "react";

import background from "assets/land/goblin_town.png";

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
          className="relative h-gameboard w-gameboard"
          // TODO dynamic game board size based on tile dimensions
        >
          <img src={background} className="absolute inset-0 w-full h-full" />
          <GoblinVillage />
        </div>
      </ScrollContainer>
    </GoblinProvider>
  );
};
