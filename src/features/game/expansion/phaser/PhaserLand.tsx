import React, { useContext, useEffect, useRef } from "react";
import { Game, AUTO } from "phaser";
import { useSelector } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { Hud } from "features/island/hud/Hud";

import { FarmScene } from "./FarmScene";

const _state = (state: MachineState) => state.context.state;

/**
 * MVP Phaser (canvas) port of the Land.tsx rendering layer.
 *
 * Same architecture as world/Phaser.tsx: the game machine stays the source of
 * truth in React; the scene reads state via the registry and receives change
 * notifications through the "gameStateUpdated" game event. Only crop plots
 * are rendered for now.
 */
export const PhaserLand: React.FC = () => {
  const { gameService, selectedItem } = useContext(Context);
  const state = useSelector(gameService, _state);

  const game = useRef<Game>(undefined);

  useEffect(() => {
    const config: Phaser.Types.Core.GameConfig = {
      type: AUTO,
      fps: { target: 30, smoothStep: true },
      backgroundColor: "#63c74d",
      parent: "phaser-land",
      autoRound: true,
      pixelArt: true,
      width: window.innerWidth,
      height: window.innerHeight,
      scene: [FarmScene],
      loader: { crossOrigin: "anonymous" },
    };

    game.current = new Game(config);

    if (import.meta.env.DEV) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__FARM_GAME = game.current;
    }

    game.current.registry.set("gameService", gameService);
    game.current.registry.set("selectedItem", selectedItem);

    return () => {
      game.current?.destroy(true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Notify the scene when the machine state changes (plant/harvest/autosave)
  useEffect(() => {
    game.current?.events.emit("gameStateUpdated");
  }, [state]);

  useEffect(() => {
    game.current?.registry.set("selectedItem", selectedItem);
  }, [selectedItem]);

  return (
    <div>
      <div id="phaser-land" />

      <Hud isFarming={true} location="farm" />
    </div>
  );
};
