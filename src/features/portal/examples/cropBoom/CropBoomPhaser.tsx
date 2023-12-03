import React, { useContext, useEffect, useRef, useState } from "react";
import { Game, AUTO } from "phaser";
import NinePatchPlugin from "phaser3-rex-plugins/plugins/ninepatch-plugin.js";
import VirtualJoystickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin.js";

import { Preloader } from "features/world/scenes/Preloader";
import { PortalContext } from "./lib/PortalProvider";
import { useActor } from "@xstate/react";
import { CropBoomScene } from "./CropBoomScene";
import { InteractableModals } from "features/world/ui/InteractableModals";

export const CropBoomPhaser: React.FC = () => {
  const { portalService } = useContext(PortalContext);
  const [portalState] = useActor(portalService);

  const [loaded, setLoaded] = useState(false);

  const game = useRef<Game>();

  const scene = "example";

  const scenes = [Preloader, CropBoomScene];

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: AUTO,
      fps: {
        target: 30,
        smoothStep: true,
      },
      backgroundColor: "#000000",
      parent: "phaser-example",

      autoRound: true,
      pixelArt: true,
      plugins: {
        global: [
          {
            key: "rexNinePatchPlugin",
            plugin: NinePatchPlugin,
            start: true,
          },
          {
            key: "rexVirtualJoystick",
            plugin: VirtualJoystickPlugin,
            start: true,
          },
        ],
      },
      width: window.innerWidth,
      height: window.innerHeight,

      physics: {
        default: "arcade",
        arcade: {
          debug: true,
          gravity: { y: 0 },
        },
      },
      scene: scenes,
      loader: {
        crossOrigin: "anonymous",
      },
    };

    game.current = new Game({
      ...config,
      parent: "game-content",
    });

    game.current.registry.set("initialScene", scene);
    game.current.registry.set("gameState", portalState.context.state);
    game.current.registry.set("id", portalState.context.id);

    setLoaded(true);

    return () => {
      game.current?.destroy(true);
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const activeScene = game.current?.scene
      .getScenes(false)
      // Corn maze pauses when game is over so we need to filter for active and paused scenes.
      .filter((s) => s.scene.isActive() || s.scene.isPaused())[0];

    if (activeScene) {
      activeScene.scene.start(scene);
    }
  }, [scene]);

  const ref = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div id="game-content" ref={ref} />
      <InteractableModals id={portalState.context.id} />
    </div>
  );
};
