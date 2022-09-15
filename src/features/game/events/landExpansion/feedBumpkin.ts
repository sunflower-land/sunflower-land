import { ConsumableName } from "features/game/types/consumables";
import { GameState } from "features/game/types/game";

export type FeedBumpkinAction = {
  type: "bumpkin.feed";
  item: ConsumableName;
  buildingId: string;
};

type Options = {
  state: Readonly<GameState>;
  action: FeedBumpkinAction;
  createdAt?: number;
};

export function feedBumpkin({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  console.log(action.item);
  return state;
}
