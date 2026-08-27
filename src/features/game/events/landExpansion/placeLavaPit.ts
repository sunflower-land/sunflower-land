import cloneDeep from "lodash.clonedeep";

import Decimal from "decimal.js-light";
import type { GameState, LavaPit } from "features/game/types/game";
import type { Coordinates } from "features/game/expansion/components/MapPlacement";

export type PlaceLavaPitAction = {
  type: "lavaPit.placed";
  name: "Lava Pit";
  id: string;
  coordinates: Coordinates;
  location?: "farm";
};

type Options = {
  state: Readonly<GameState>;
  action: PlaceLavaPitAction;
  createdAt?: number;
};

export function placeLavaPit({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game = cloneDeep(state) as GameState;

  const available = (game.inventory["Lava Pit"] || new Decimal(0)).minus(
    Object.values(game.lavaPits).filter(
      (lavaPit) => lavaPit.x !== undefined && lavaPit.y !== undefined,
    ).length,
  );

  if (available.lt(1)) {
    throw new Error("No lava pit available");
  }

  if (game.lavaPits[action.id]) {
    throw new Error("ID exists");
  }

  const existingLavaPit = Object.entries(game.lavaPits).find(
    ([_, lavaPit]) => lavaPit.x === undefined && lavaPit.y === undefined,
  );

  if (existingLavaPit) {
    const [id, lavaPit] = existingLavaPit;
    const updatedLavaPit = {
      ...lavaPit,
      x: action.coordinates.x,
      y: action.coordinates.y,
    };

    if (updatedLavaPit.startedAt && updatedLavaPit.removedAt) {
      // Pause the burn across the lift by shifting every timestamp it owns by
      // the downtime, so the unplaced interval doesn't count. The duration is a
      // SNAPSHOT taken when the burn started - re-deriving it here from current
      // state would re-price an in-flight burn with boosts equipped after it
      // began (equip the Obsidian Necklace, lift, re-place, and 72h becomes
      // 36h). A pit with no stored `readyAt` keeps none: inventing one is the
      // same re-derivation, and `collectLavaPit` already falls back to
      // `startedAt` when it's absent.
      const downtime = Math.max(0, createdAt - updatedLavaPit.removedAt);
      updatedLavaPit.startedAt += downtime;
      if (updatedLavaPit.readyAt !== undefined) {
        updatedLavaPit.readyAt += downtime;
      }
    }
    delete updatedLavaPit.removedAt;

    game.lavaPits[id] = updatedLavaPit;

    return game;
  }

  const lavaPit: LavaPit = {
    createdAt,
    x: action.coordinates.x,
    y: action.coordinates.y,
  };

  game.lavaPits = {
    ...game.lavaPits,
    [action.id as unknown as number]: lavaPit,
  };

  return game;
}
