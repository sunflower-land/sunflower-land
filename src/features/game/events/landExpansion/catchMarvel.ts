import { GameState } from "features/game/types/game";
import { produce } from "immer";
import { MarineMarvelName } from "features/game/types/fishing";
import Decimal from "decimal.js-light";
import { trackFarmActivity } from "features/game/types/farmActivity";

export type CatchMarvelAction = {
  type: "marvel.caught";
  name: MarineMarvelName;
};

type Options = {
  state: Readonly<GameState>;
  action: CatchMarvelAction;
  createdAt?: number;
};

export function catchMarvel({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    // Requires player has not already caught the Marvel
    if (game.farmActivity[`${action.name} Caught`]) {
      throw new Error("Player has already caught the Marvel");
    }

    // Requires player has the map pieces
    const mapPiecesFound =
      game.farmActivity[`${action.name} Map Piece Found`] ?? 0;
    if (mapPiecesFound < 9) {
      throw new Error("Player does not have the map pieces");
    }

    game.inventory[action.name] = (
      game.inventory[action.name] ?? new Decimal(0)
    ).add(1);

    game.farmActivity = trackFarmActivity(
      `${action.name} Caught`,
      game.farmActivity,
      new Decimal(1),
    );

    return game;
  });
}
