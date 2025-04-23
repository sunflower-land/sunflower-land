import { GameState } from "features/game/types/game";
import {
  RewardBoxName,
  RewardBoxReward,
  REWARD_BOXES,
} from "features/game/types/rewardBoxes";
import { produce } from "immer";
import { CONFIG } from "lib/config";
import Decimal from "decimal.js-light";

function getReward({
  name,
  game,
}: {
  name: RewardBoxName;
  game: GameState;
}): RewardBoxReward | undefined {
  const rewards = REWARD_BOXES[name].rewards;

  // TODO: If a player already has the reward, half the weight

  const totalWeight = rewards.reduce((sum, reward) => sum + reward.weight, 0);
  let randomValue = Math.random() * totalWeight;

  let selectedReward: RewardBoxReward | undefined;
  for (const reward of rewards) {
    randomValue -= reward.weight;
    if (randomValue <= 0) {
      selectedReward = reward;
      break;
    }
  }

  return selectedReward;
}

export type OpenRewardBoxAction = {
  type: "rewardBox.opened";
  name: RewardBoxName;
};

type Options = {
  state: Readonly<GameState>;
  action: OpenRewardBoxAction;
  createdAt?: number;
};

export function openRewardBox({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (stateCopy) => {
    const { name } = action;

    // Check if the gacha type exists
    if (!(name in REWARD_BOXES)) {
      throw new Error(`Invalid gacha name: ${name}`);
    }

    if (stateCopy.rewardBoxes?.[name]?.reward) {
      throw new Error(
        `There's an unclaimed prize for ${name}. Claim it before spinning again.`,
      );
    }

    const boxCount = stateCopy.inventory[name] ?? new Decimal(0);
    if (boxCount.lt(1)) {
      throw new Error(`Box does not exist`);
    }

    stateCopy.inventory[name] = boxCount.minus(1);

    if (!stateCopy.rewardBoxes) {
      stateCopy.rewardBoxes = {};
    }

    const history = stateCopy.rewardBoxes?.[name]?.history ?? {};

    // Let the API handle the prize
    if (CONFIG.API_URL) {
      stateCopy.rewardBoxes[name] = {
        spunAt: createdAt,
        history,
      };

      return stateCopy;
    }

    // Local testing only

    const selectedReward = getReward({ name, game: stateCopy });

    if (!selectedReward) {
      throw new Error(`No reward found for ${name}`);
    }

    if (!stateCopy.rewardBoxes) {
      stateCopy.rewardBoxes = {};
    }

    // Update gacha state with the new prize - UI only
    stateCopy.rewardBoxes[name] = {
      spunAt: createdAt,
      reward: selectedReward,
      history: {},
    };

    return stateCopy;
  });
}
