import { useActor } from "@xstate/react";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { ButtonPanel, InnerPanel, OuterPanel } from "components/ui/Panel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";
import React, { useContext, useState } from "react";

import lockIcon from "assets/icons/lock.png";
import coinsIcon from "assets/icons/coins.webp";
import wearablesIcon from "assets/icons/wearables.webp";
import unicornHatIcon from "assets/icons/unicorn_hat.webp";

import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import {
  DAILY_CHALLENGES,
  DailyChallenge,
  ONBOARDING_CHALLENGES,
} from "features/game/types/rewards";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { Button } from "components/ui/Button";
import { ResizableBar } from "components/ui/ProgressBar";
import { ClaimReward } from "./ClaimReward";
import {
  isOnboardingChallenges,
  RICHIE_ONBOARDING_MS,
} from "features/game/events/landExpansion/completeDailyChallenge";
import { secondsToString } from "lib/utils/time";
import { getKeys } from "features/game/types/decorations";
import { MapPlacement } from "./MapPlacement";
import { hasFeatureAccess } from "lib/flags";
import { NPCPlaceable } from "features/island/bumpkin/components/NPC";
import { NPC_WEARABLES } from "lib/npcs";

import levelUp from "assets/icons/level_up.png";
import shopIcon from "assets/icons/shop.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

/**
 * Getting build errors when inside of tests so images live here
 */
export const TASK_ICONS: string[] = [
  ITEM_DETAILS.Axe.image,
  levelUp,
  ITEM_DETAILS.Sunflower.image,
  SUNNYSIDE.icons.player,
  SUNNYSIDE.icons.heart,
  ITEM_DETAILS.Pickaxe.image,
  ITEM_DETAILS.Hammer.image,
  SUNNYSIDE.icons.player,
  SUNNYSIDE.tools.fishing_rod,
  SUNNYSIDE.icons.hank,
  SUNNYSIDE.icons.pete,
  shopIcon,
];

export const Richie: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [reward, setReward] = useState<DailyChallenge>();
  const [challenge, setChallenge] = useState<DailyChallenge>();

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const { t } = useAppTranslation();
  if (!hasFeatureAccess(gameState.context.state, "ONBOARDING_REWARDS")) {
    return null;
  }

  const { bumpkin, rewards, createdAt, inventory } = gameState.context.state;
  const { active, completed } = rewards.challenges;

  const isOnboarding = isOnboardingChallenges({
    game: gameState.context.state,
  });

  const tasks = isOnboarding ? ONBOARDING_CHALLENGES : DAILY_CHALLENGES;
  const activeTask = tasks.find((task, index) => index === active.index);

  const finalTask = tasks[tasks.length - 1];

  const coords = () => {
    const expansionCount = inventory["Basic Land"]?.toNumber() ?? 0;

    if (expansionCount < 6) {
      return { x: -14, y: -4.5 };
    }
    if (expansionCount >= 6 && expansionCount < 21) {
      return { x: -14, y: -10.5 };
    } else {
      return { x: -14, y: -16.5 };
    }
  };

  const onClose = () => {
    setShowModal(false);
  };

  const onOpen = () => {
    setChallenge(undefined);
    setReward(undefined);
    setShowModal(true);
  };

  const { x, y } = coords();

  return (
    <>
      <MapPlacement x={x} y={y} width={4} height={4}>
        <img
          src={SUNNYSIDE.land.rewardsRaft}
          className="cursor-pointer hover:img-highlight"
          onClick={onOpen}
          style={{
            width: `${PIXEL_SCALE * 62}px`,
          }}
        />
        <div className="absolute left-16 top-14 pointer-events-none">
          <NPCPlaceable parts={NPC_WEARABLES.richie} />
        </div>
      </MapPlacement>
      <Modal show={showModal} onHide={onClose}>
        <ModalOverlay
          show={!!reward}
          onBackdropClick={() => setChallenge(undefined)}
          className="m-2"
        >
          {reward && (
            <InnerPanel>
              <ClaimReward
                onClaim={() => {
                  gameService.send("dailyChallenge.completed");
                  setReward(undefined);
                }}
                reward={{
                  createdAt: Date.now(),
                  id: "discord-bonus",
                  message: "Congratulations...",
                  items: reward.reward.items ?? {},
                  wearables: reward.reward.wearables ?? {},
                  sfl: 0,
                  coins: reward.reward.coins ?? 0,
                }}
              />
            </InnerPanel>
          )}
        </ModalOverlay>

        <ModalOverlay
          show={!!challenge}
          onBackdropClick={() => setChallenge(undefined)}
          className="m-2"
        >
          {challenge && (
            <Challenge
              challenge={challenge}
              onClose={() => setChallenge(undefined)}
              progress={challenge.progress({ game: gameState.context.state })}
            />
          )}
        </ModalOverlay>

        <CloseButtonPanel
          tabs={[
            {
              icon: SUNNYSIDE.icons.stopwatch,
              name: "Challenges",
            },
            // {
            //   icon: giftIcon,
            //   name: "Bonus",
            // },
            // {
            //   icon: trophyIcon,
            //   name: "Achievements",
            // },
          ]}
          onClose={onClose}
        >
          {completed >= ONBOARDING_CHALLENGES.length ? (
            <div className="p-1">
              <Label type="success">{t("richie.completed")}</Label>
              <p className="my-2">{t("richie.completed.description")}</p>
            </div>
          ) : (
            <div
              className="scrollable overflow-y-auto px-0.5"
              style={{ maxHeight: "370px" }}
            >
              <div className="flex justify-between mb-1">
                <Label type="default"> {t("richie.challenge")}</Label>
                {createdAt > Date.now() - RICHIE_ONBOARDING_MS && (
                  <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
                    {`${secondsToString(
                      (createdAt + RICHIE_ONBOARDING_MS - Date.now()) / 1000,
                      {
                        length: "medium",
                      },
                    )} left`}
                  </Label>
                )}
                {/* <Label type="info">3 hrs left</Label> */}
              </div>
              <div className="px-1">
                <p className="text-xs mb-4">
                  {isOnboarding
                    ? t("richie.onboarding")
                    : t("richie.dailyChallenges")}
                </p>
              </div>
              <div className="flex flex-wrap">
                {tasks
                  // Do not render last one - we render separately as a mega reward
                  .filter((_, index) => index !== tasks.length - 1)
                  .map((task, index) => {
                    let progress = task.progress({
                      game: gameState.context.state,
                    });

                    if (!isOnboarding && index > active.index) {
                      progress = 0;
                    }

                    if (progress > task.requirement) {
                      progress = task.requirement;
                    }

                    const isReadyToClaim =
                      progress >= task.requirement && active.index === index;

                    let icon: string | undefined;

                    if (active.index > index) {
                      icon = SUNNYSIDE.icons.confirm;
                    }

                    if (index > active.index) {
                      icon = lockIcon;
                    }

                    return (
                      <div className="w-1/2 sm:w-1/3" key={index}>
                        <ButtonPanel
                          key={index}
                          className="flex justify-center flex-col items-center mx-1 relative mb-2 h-28"
                          disabled={index !== active.index}
                          onClick={() =>
                            isReadyToClaim
                              ? setReward(task)
                              : setChallenge(task)
                          }
                        >
                          <Label
                            className="absolute -top-4 -mb-3"
                            icon={icon}
                            type={
                              index === active.index ? "formula" : "default"
                            }
                          >
                            {`${isOnboarding ? "Task" : "Day"} ${index + 1}`}
                          </Label>
                          <div className="flex items-center">
                            <span className="text-sm mr-0.5">{`${progress}/${task.requirement}`}</span>
                            <img src={TASK_ICONS[index]} className="h-6" />
                          </div>
                          <span className="text-xs text-center whitespace-nowrap overflow-x-clip w-full text-ellipsis  mb-5">
                            {task.description}
                          </span>
                          {isReadyToClaim && (
                            <img
                              src={SUNNYSIDE.icons.mouse}
                              className="absolute z-10 bottom-0 -right-2 pointer-events-none animate-pulsate"
                              style={{
                                width: `${PIXEL_SCALE * 11}px`,
                              }}
                            />
                          )}
                          {task.reward.coins && (
                            <Label
                              type="warning"
                              icon={coinsIcon}
                              className="absolute -bottom-2 text-center p-1 "
                              style={{
                                left: `${PIXEL_SCALE * -3}px`,
                                right: `${PIXEL_SCALE * -3}px`,
                                width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
                                height: "25px",
                              }}
                            >{`${task.reward.coins}`}</Label>
                          )}
                          {getKeys(task.reward.wearables ?? {}).map(
                            (wearable) => (
                              <Label
                                key={wearable}
                                type="warning"
                                icon={wearablesIcon}
                                className="absolute -bottom-2 text-center p-1 "
                                style={{
                                  left: `${PIXEL_SCALE * -3}px`,
                                  right: `${PIXEL_SCALE * -3}px`,
                                  width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
                                  height: "25px",
                                }}
                              >{`${wearable}`}</Label>
                            ),
                          )}
                          {getKeys(task.reward.items ?? {}).map((name) => (
                            <Label
                              type="warning"
                              key={name}
                              icon={ITEM_DETAILS[name].image}
                              className="absolute -bottom-2 text-center p-1 "
                              style={{
                                left: `${PIXEL_SCALE * -3}px`,
                                right: `${PIXEL_SCALE * -3}px`,
                                width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
                                height: "25px",
                              }}
                            >
                              {[
                                (task.reward.items?.[name] ?? 0) > 1
                                  ? task.reward.items?.[name] ?? 0
                                  : undefined,
                                name,
                              ]
                                .filter(Boolean)
                                .join(" x ")}
                            </Label>
                          ))}
                        </ButtonPanel>
                      </div>
                    );
                  })}
              </div>

              <OuterPanel className="flex justify-center flex-col items-center mx-1 relative mt-4">
                <Label
                  className="absolute -top-5 -mb-3"
                  icon={lockIcon}
                  type={
                    tasks.length - 1 === active.index ? "formula" : "default"
                  }
                >
                  {t("richie.final")}
                </Label>
                <p className="text-sm  my-2">{finalTask.description}</p>
                <div className="flex flex-wrap justify-center space-x-3">
                  {finalTask.reward.coins && (
                    <Label
                      type="warning"
                      className="mb-1 "
                      icon={coinsIcon}
                    >{`${finalTask.reward.coins}`}</Label>
                  )}

                  {getKeys(finalTask.reward.items ?? {}).map((name) => (
                    <Label
                      className="mb-1"
                      type="warning"
                      icon={ITEM_DETAILS[name].image}
                      key={name}
                    >
                      {[
                        (finalTask.reward.items?.[name] ?? 0) > 1
                          ? finalTask.reward.items?.[name] ?? 0
                          : undefined,
                        name,
                      ]
                        .filter(Boolean)
                        .join(" x ")}
                    </Label>
                  ))}
                </div>
                {getKeys(finalTask.reward.wearables ?? {}).map((wearable) => (
                  <Label
                    type="vibrant"
                    className="mb-1"
                    icon={unicornHatIcon}
                    key={wearable}
                  >{`${wearable} - RARE`}</Label>
                ))}
                <Button
                  disabled={
                    active.index !== tasks.length - 1 ||
                    finalTask.progress({ game: gameState.context.state }) <
                      finalTask.requirement
                  }
                  onClick={() => setReward(finalTask)}
                >
                  {t("complete")}
                </Button>
              </OuterPanel>
            </div>
          )}
        </CloseButtonPanel>
      </Modal>
    </>
  );
};

const Challenge: React.FC<{
  challenge: DailyChallenge;
  onClose: () => void;
  progress: number;
}> = ({ challenge, onClose, progress }) => {
  const { t } = useAppTranslation();
  const percentageComplete = (progress / challenge.requirement) * 100;

  return (
    <InnerPanel>
      <div className="p-1">
        <img
          src={SUNNYSIDE.icons.close}
          className="absolute top-2 right-2 w-6 cursor-pointer"
          onClick={onClose}
        />
        <Label type="default">{t("richie.challenge")}</Label>
        <p className="text-sm mb-1">{challenge?.description}</p>
        <div className="flex items-center mb-2 flex-wrap">
          <span className="text-sm mr-1">{`${progress}/${challenge.requirement}`}</span>
          <ResizableBar percentage={percentageComplete} type="progress" />
        </div>
        {challenge.reward.coins && (
          <Label
            type="warning"
            icon={coinsIcon}
          >{`${challenge.reward.coins} Coins`}</Label>
        )}
      </div>
    </InnerPanel>
  );
};
