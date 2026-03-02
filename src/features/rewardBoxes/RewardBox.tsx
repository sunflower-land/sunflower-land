import React, { useContext, useState } from "react";

import { Label } from "components/ui/Label";
import { Context, useGame } from "features/game/GameProvider";
import { RewardBoxName, REWARD_BOXES } from "features/game/types/rewardBoxes";
import { useActor, useSelector } from "@xstate/react";

import { getKeys } from "features/game/types/decorations";
import { Modal } from "components/ui/Modal";
import { ITEM_DETAILS } from "features/game/types/images";
import classNames from "classnames";
import { Panel } from "components/ui/Panel";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";

import { InventoryItemName } from "features/game/types/game";
import coinsIcon from "assets/icons/coins.webp";
import vipIcon from "assets/icons/vip.webp";
import flowerTokenIcon from "assets/icons/flower_token.webp";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";

export const RewardBox: React.FC = () => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const unOpenedBox = getKeys(REWARD_BOXES).find(
    (name) => !!gameState.context.state.inventory[name]?.gte(1),
  );

  const activeBox = getKeys(REWARD_BOXES).find(
    (name) => !!gameState.context.state.rewardBoxes?.[name]?.spunAt,
  );

  const box = activeBox || unOpenedBox;

  if (!gameState.matches("playing") && !gameState.matches("autosaving")) {
    return null;
  }

  return <Modal show={!!box}>{box && <OpeningBox name={box} />}</Modal>;
};

type BoxRewardName = InventoryItemName | "Coins" | "VIP" | "Flower";

// Animation duration for each crow
const ANIMATION_DURATION = 1800;
// Delay between each crow's animation
const SEQUENCE_DELAY = 600;

export const OpeningBox: React.FC<{ name: RewardBoxName }> = ({ name }) => {
  const [openedAt, setOpenedAt] = useState(0);
  const { gameService, gameState } = useGame();
  const { t } = useAppTranslation();

  const now = useNow({ live: true });
  // Check if there is a reward
  const reward = useSelector(
    gameService,
    (state) => state.context.state.rewardBoxes?.[name]?.reward,
  );

  const readyToView = openedAt + 3000 < now && !!reward;

  // Get all available rarecrow names
  const itemNames: BoxRewardName[] = REWARD_BOXES[name].rewards.reduce(
    (acc, reward) => {
      let names: BoxRewardName[] = [...acc];
      if (reward.items) {
        names = [...names, ...getKeys(reward.items)];
      }
      if (reward.coins) {
        names = [...names, "Coins"];
      }
      if (reward.vipDays) {
        names = [...names, "VIP"];
      }
      if (reward.flower) {
        names = [...names, "Flower"];
      }
      return names;
    },
    [] as BoxRewardName[],
  );

  const getCurrentRewards = (itemNames: BoxRewardName[]) => {
    // Shuffle and pick 4 random crows
    const shuffled = [...itemNames].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 14);
  };

  const [currentRewards] = useState(() => getCurrentRewards(itemNames));

  const open = () => {
    gameService.send({ type: "rewardBox.opened", name });
    gameService.send({ type: "SAVE" });
    setOpenedAt(Date.now());
  };

  const onClaimed = () => {
    gameService.send({ type: "rewardBox.acknowledged", name });
    gameService.send({ type: "SAVE" });
  };

  const isOpened = !!gameState.context.state.rewardBoxes?.[name]?.spunAt;

  if (readyToView) {
    return (
      <Panel>
        <ClaimReward
          reward={{
            coins: reward.coins ?? 0,
            id: "rewardBox",
            createdAt: 0,
            items: reward.items ?? {},
            wearables: {},
            sfl: reward.flower ?? 0,
            vipDays: reward!.vipDays ?? 0,
          }}
          onClaim={onClaimed}
        />
      </Panel>
    );
  }

  const positions = [
    "-top-6 -left-6", // Top left
    "-top-6 -right-6", // Top right
    "-bottom-6 -right-6", // Bottom right
    "-bottom-6 -left-6", // Bottom left

    "-top-12 right-12", // Top middle
    "top-12 -right-12", // Right middle
    "-bottom-12 right-12", // Bottom middle
    "bottom-12 -left-12", // Left middle
  ];

  return (
    <div
      className="absolute inset-0 h-full flex flex-col items-center justify-center cursor-pointer"
      onClick={open}
    >
      <div className="h-24">
        <Label type="warning" className="display-none">
          {isOpened ? "?" : t("rewardBox.tapToOpen")}
        </Label>
      </div>
      <div className="w-32 h-32 relative">
        <img
          src={ITEM_DETAILS[name].image}
          className={classNames("w-full ", { "animate-pulsate": isOpened })}
        />
        {isOpened &&
          currentRewards
            .filter((_, index) => !!positions[index])
            .map((name, index) => (
              <img
                key={`${name}-${index}`}
                src={
                  name === "Coins"
                    ? coinsIcon
                    : name === "VIP"
                      ? vipIcon
                      : name === "Flower"
                        ? flowerTokenIcon
                        : ITEM_DETAILS[name]?.image
                }
                className={`w-8 absolute ${positions[index]} opacity-0 animate-pulse`}
                style={{
                  animationDuration: `${ANIMATION_DURATION}ms`,
                  animationDelay: `${index * SEQUENCE_DELAY}ms`,
                }}
              />
            ))}
      </div>
    </div>
  );
};
