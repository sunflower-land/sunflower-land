import React, { useContext, useEffect, useRef, useState } from "react";

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

export const OpeningBox: React.FC<{ name: RewardBoxName }> = ({ name }) => {
  const openedAt = useRef<number>(0);
  const { gameService, gameState } = useGame();
  const { t } = useAppTranslation();
  // Animation duration for each crow
  const ANIMATION_DURATION = 1800;
  // Delay between each crow's animation
  const SEQUENCE_DELAY = 600;

  const [isReady, setIsReady] = useState(false);

  // Every second, check whether it is time to show
  // We have this effect, to ensure the animation shows for at least 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const reward =
        gameService.getSnapshot().context.state.rewardBoxes?.[name]?.reward;
      const readyToView = openedAt.current + 3000 < Date.now() && !!reward;

      setIsReady(readyToView);
    }, 1000);
    return () => clearInterval(interval);
  }, [name]);

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

  // Shuffle and pick 4 random crows
  const shuffled = [...itemNames].sort(() => Math.random() - 0.5);
  const currentRewards = useRef(shuffled.slice(0, 14));

  // Check if there is a reward
  const reward = useSelector(
    gameService,
    (state) => state.context.state.rewardBoxes?.[name]?.reward,
  );

  const open = () => {
    gameService.send("rewardBox.opened", { name });
    gameService.send("SAVE");
    openedAt.current = Date.now();
  };

  const onClaimed = () => {
    gameService.send("rewardBox.acknowledged", { name });
    gameService.send("SAVE");
  };

  const isOpened = !!gameState.context.state.rewardBoxes?.[name]?.spunAt;

  if (isReady && reward) {
    return (
      <Panel>
        <ClaimReward
          reward={{
            coins: reward!.coins ?? 0,
            id: "rewardBox",
            createdAt: 0,
            items: reward!.items ?? {},
            wearables: {},
            sfl: reward!.flower ?? 0,
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
          currentRewards.current
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
