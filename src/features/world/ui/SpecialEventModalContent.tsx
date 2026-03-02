import { NPCName } from "lib/npcs";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import walletIcon from "assets/icons/wallet.png";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { Airdrop } from "features/game/types/game";
import { Button } from "components/ui/Button";
import gift from "assets/icons/gift.png";
import token from "assets/icons/flower_token.webp";
import chest from "assets/icons/chest.png";

import Decimal from "decimal.js-light";
import { OuterPanel } from "components/ui/Panel";
import { getKeys } from "features/game/types/craftables";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { formatDateTime, secondsToString } from "lib/utils/time";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import {
  SpecialEvent,
  SpecialEventName,
  Task,
} from "features/game/types/specialEvents";
import { GameWallet } from "features/wallet/Wallet";
import classNames from "classnames";
import { ITEM_DETAILS } from "features/game/types/images";
import { useNow } from "lib/utils/hooks/useNow";
import { useCountdown } from "lib/utils/hooks/useCountdown";

export const Dialogue: React.FC<{
  message: string;
  trail?: number;
}> = ({ message, trail = 30 }) => {
  const [displayedMessage, setDisplayedMessage] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < message.length) {
        const newDisplayedMessage = message.substring(0, currentIndex + 1);
        setDisplayedMessage(newDisplayedMessage);
        setCurrentIndex(currentIndex + 1);
      } else {
        clearInterval(interval);
      }
    }, trail);

    return () => {
      clearInterval(interval);
    };
  }, [message, trail, currentIndex]);

  return <div className="leading-[1] text-[16px]">{displayedMessage}</div>;
};

const CONTENT_HEIGHT = 350;
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

const RequiresWallet: React.FC<
  React.PropsWithChildren<{
    requiresWallet: boolean;
    hasWallet: boolean;
  }>
> = ({ requiresWallet, hasWallet, children }) => {
  const [acknowledged, setAcknowledged] = useState(false);
  const { t } = useAppTranslation();

  if (requiresWallet && !hasWallet && !acknowledged) {
    return (
      <>
        <div className="p-2">
          <Label icon={walletIcon} type="default" className="mb-2">
            {t("special.event.walletRequired")}
          </Label>
          <p className="text-sm mb-2">{t("special.event.web3Wallet")}</p>
          <p className="text-xs mb-2">{t("special.event.airdropHandling")}</p>
        </div>
        <Button onClick={() => setAcknowledged(true)}>{t("continue")}</Button>
      </>
    );
  }

  return requiresWallet && !hasWallet ? (
    <GameWallet action="specialEvent">{children}</GameWallet>
  ) : (
    <>{children}</>
  );
};

export const SpecialEventModalContent: React.FC<{
  onClose: () => void;
  npcName?: NPCName;
  event: SpecialEvent;
  eventName: SpecialEventName;
}> = ({ npcName, event, eventName }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const task = useRef<Task>(undefined);
  const [reward, setReward] = useState<Airdrop & { day: number }>();
  const [showLink, setShowLink] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { t } = useAppTranslation();
  const {
    state: { inventory, balance },
    linkedWallet,
  } = gameState.context;

  const now = useNow({ live: true });
  const { totalSeconds: secondsRemaining } = useCountdown(event.endAt);

  const claimReward = (day: number) => {
    task.current = event.tasks[day - 1];

    gameService.send({
      type: "specialEvent.taskCompleted",
      event: eventName,
      task: day,
    });
    setReward({
      items: task.current.reward.items,
      sfl: task.current.reward.sfl,
      coins: 0,
      createdAt: now,
      id: `${eventName}-${day}`,
      wearables: task.current.reward.wearables,
      day,
      message: task.current.isAirdrop
        ? "Airdrops are handled externally and may take a few days to arrive."
        : undefined,
    });
  };

  const hasRequirements = (day: number): boolean => {
    const task = event.tasks[day - 1];

    const hasItemRequirement = getKeys(task.requirements.items).every(
      (itemName) => {
        if (
          (inventory[itemName] ?? new Decimal(0)).lt(
            task.requirements.items[itemName] ?? 0,
          )
        ) {
          return false;
        }
        return true;
      },
    );

    if (!hasItemRequirement) return false;
    if ((balance ?? new Decimal(0)).lt(task.requirements.sfl)) return false;

    return true;
  };

  const getTaskStartDate = (day: number): Date => {
    const taskIndex = day - 1;
    const previousTaskIndex = taskIndex - 1;

    const currentDay = Math.floor((now - event.startAt) / TWENTY_FOUR_HOURS);

    const previousTask = event.tasks[previousTaskIndex];

    if (previousTask?.completedAt) {
      const previousDay = Math.floor(
        (previousTask.completedAt - event.startAt) / TWENTY_FOUR_HOURS,
      );
      return new Date(event.startAt + (previousDay + 1) * 24 * 60 * 60 * 1000);
    }

    return new Date(
      event.startAt + (currentDay + taskIndex) * 24 * 60 * 60 * 1000,
    );
  };

  if (showLink) {
    return (
      <>
        <div className="p-2">
          <Label icon={gift} type="warning" className="mb-2">
            {t("congrats")}
          </Label>
          <p className="text-sm mb-2">{t("special.event.claimForm")}</p>
          <p className="text-xs mb-2">{t("special.event.airdropHandling")}</p>
        </div>
        <Button
          onClick={() => {
            window?.open(task.current?.airdropUrl as string, "_blank")?.focus();
          }}
        >
          {t("continue")}
        </Button>
      </>
    );
  }

  if (reward) {
    return (
      <>
        <ClaimReward
          reward={reward}
          onClose={() => {
            setReward(undefined);

            if (task.current?.airdropUrl) {
              setShowLink(true);
            }
          }}
        />
      </>
    );
  }

  if (event.endAt < now) {
    return (
      <div>
        <div className="flex justify-between items-center p-2">
          <Label
            type="default"
            className="capitalize"
            icon={SUNNYSIDE.icons.player}
          >
            {npcName ?? t("special.event.finishedLabel")}
          </Label>
        </div>

        <p className="text-sm mb-3 p-2">
          <Dialogue trail={25} message={t("special.event.finished")} />
        </p>
      </div>
    );
  }

  // isEligible should already be checked by the parent component but just in
  // case it was missed, let's check it here as well
  if (!event.isEligible) {
    return (
      <div>
        {npcName && (
          <div className="flex justify-between items-center p-2">
            <Label
              type="default"
              className="capitalize"
              icon={SUNNYSIDE.icons.player}
            >
              {npcName}
            </Label>
          </div>
        )}

        <p className="text-sm mb-3 p-2">
          <Dialogue trail={25} message={t("special.event.ineligible")} />
        </p>
      </div>
    );
  }

  const selected = event.tasks[selectedIndex];

  return (
    <>
      <RequiresWallet
        requiresWallet={event.requiresWallet}
        hasWallet={!!linkedWallet}
      >
        <div>
          <div className="flex justify-between items-center mb-3 p-2">
            {npcName && (
              <Label
                type="default"
                className="capitalize"
                icon={SUNNYSIDE.icons.player}
              >
                {npcName}
              </Label>
            )}

            <Label type="info" className="mr-8" icon={SUNNYSIDE.icons.timer}>
              {secondsToString(secondsRemaining, {
                length: "medium",
                removeTrailingZeros: true,
              })}{" "}
              {t("remaining")}
            </Label>
          </div>
          <div
            style={{ maxHeight: CONTENT_HEIGHT }}
            className="overflow-y-auto scrollable "
          >
            <div className="h-16 px-1">
              <Dialogue trail={25} message={event.text} />
            </div>
            <div className="flex flex-row w-full flex-wrap scrollable overflow-y-auto pl-1">
              {event?.tasks.map((task, index) => (
                <div className="w-1/3 sm:w-1/4 py-1 px-2" key={index}>
                  <OuterPanel
                    className={classNames(
                      "w-full cursor-pointer hover:bg-brown-200 !py-2 relative",
                      {
                        "!bg-brown-200": selectedIndex === index,
                      },
                    )}
                    style={{ paddingBottom: "20px" }}
                    onClick={() => {
                      setSelectedIndex(index);
                    }}
                  >
                    {index >= 1 && !event?.tasks[index - 1].completedAt && (
                      <img
                        src={SUNNYSIDE.icons.lock}
                        className="absolute top-[-8px] right-[-12px] w-5"
                      />
                    )}

                    <div className="flex flex-col justify-center items-center">
                      <span className="text-xs capitalize text-center mb-1">
                        {t("time.day.full")} {index + 1}
                      </span>
                      <div className="flex justify-start ml-2 h-8 items-center w-6 mb-5">
                        {getKeys(task.requirements.items).map((name) => (
                          <div className="flex items-center" key={name}>
                            <img
                              key={name}
                              src={ITEM_DETAILS[name].image}
                              className="h-6 img-highlight"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {!!task.completedAt && (
                      <Label
                        type="success"
                        className="absolute -bottom-2 text-center mt-1 p-1 left-[-8px] z-10"
                        style={{ width: "calc(100% + 16px)" }}
                      >
                        <img src={SUNNYSIDE.icons.confirm} className="h-4" />
                      </Label>
                    )}
                    {!task.completedAt && !!task.reward.sfl && (
                      <Label
                        type="warning"
                        icon={token}
                        className="absolute -bottom-2 text-center mt-1 p-1 left-[-8px] z-10"
                        style={{ width: "calc(100% + 16px)" }}
                      >
                        {`${task.reward.sfl} FLOWER`}
                      </Label>
                    )}

                    {!task.completedAt && !task.reward.sfl && (
                      <Label
                        type="warning"
                        icon={gift}
                        className="absolute -bottom-2 text-center mt-1 p-1 left-[-8px] z-10"
                        style={{ width: "calc(100% + 16px)" }}
                      >
                        {t("gift")}
                      </Label>
                    )}
                  </OuterPanel>
                </div>
              ))}
            </div>

            <OuterPanel className="relative flex flex-col space-y-0.5 my-2">
              <div className="flex justify-between items-center">
                <Label type="default" className="capitalize">
                  {t("time.day.full")} {selectedIndex + 1}
                </Label>
                {selected.completedAt && (
                  <Label type="success" icon={SUNNYSIDE.icons.confirm}>
                    {t("completed")}
                  </Label>
                )}
                {selectedIndex >= 1 &&
                  !!event?.tasks[selectedIndex - 1].completedAt && (
                    <Label type="info" icon={SUNNYSIDE.icons.lock}>
                      {formatDateTime(
                        getTaskStartDate(selectedIndex + 1).toISOString(),
                      )}
                    </Label>
                  )}
              </div>
              {getKeys(selected.requirements.items).map((itemName) => {
                return (
                  <RequirementLabel
                    key={itemName}
                    type="item"
                    item={itemName}
                    balance={inventory[itemName] ?? new Decimal(0)}
                    showLabel
                    requirement={
                      new Decimal(selected.requirements.items[itemName] ?? 0)
                    }
                  />
                );
              })}
              <div className="flex justify-between space-x-3 mt-2">
                <div className="flex items-center">
                  <img src={chest} className="w-5 mr-1" />
                  <span className="text-xs">{t("reward")}</span>
                </div>
                {getKeys(selected.reward.items).map((itemName) => (
                  <Label type="warning" key={itemName}>
                    {`${selected.reward.items[itemName]} ${itemName}`}
                  </Label>
                ))}

                {getKeys(selected.reward.wearables).map((wearableName) => (
                  <Label type="warning" key={wearableName}>
                    {`${selected.reward.wearables[wearableName]} ${wearableName}`}
                  </Label>
                ))}
                {!!selected.reward.sfl && (
                  <Label type="warning" className="">
                    {`${selected.reward.sfl} FLOWER`}
                  </Label>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  {!!selected.completedAt && selected.airdropUrl && (
                    <a
                      href={selected.airdropUrl}
                      className="underline text-xs ml-0.5"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("special.event.link")}
                    </a>
                  )}
                </div>
              </div>
            </OuterPanel>
            <Button
              onClick={() => claimReward(selectedIndex + 1)}
              disabled={
                !!selected.completedAt ||
                !hasRequirements(selectedIndex + 1) ||
                getTaskStartDate(selectedIndex + 1).getTime() > now
              }
            >
              {t("complete")}
            </Button>
          </div>
        </div>
      </RequiresWallet>
    </>
  );
};
