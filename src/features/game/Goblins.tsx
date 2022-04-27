import React, { useRef, useEffect } from "react";
import ScrollContainer from "react-indiana-drag-scroll";

import background from "assets/land/background.png";

import { Game } from "./Game";
import { GameProvider } from "./GameProvider";
import { ToastProvider } from "./toast/ToastQueueProvider";
import mapMovement from "./lib/mapMovement";
import { ExpansionInfo } from "./expansion/ExpansionInfo";
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
