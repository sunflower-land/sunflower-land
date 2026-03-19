import { produce } from "immer";
import { GameState } from "features/game/types/game";
import {
  FarmHandAnimation,
  FARM_HAND_ANIMATIONS,
} from "features/game/types/farmhands";

export type UpdateFarmHandAnimationAction = {
  type: "farmHand.animationUpdated";
  id: string;
  animation: FarmHandAnimation;
};

type Options = {
  state: Readonly<GameState>;
  action: UpdateFarmHandAnimationAction;
  createdAt?: number;
};

export function updateFarmHandAnimation({ state, action }: Options): GameState {
  return produce(state, (game) => {
    const farmHand = game.farmHands.bumpkins[action.id];

    if (!farmHand) {
      throw new Error("Farm hand does not exist");
    }

    if (!FARM_HAND_ANIMATIONS.includes(action.animation)) {
      throw new Error("Invalid animation");
    }

    farmHand.animation = action.animation;
  });
}
