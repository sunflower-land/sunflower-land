import { NPCName } from "lib/npcs";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { Airdrop } from "features/game/types/game";
import { Button } from "components/ui/Button";

import giftIcon from "assets/icons/gift.png";
import chestIcon from "assets/icons/chest.png";
import walletIcon from "assets/icons/wallet.png";
import sfl from "assets/icons/token_2.png";
import lock from "assets/skills/lock.png";

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

const RequiresWallet: React.FC<{
  requiresWallet: boolean;
  hasWallet: boolean;
}> = ({ requiresWallet, hasWallet, children }) => {
  const [acknowledged, setAcknowledged] = useState(false);
  const { t } = useAppTranslation();

  if (!hasWallet && !acknowledged) {
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
}> = ({ onClose, npcName, event, eventName }) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [reward, setReward] = useState<Airdrop & { day: number }>();
  const task = useRef<Task>();
  const [showLink, setShowLink] = useState(false);

  const { t } = useAppTranslation();
  const {
    state: { inventory, balance },
    linkedWallet,
  } = gameState.context;

  const claimReward = (day: number) => {
    task.current = event.tasks[day - 1];

    gameService.send("specialEvent.taskCompleted", {
      event: eventName,
      task: day,
    });
    setReward({
      items: task.current.reward.items,
      sfl: task.current.reward.sfl,
      createdAt: Date.now(),
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
            task.requirements.items[itemName] ?? 0
          )
        ) {
          return false;
        }
        return true;
      }
    );

    if (!hasItemRequirement) return false;
    if ((balance ?? new Decimal(0)).lt(task.requirements.sfl)) return false;

    return true;
  };

  const getTaskStartDate = (day: number): Date => {
    const taskIndex = day - 1;
    const previousTaskIndex = taskIndex - 1;

    const currentDay = Math.floor(
      (Date.now() - event.startAt) / TWENTY_FOUR_HOURS
    );

    const previousTask = event.tasks[previousTaskIndex];

    if (previousTask?.completedAt) {
      const previousDay = Math.floor(
        (previousTask.completedAt - event.startAt) / TWENTY_FOUR_HOURS
      );
      return new Date(event.startAt + (previousDay + 1) * 24 * 60 * 60 * 1000);
    }

    return new Date(
      event.startAt + (currentDay + taskIndex) * 24 * 60 * 60 * 1000
    );
  };

  if (showLink) {
    return (
      <>
        <div className="p-2">
          <Label icon={giftIcon} type="warning" className="mb-2">
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

  if (event.endAt < Date.now()) {
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
              {secondsToString(Math.floor((event.endAt - Date.now()) / 1000), {
                length: "medium",
                removeTrailingZeros: true,
              })}{" "}
              {t("remaining")}
            </Label>
          </div>
          <div
            style={{ maxHeight: CONTENT_HEIGHT }}
            className="overflow-y-auto scrollable pr-3 pl-2 "
          >
            <div className="h-16">
              <Dialogue trail={25} message={event.text} />
            </div>
            {event?.tasks.map((task, index) => (
              <>
                <div className="flex justify-between items-center mb-2">
                  <Label
                    type="default"
                    className="capitalize"
                    icon={SUNNYSIDE.icons.stopwatch}
                  >
                    {`${t("day")} ${index + 1}`}
                  </Label>
                  <div className="flex justify-end space-x-3">
                    {getKeys(task.reward.items).map((itemName) => (
                      <Label type="warning" icon={chestIcon} key={itemName}>
                        {`${task.reward.items[itemName]} ${itemName}`}
                      </Label>
                    ))}
                    {!!task.isAirdrop && (
                      <Label type="warning" icon={giftIcon} key={"label"}>
                        {t("special.event.airdrop")}
                      </Label>
                    )}
                    {getKeys(task.reward.wearables).map((wearableName) => (
                      <Label type="warning" icon={chestIcon} key={wearableName}>
                        {`${task.reward.wearables[wearableName]} ${wearableName}`}
                      </Label>
                    ))}
                    {!!task.reward.sfl && (
                      <Label type="warning" icon={sfl} className="">
                        {`${task.reward.sfl} SFL`}
                      </Label>
                    )}
                  </div>
                </div>

                <OuterPanel className="-ml-2 -mr-2 relative flex flex-col space-y-0.5 mb-3">
                  {getKeys(task.requirements.items).map((itemName) => {
                    return (
                      <RequirementLabel
                        key={itemName}
                        type="item"
                        item={itemName}
                        balance={inventory[itemName] ?? new Decimal(0)}
                        showLabel
                        requirement={
                          new Decimal(task.requirements.items[itemName] ?? 0)
                        }
                      />
                    );
                  })}
                  <div className="flex justify-between items-center">
                    <div>
                      {!!task.completedAt && task.airdropUrl && (
                        <a
                          href={task.airdropUrl}
                          className="underline text-xs ml-0.5"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t("special.event.link")}
                        </a>
                      )}
                    </div>
                    {task.completedAt ? (
                      <div className="flex">
                        <span className="text-xs mr-1">{t("completed")}</span>
                        <img src={SUNNYSIDE.icons.confirm} className="h-4" />
                      </div>
                    ) : getTaskStartDate(index + 1).getTime() < Date.now() ? (
                      <Button
                        onClick={() => claimReward(index + 1)}
                        disabled={!hasRequirements(index + 1)}
                        className="text-xs w-24 h-8"
                      >
                        {t("complete")}
                      </Button>
                    ) : index >= 1 && !!event?.tasks[index - 1].completedAt ? (
                      <Label type="info" icon={lock}>
                        {formatDateTime(
                          getTaskStartDate(index + 1).toISOString()
                        )}
                      </Label>
                    ) : null}
                  </div>
                </OuterPanel>
              </>
            ))}
          </div>
        </div>
      </RequiresWallet>
    </>
  );
};
