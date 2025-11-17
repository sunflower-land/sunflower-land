import {
  BASIC_REWARDS,
  RARE_REWARDS,
  LUXURY_REWARDS,
  BUD_BOX_REWARDS,
  GIFT_GIVER_REWARDS,
  BASIC_DESERT_STREAK,
  ADVANCED_DESERT_STREAK,
  EXPERT_DESERT_STREAK,
  PIRATE_CHEST_REWARDS,
  MANEKI_NEKO_REWARDS,
  FESTIVE_TREE_REWARDS,
} from "features/game/types/chests";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { useContext, useEffect, useMemo, useState } from "react";

import sfl from "assets/icons/flower_token.webp";
import coins from "assets/icons/coins.webp";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { getKeys } from "features/game/types/craftables";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { getImageUrl } from "lib/utils/getImageURLS";
import { GameState, Keys } from "features/game/types/game";
import {
  possibleRewards,
  BASIC_DAILY_REWARDS,
  ADVANCED_DAILY_REWARDS,
  EXPERT_DAILY_REWARDS,
} from "features/game/types/collectDailyReward";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { RewardBoxReward } from "features/game/types/rewardBoxes";

export type ChestRewardType =
  | Keys
  | "Bud Box"
  | "Gift Giver"
  | "Basic Desert Rewards"
  | "Advanced Desert Rewards"
  | "Expert Desert Rewards"
  | "Pirate Chest"
  | "Maneki Neko"
  | "Daily Reward"
  | "Basic Daily Rewards"
  | "Advanced Daily Rewards"
  | "Expert Daily Rewards"
  | "Festive Tree Rewards";

interface Props {
  type: ChestRewardType;
}

export const CHEST_LOOT: (
  game: GameState,
) => Record<ChestRewardType, RewardBoxReward[]> = (state) => ({
  "Treasure Key": BASIC_REWARDS(),
  "Rare Key": RARE_REWARDS(),
  "Luxury Key": LUXURY_REWARDS(),
  "Bud Box": BUD_BOX_REWARDS,
  "Gift Giver": GIFT_GIVER_REWARDS,
  "Basic Desert Rewards": BASIC_DESERT_STREAK,
  "Advanced Desert Rewards": ADVANCED_DESERT_STREAK,
  "Expert Desert Rewards": EXPERT_DESERT_STREAK,
  "Pirate Chest": PIRATE_CHEST_REWARDS,
  "Maneki Neko": MANEKI_NEKO_REWARDS,
  "Daily Reward": possibleRewards(state),
  "Basic Daily Rewards": BASIC_DAILY_REWARDS,
  "Advanced Daily Rewards": ADVANCED_DAILY_REWARDS,
  "Expert Daily Rewards": EXPERT_DAILY_REWARDS,
  "Festive Tree Rewards": FESTIVE_TREE_REWARDS,
});

export const ChestRevealing: React.FC<Props> = ({ type }) => {
  const [{ image, label }, setDisplay] = useState<{
    image?: string;
    label?: string;
  }>({});

  const { gameService } = useContext(Context);
  const state = useSelector(gameService, (state) => state.context.state);

  const chestLoot = useMemo(() => CHEST_LOOT(state), [state]);
  const items = chestLoot[type];

  useEffect(() => {
    // Early return if no items - don't update state here
    if (!items?.length) {
      return;
    }

    const pickRandomReward = () => {
      setDisplay((prev) => {
        const chooseDisplay = () => {
          const randomItem = items[Math.floor(Math.random() * items.length)];

          if (randomItem.flower) {
            return {
              image: sfl,
              label: `${randomItem.flower} FLOWER`,
            };
          }

          if (randomItem.coins) {
            return {
              image: coins,
              label: `${randomItem.coins} Coins`,
            };
          }

          if (randomItem.wearables) {
            const randomWearable = getKeys(randomItem.wearables)[0];

            if (randomWearable) {
              return {
                image: getImageUrl(ITEM_IDS[randomWearable]),
                label: randomWearable,
              };
            }
          }

          if (randomItem.items) {
            const names = getKeys(randomItem.items);

            if (names.length) {
              const first = names[0];

              return {
                image: ITEM_DETAILS[first].image,
                label: names
                  .map((name) => `${randomItem.items?.[name]} ${name}`)
                  .join(" - "),
              };
            }
          }

          return prev;
        };

        let attempt = 0;
        let next = chooseDisplay();

        // Try to avoid repeating the same image consecutively.
        while (next.image === prev.image && attempt < items.length) {
          next = chooseDisplay();
          attempt += 1;
        }

        return next;
      });
    };

    // Pick an initial reward immediately.
    pickRandomReward();

    const interval = setInterval(pickRandomReward, 500);

    return () => clearInterval(interval);
  }, [items]);

  // Render nothing if there are no items
  if (!items?.length) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center h-44 gap-2">
      <div className="flex flex-col items-center justify-center gap-2">
        {label && (
          <Label icon={SUNNYSIDE.decorations.treasure_chest} type="default">
            {label}
          </Label>
        )}
        {image && <img src={image} className="h-20 mb-5" />}
      </div>
    </div>
  );
};
