import React from "react";

import background from "assets/land/background.png";

import { GameProvider } from "./GameProvider";
import { Game } from "./Game";

export const Session: React.FC = () => {
  // Load data
  return (
    <GameProvider>
      <div className="bg-green-background overflow-scroll relative w-full h-full">
        <div
          id="gameboard"
          className="relative h-gameboard w-gameboard"
          // TODO dynamic game board size based on tile dimensions
        >
          <img src={background} className="absolute inset-0 w-full h-full" />

          <Game />
        </div>
      </div>
    </GameProvider>
  );
};
