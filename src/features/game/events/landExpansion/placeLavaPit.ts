import cloneDeep from "lodash.clonedeep";

import Decimal from "decimal.js-light";
import { GameState, LavaPit } from "features/game/types/game";
import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { getLavaPitTime } from "./startLavaPit";

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
      const existingProgress =
        updatedLavaPit.removedAt - updatedLavaPit.startedAt;
      updatedLavaPit.startedAt = createdAt - existingProgress;
      updatedLavaPit.readyAt =
        updatedLavaPit.startedAt + getLavaPitTime({ game }).time;
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
