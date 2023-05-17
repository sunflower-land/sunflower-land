import React, { useEffect } from "react";
import { Game, AUTO } from "phaser";
import { PhaserScene } from "./Scene";
import { ChatUI } from "features/pumpkinPlaza/components/ChatUI";
import { OFFLINE_FARM } from "features/game/lib/landData";
import { NPCModals } from "./SceneModals";
import NinePatchPlugin from "phaser3-rex-plugins/plugins/ninepatch-plugin.js";

export const TILE_WIDTH = 16;
export const TILE_HEIGHT = 16;

export const MIN_GAME_WIDTH = 40 * TILE_WIDTH; // 400
export const MIN_GAME_HEIGHT = 40 * TILE_HEIGHT; // 224

type SubCallback = (text: string) => void;
class Subber {
  private subbers: SubCallback[] = [];

  public subscribe(cb: SubCallback) {
    this.subbers.push(cb);
  }

  public broadcast(text: string) {
    this.subbers.forEach((cb) => {
      cb(text);
    });
  }
}

export const subber = new Subber();

export const Phaser: React.FC = () => {
  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: AUTO,
      fps: {
        target: 60,
        forceSetTimeOut: true,
        smoothStep: true,
      },
      backgroundColor: "#099fe0",
      parent: "phaser-example",

      // zoom,
      autoRound: true,
      pixelArt: true,
      plugins: {
        global: [
          {
            key: "rexNinePatchPlugin",
            plugin: NinePatchPlugin,
            start: true,
          },
          // ...
        ],
      },
      // plugins: {
      //   scene: [
      //     {
      //       key: "gridEngine",
      //       plugin: GridEngine,
      //       mapping: "gridEngine",
      //     },
      //   ],
      // },

      width: window.innerWidth,
      height: window.innerHeight,
      // width: 600,
      // height: 600,

      // scale: {
      //   autoCenter: Scale.CENTER_BOTH,
      //   mode: Scale.NONE,
      // },

      // Allows Phaser canvas to be responsive to browser sizing
      scale: {
        // mode: Scale.ENVELOP,
        // width: window.innerWidth,
        // height: window.innerHeight,
      },
      physics: {
        default: "arcade",
        arcade: {
          debug: true,
          gravity: { y: 0 },
        },
      },
      scene: [PhaserScene],
      loader: {
        crossOrigin: "anonymous",
      },
    };

    const game = new Game({
      ...config,
      parent: "game-content",
    });

    // game.config.loaderCrossOrigin = 'anonymous'
  }, []);

  return (
    <>
      <div
        id="game-content"
        className="flex w-full justify-center items-center h-full"
      />
      <img id="imageTest" />
      <ChatUI
        game={OFFLINE_FARM}
        onMessage={(m) => subber.broadcast(m.text ?? "?")}
      />
      <NPCModals />
    </>
  );
};
