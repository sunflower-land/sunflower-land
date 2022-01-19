import React, { useState } from "react";

import { GameProvider } from "./GameProvider";

import { Hud } from "features/hud/Hud";
import { Crops } from "features/crops/Crops";
import { Blacksmith } from "features/blacksmith/Blacksmith";

import background from "assets/land/background.png";
import { Water } from "features/water/Water";

// import "./Game.css";

export const Game: React.FC = () => {
  // Load data
  return (
    <GameProvider>
      <div className="bg-green-background overflow-scroll relative w-full h-full">
        <Hud />

        <div
          id="gameboard"
          className="relative h-gameboard w-gameboard"
          // TODO dynamic game board size based on tile dimensions
        >
          <img src={background} className="absolute inset-0 w-full h-full" />

          <Blacksmith />
          <Crops />
          <Water />
        </div>
      </div>
    </GameProvider>
  );
};
