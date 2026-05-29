import React, { useContext, useEffect, useState } from "react";
import classNames from "classnames";
import { useSelector } from "@xstate/react";

import { Context } from "features/game/GameProvider";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import type { MachineState as GameMachineState } from "features/game/lib/gameMachine";
import type { MachineInterpreter } from "features/game/expansion/placeable/landscapingMachine";

const _landscaping = (state: GameMachineState) =>
  state.matches("landscaping");

export const GRID_LINE_DEFAULT = "rgb(255 255 255 / 17%)";
export const GRID_LINE_REMOVAL = "rgb(220 38 38 / 55%)";

/**
 * Subscribes to the spawned `landscaping` child machine's `removalMode`
 * context flag. Returns false whenever the player is not currently in
 * landscaping (so callers can safely render even outside landscaping mode).
 *
 * Uses a manual subscription rather than `useSelector(child, …)` because the
 * child actor only exists while the parent gameMachine is in the landscaping
 * state — useSelector would throw if the actor is undefined.
 */
export function useLandscapingRemovalMode(): boolean {
  const { gameService } = useContext(Context);
  const landscaping = useSelector(gameService, _landscaping);
  const [removalMode, setRemovalMode] = useState(false);

  useEffect(() => {
    if (!landscaping) {
      setRemovalMode(false);
      return;
    }
    const child = gameService.getSnapshot().children.landscaping as
      | MachineInterpreter
      | undefined;
    if (!child) {
      setRemovalMode(false);
      return;
    }
    setRemovalMode(!!child.getSnapshot()?.context.removalMode);
    const sub = child.subscribe((state) => {
      setRemovalMode(!!state.context.removalMode);
    });
    return () => sub.unsubscribe();
  }, [landscaping, gameService]);

  return removalMode;
}

/**
 * Helper that returns the `linear-gradient(...)` value the landscaping grid
 * should paint with. Lets callers compose their own inline-style block while
 * still picking up the red overlay when bulk-removal mode is active.
 */
export function useLandscapingGridBackgroundImage(): string {
  const removalMode = useLandscapingRemovalMode();
  const color = removalMode ? GRID_LINE_REMOVAL : GRID_LINE_DEFAULT;
  return `linear-gradient(to right, ${color} 1px, transparent 1px),
          linear-gradient(to bottom, ${color} 1px, transparent 1px)`;
}

/**
 * Tile-grid overlay for landscaping surfaces whose grid fills the whole
 * container (interior / level_one). Uses `absolute inset-0` and animates
 * opacity in/out as the player enters/leaves landscaping. Locations whose
 * grid needs custom positioning (farm, home, petHouse) should keep their
 * own div and just consume `useLandscapingGridBackgroundImage()`.
 */
export const LandscapingGrid: React.FC = () => {
  const { gameService } = useContext(Context);
  const landscaping = useSelector(gameService, _landscaping);
  const backgroundImage = useLandscapingGridBackgroundImage();

  return (
    <div
      className={classNames(
        "absolute inset-0 pointer-events-none transition-opacity z-10",
        landscaping ? "opacity-100" : "opacity-0",
      )}
      style={{
        backgroundSize: `${GRID_WIDTH_PX}px ${GRID_WIDTH_PX}px`,
        backgroundImage,
      }}
    />
  );
};
