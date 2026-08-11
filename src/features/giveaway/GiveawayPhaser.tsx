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
import type { MachineInterpreter as MMOMachineInterpreter } from "features/world/mmoMachine";
import { GiveawayContext } from "./lib/GiveawayProvider";
import { RACE_SCENE_ID } from "./scenes/RaceScene";
import { GIVEAWAY_SCENE_LIST } from "./scenes/registry";
import {
  type MinigameType,
  DEFAULT_MINIGAME,
  GIVEAWAY_MINIGAMES,
} from "./lib/minigames";

export const GiveawayPhaser: React.FC<{
  minigame?: MinigameType;
  /** The shared MMO connection (created by GiveawayGame). */
  mmoService: MMOMachineInterpreter;
  /** Per-game input channel (shape depends on the game — see each scene). */
  controls?: unknown;
}> = ({ minigame = DEFAULT_MINIGAME, mmoService, controls }) => {
  const { gameService } = useContext(GameContext);
  const { authService } = useContext(Auth.Context);
  const { bridge } = useContext(GiveawayContext);
  const navigate = useNavigate();

  const gameState = useSelector(gameService, (state) => state.context.state);
  const game = useRef<Game>(undefined);
  const parentRef = useRef<HTMLDivElement>(null);

  const sceneKey =
    GIVEAWAY_MINIGAMES.find((m) => m.type === minigame)?.sceneId ??
    RACE_SCENE_ID;

  useEffect(() => {
    // Preloader loads the shared Sunflower Land assets (Bumpkin silhouettes,
    // shadows, label ninepatch) that BumpkinContainer depends on, then starts
    // the chosen scene via the `initialScene` registry value. The scene list is
    // derived from the game config (see scenes/registry.ts).
    const scenes = [Preloader, ...GIVEAWAY_SCENE_LIST];

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

    game.current.registry.set("initialScene", sceneKey);
    game.current.registry.set("giveawayBridge", bridge);
    game.current.registry.set("gameState", gameState);
    game.current.registry.set("id", bridge.playerId);
    game.current.registry.set("gameService", gameService);
    game.current.registry.set("authService", authService);
    game.current.registry.set("mmoService", mmoService);
    game.current.registry.set(
      "mmoServer",
      mmoService.getSnapshot().context.server,
    );
    game.current.registry.set("gameControls", controls);
    game.current.registry.set("navigate", navigate);

    // Push the joined room into the registry the moment the machine connects
    // (and on any reconnect). BaseScene reads `mmoServer` from here every frame
    // for both rendering other players AND broadcasting our own position, so a
    // reliable, render-independent update is essential — otherwise you only ever
    // see yourself and nothing you do is broadcast.
    const subscription = mmoService.subscribe((state) => {
      game.current?.registry.set("mmoServer", state.context.server);
    });

    return () => {
      subscription.unsubscribe();
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
