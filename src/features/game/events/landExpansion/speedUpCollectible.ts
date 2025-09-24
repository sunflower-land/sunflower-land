import { GameState } from "features/game/types/game";
import { produce } from "immer";
import { CollectibleName } from "features/game/types/craftables";
import Decimal from "decimal.js-light";
import { getInstantGems, makeGemHistory } from "./speedUpRecipe";

export type SpeedUpCollectible = {
  type: "collectible.spedUp";
  name: CollectibleName;
  id: string;
};

type Options = {
  state: Readonly<GameState>;
  action: SpeedUpCollectible;
  createdAt?: number;
};

export function speedUpCollectible({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (game) => {
    const collectible = game.collectibles[action.name]?.find(
      (item) => item.id === action.id,
    );

    if (!collectible) {
      throw new Error("Collectible does not exists");
    }

    if ((collectible.readyAt ?? 0) < createdAt) {
      throw new Error("Collectible already finished");
    }

    const gems = getInstantGems({
      readyAt: collectible.readyAt ?? 0,
      now: createdAt,
      game,
    });

    if (!game.inventory["Gem"]?.gte(gems)) {
      throw new Error("Insufficient Gems");
    }

    game.inventory["Gem"] = (game.inventory["Gem"] ?? new Decimal(0)).sub(gems);

    collectible.readyAt = createdAt;

    game = makeGemHistory({ game, amount: gems });

    return game;
  });
}
