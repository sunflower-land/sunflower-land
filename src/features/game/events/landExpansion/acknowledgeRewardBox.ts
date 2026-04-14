import { GameState } from "features/game/types/game";
import { RewardBoxName } from "features/game/types/rewardBoxes";
import { produce } from "immer";

export type AcknowledgeRewardBoxAction = {
  type: "rewardBox.acknowledged";
  name: RewardBoxName;
};

type Options = {
  state: Readonly<GameState>;
  action: AcknowledgeRewardBoxAction;
};

export function acknowledgeRewardBox({ state, action }: Options): GameState {
  return produce(state, (stateCopy) => {
    const { name } = action;

    // Check if there's a prize to claim
    if (!stateCopy.rewardBoxes?.[name]?.reward) {
      throw new Error(`No prize available to acknowledge for ${name}`);
    }

    // Clear the claimed rewards
    delete stateCopy.rewardBoxes[name]?.reward;
    delete stateCopy.rewardBoxes[name]?.spunAt;

    return stateCopy;
  });
}
