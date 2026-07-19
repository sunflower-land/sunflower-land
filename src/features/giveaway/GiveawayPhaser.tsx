import React, { useContext, useEffect, useRef } from "react";
import { Game, AUTO } from "phaser";
import NinePatchPlugin from "phaser3-rex-plugins/plugins/ninepatch-plugin.js";
import NinePatch2Plugin from "phaser3-rex-plugins/plugins/ninepatch2-plugin.js";
import VirtualJoystickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin.js";
import { PhaserNavMeshPlugin } from "phaser-navmesh";
import { useSelector } from "@xstate/react";
import { useNavigate } from "react-router";

import { Preloader } from "features/world/scenes/Preloader";
import { Context as GameContext } from "features/game/GameProvider";
import * as Auth from "features/auth/lib/Provider";
import { GiveawayContext } from "./lib/GiveawayProvider";
import { RaceScene, RACE_SCENE_ID } from "./scenes/RaceScene";
import { type MinigameType, DEFAULT_MINIGAME } from "./lib/minigames";

/**
 * Which scene runs for each mini-game type. New scenes plug in here; types that
 * aren't implemented yet fall back to the race scene.
 */
const SCENE_BY_TYPE: Partial<Record<MinigameType, string>> = {
  race: RACE_SCENE_ID,
};

export const GiveawayPhaser: React.FC<{ minigame?: MinigameType }> = ({
  minigame = DEFAULT_MINIGAME,
}) => {
  const { gameService } = useContext(GameContext);
  const { authService } = useContext(Auth.Context);
  const { bridge } = useContext(GiveawayContext);
  const navigate = useNavigate();

  const gameState = useSelector(gameService, (state) => state.context.state);
  const game = useRef<Game>(undefined);
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = SCENE_BY_TYPE[minigame] ?? RACE_SCENE_ID;

    // Preloader loads the shared Sunflower Land assets (Bumpkin silhouettes,
    // shadows, label ninepatch) that BumpkinContainer depends on, then starts
    // the chosen scene via the `initialScene` registry value.
    const scenes = [Preloader, RaceScene];

    const config: Phaser.Types.Core.GameConfig = {
      type: AUTO,
      // 60fps (the world runs at 30) — the race has a lerping camera and a
      // constantly-moving runner, which shows up as stutter at 30.
      fps: { target: 60, smoothStep: true },
      backgroundColor: "#000000",
      parent: parentRef.current ?? undefined,
      autoRound: true,
      pixelArt: true,
      // Must mirror the world's plugin set: BumpkinContainer's name Label needs
      // `rexNinePatch2`, and BaseScene expects the `navMeshPlugin` mapping.
      plugins: {
        global: [
          { key: "rexNinePatchPlugin", plugin: NinePatchPlugin, start: true },
          { key: "rexNinePatch2Plugin", plugin: NinePatch2Plugin, start: true },
          {
            key: "rexVirtualJoystick",
            plugin: VirtualJoystickPlugin,
            start: true,
          },
        ],
        scene: [
          {
            key: "PhaserNavMeshPlugin",
            plugin: PhaserNavMeshPlugin,
            mapping: "navMeshPlugin",
            start: true,
          },
        ],
      },
      width: window.innerWidth,
      height: window.innerHeight,
      physics: {
        default: "arcade",
        arcade: { debug: false, gravity: { x: 0, y: 0 } },
      },
      scene: scenes,
      loader: { crossOrigin: "anonymous" },
    };

    game.current = new Game({
      ...config,
      parent: parentRef.current ?? undefined,
    });

    game.current.registry.set("initialScene", scene);
    game.current.registry.set("giveawayBridge", bridge);
    game.current.registry.set("gameState", gameState);
    game.current.registry.set("id", bridge.playerId);
    game.current.registry.set("gameService", gameService);
    game.current.registry.set("authService", authService);
    game.current.registry.set("navigate", navigate);

    return () => {
      game.current?.destroy(true);
    };
    // Intentionally mount once — `bridge` is a stable object whose getters read
    // the latest data, so the game never needs re-creating on data changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      id="giveaway-game-content"
      ref={parentRef}
      className="absolute inset-0"
    />
  );
};
