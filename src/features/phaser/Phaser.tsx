import React from "react";
import { Game, AUTO } from "phaser";
import { PhaserScene } from "./Scene";

const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  fps: {
    target: 60,
    forceSetTimeOut: true,
    smoothStep: false,
  },
  width: 800,
  height: 600,
  // height: 200,
  backgroundColor: "#b6d53c",
  parent: "phaser-example",
  physics: {
    default: "arcade",
  },
  pixelArt: true,
  scene: [PhaserScene],
};

export const Phaser: React.FC = () => {
  const game = new Game({
    // ...configs,
    parent: "game-content",
  });

  return <div id="game-content" />;
};
