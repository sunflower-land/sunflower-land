import {
  BASIC_REWARDS,
  RARE_REWARDS,
  LUXURY_REWARDS,
  BUD_BOX_REWARDS,
  GIFT_GIVER_REWARDS,
  BASIC_DESERT_STREAK,
  ADVANCED_DESERT_STREAK,
  EXPERT_DESERT_STREAK,
  ChestReward,
  PIRATE_CHEST_REWARDS,
} from "features/game/types/chests";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { useCallback, useEffect } from "react";

import sfl from "assets/icons/sfl.webp";
import coins from "assets/icons/coins.webp";
import { ITEM_IDS } from "features/game/types/bumpkin";
import { getKeys } from "features/game/types/craftables";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { getImageUrl } from "lib/utils/getImageURLS";
import { Keys } from "features/game/types/game";

export type ChestRewardType =
  | Keys
  | "Bud Box"
  | "Gift Giver"
  | "Basic Desert Rewards"
  | "Advanced Desert Rewards"
  | "Expert Desert Rewards"
  | "Pirate Chest";

interface Props {
  type: ChestRewardType;
}

const CHEST_LOOT: () => Record<ChestRewardType, ChestReward[]> = () => ({
  "Treasure Key": BASIC_REWARDS(),
  "Rare Key": RARE_REWARDS(),
  "Luxury Key": LUXURY_REWARDS(),
  "Bud Box": BUD_BOX_REWARDS,
  "Gift Giver": GIFT_GIVER_REWARDS,
  "Basic Desert Rewards": BASIC_DESERT_STREAK,
  "Advanced Desert Rewards": ADVANCED_DESERT_STREAK,
  "Expert Desert Rewards": EXPERT_DESERT_STREAK,
  "Pirate Chest": PIRATE_CHEST_REWARDS,
});

export const ChestRevealing: React.FC<Props> = ({ type }) => {
  const [image, setImage] = React.useState<string>(sfl);
  const [label, setLabel] = React.useState<string>("5 SFL");

  const items = CHEST_LOOT()[type];

  const pickRandomImage = useCallback(() => {
    let newImage = image;
    let newLabel = label;

    while (newImage === image) {
      const randomItem = items[Math.floor(Math.random() * items.length)];

      if (randomItem.sfl) {
        newImage = sfl;
        newLabel = `${randomItem.sfl} SFL`;
      }

      if (randomItem.coins) {
        newImage = coins;
        newLabel = `${randomItem.coins} Coins`;
      }

      if (randomItem.wearables) {
        const randomWearable = getKeys(randomItem.wearables)[0];
        newImage = getImageUrl(ITEM_IDS[randomWearable]);
        newLabel = randomWearable;
      }

      if (randomItem.items) {
        const first = getKeys(randomItem.items)[0];
        newImage = ITEM_DETAILS[first].image;
        newLabel = getKeys(randomItem.items)
          .map((name) => `${randomItem.items?.[name]} ${name}`)
          .join(" - ");
      }
    }

    setImage(newImage);
    setLabel(newLabel);
  }, [image]);

  useEffect(() => {
    const interval = setInterval(pickRandomImage, 500);

    () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-40">
      <Label icon={SUNNYSIDE.decorations.treasure_chest} type="default">
        {label}
      </Label>
      <img src={image} className="h-24 mx-auto my-2" />
    </div>
  );
};
