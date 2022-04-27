import React, { useRef, useEffect } from "react";
import ScrollContainer from "react-indiana-drag-scroll";

import background from "assets/land/background.png";

import mapMovement from "./lib/mapMovement";
import { GoblinProvider } from "./GoblinProvider";

export const Goblins: React.FC = () => {
  // catching and passing scroll container to keyboard listeners
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
      <span>Goblin Village</span>
    </GoblinProvider>
  );
};
