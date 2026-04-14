import { GameState, InventoryItemName } from "features/game/types/game";
import {
  RewardBoxName,
  RewardBoxReward,
  REWARD_BOXES,
  getPetRewardPool,
} from "features/game/types/rewardBoxes";
import { produce } from "immer";
import { CONFIG } from "lib/config";
import Decimal from "decimal.js-light";
import { BumpkinItem } from "features/game/types/bumpkin";
import { addVipDays } from "../claimAirdrop";

function getReward({
  name,
  game,
}: {
  name: RewardBoxName;
  game: GameState;
}): RewardBoxReward | undefined {
  let rewards = REWARD_BOXES[name].rewards;

  if (name === "Pet Egg") {
    rewards = getPetRewardPool({ inventory: game.inventory });
  }

  if (name === "Bronze Food Box" || name === "Silver Food Box") {
    rewards = rewards.map((reward) => {
      if (!reward.items || !("Fermented Fish" in reward.items)) {
        return reward;
      }

      const { ["Fermented Fish"]: fermentedFish, ...rest } = reward.items;

      return {
        ...reward,
        items: {
          ...rest,
          "Surimi Rice Bowl": fermentedFish,
        },
      };
    });
  }

  // TODO: If a player already has the reward, half the weight

  const totalWeight = rewards.reduce(
    (sum, reward) => sum + reward.weighting,
    0,
  );
  let randomValue = Math.random() * totalWeight;

  let selectedReward: RewardBoxReward | undefined;
  for (const reward of rewards) {
    randomValue -= reward.weighting;
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

    const history = stateCopy.rewardBoxes?.[name]?.history ?? {
      total: 0,
    };

    // Let the API handle the prize
    if (CONFIG.API_URL) {
      stateCopy.rewardBoxes[name] = {
        spunAt: createdAt,
        history,
      };

      return stateCopy;
    }

    // Local testing only

    const selectedReward = getReward({
      name,
      game: stateCopy,
    });

    if (!selectedReward) {
      throw new Error(`No reward found for ${name}`);
    }

    history.total = history.total + 1;

    if (selectedReward.wearables) {
      history.wearables = {
        ...(history.wearables ?? {}),
        ...selectedReward.wearables,
      };

      Object.entries(selectedReward.wearables).forEach(([item, amount]) => {
        const previous = stateCopy.wardrobe[item as BumpkinItem] ?? 0;
        stateCopy.wardrobe[item as BumpkinItem] = previous + amount;
      });
    }

    if (selectedReward.items) {
      history.items = {
        ...(history.items ?? {}),
        ...selectedReward.items,
      };

      Object.entries(selectedReward.items).forEach(([item, amount]) => {
        const previous =
          stateCopy.inventory[item as InventoryItemName] ?? new Decimal(0);
        stateCopy.inventory[item as InventoryItemName] = previous.plus(amount);
      });
    }

    if (selectedReward.coins) {
      history.coins = (history.coins ?? 0) + selectedReward.coins;
      stateCopy.coins = stateCopy.coins + selectedReward.coins;
    }

    if (selectedReward.vipDays) {
      history.vipDays = (history.vipDays ?? 0) + selectedReward.vipDays;
      stateCopy.vip = addVipDays({
        game: stateCopy,
        vipDays: selectedReward.vipDays,
        createdAt,
      });
    }

    if (selectedReward.flower) {
      history.flower = (history.flower ?? 0) + selectedReward.flower;
      stateCopy.balance = stateCopy.balance.plus(selectedReward.flower);
    }

    // Update gacha state with the new prize - UI only
    stateCopy.rewardBoxes[name] = {
      spunAt: createdAt,
      reward: selectedReward,
      history,
    };

    return stateCopy;
  });
}
