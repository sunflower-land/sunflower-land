import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPCName, NPC_WEARABLES } from "lib/npcs";
import React, { useContext, useEffect, useState } from "react";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { Airdrop } from "features/game/types/game";
import { Button } from "components/ui/Button";

import giftIcon from "assets/icons/gift.png";
import walletIcon from "assets/icons/wallet.png";
import sfl from "assets/icons/token_2.png";
import lock from "assets/skills/lock.png";

import Decimal from "decimal.js-light";
import { OuterPanel, Panel } from "components/ui/Panel";
import { getKeys } from "features/game/types/craftables";
import { RequirementLabel } from "components/ui/RequirementsLabel";
import { ClaimReward } from "features/game/expansion/components/ClaimReward";
import { formatDateTime, secondsToString } from "lib/utils/time";

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

export const SpecialEventBumpkin: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [reward, setReward] = useState<Airdrop & { day: number }>();
  const [showWallet, setShowWallet] = useState(false);
  const [showLink, setShowLink] = useState(false);

  const name: NPCName = "Chun Long";

  const { inventory, specialEvents, balance } = gameState.context.state;

  const event = specialEvents.current[getKeys(specialEvents.current)[0]];

  if (!event) {
    return <>No Event</>;
  }

  const claimReward = (day: number) => {
    const task = event.tasks[day - 1];

    gameService.send("specialEvent.taskCompleted", {
      event: "Lunar New Year",
      task: day,
    });
    setReward({
      items: task.reward.items,
      sfl: task.reward.sfl,
      createdAt: Date.now(),
      id: `lunar-new-year-${day}`,
      wearables: task.reward.wearables,
      day,
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
      <Panel>
        <div className="p-2">
          <Label icon={giftIcon} type="warning" className="mb-2">
            Congratulations!
          </Label>
          <p className="text-sm mb-2">
            Please fill in the form bellow to claim your airdrop.
          </p>
          <p className="text-xs mb-2">
            Airdrops are handled externally and may take a few days to arrive.
          </p>
        </div>
        <Button>Continue</Button>
      </Panel>
    );
  }

  if (showWallet) {
    return (
      <Panel>
        <div className="p-2">
          <Label icon={walletIcon} type="default" className="mb-2">
            Wallet Required
          </Label>
          <p className="text-sm mb-2">
            A Web3 wallet is required to claim this airdrop
          </p>
          <p className="text-xs mb-2">
            Airdrops are handled externally and may take a few days to arrive.
          </p>
        </div>
        <Button>Continue</Button>
      </Panel>
    );
  }

  if (reward) {
    return (
      <Panel>
        <ClaimReward reward={reward} onClose={() => setReward(undefined)} />
      </Panel>
    );
  }

  return (
    <CloseButtonPanel
      onClose={onClose}
      bumpkinParts={NPC_WEARABLES["Chun Long"]}
    >
      <>
        <div>
          <div className="flex justify-between items-center mb-3 p-2">
            <Label type="default" icon={SUNNYSIDE.icons.player}>
              {name}
            </Label>
            <Label type="info" className="mr-8" icon={SUNNYSIDE.icons.timer}>
              {secondsToString(Math.floor((event.endAt - Date.now()) / 1000), {
                length: "medium",
                removeTrailingZeros: true,
              })}
              {" remaining"}
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
                  <Label type="default" icon={SUNNYSIDE.icons.stopwatch}>
                    {`Day ${index + 1}`}
                  </Label>
                  {getKeys(task.reward.items).map((itemName) => (
                    <Label type="warning" icon={giftIcon} key={itemName}>
                      {`${task.reward.items[itemName]} ${itemName}`}
                    </Label>
                  ))}
                  {getKeys(task.reward.wearables).map((wearableName) => (
                    <Label type="warning" icon={giftIcon} key={wearableName}>
                      {`${task.reward.wearables[wearableName]} ${wearableName}`}
                    </Label>
                  ))}
                  {!!task.reward.sfl && (
                    <Label type="warning" icon={sfl} className="">
                      {`${task.reward.sfl} SFL`}
                    </Label>
                  )}
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
                  <div className="flex justify-end">
                    {task.completedAt ? (
                      <div className="flex">
                        <span className="text-xs mr-1">Completed</span>
                        <img src={SUNNYSIDE.icons.confirm} className="h-4" />
                      </div>
                    ) : getTaskStartDate(index + 1).getTime() < Date.now() ? (
                      <Button
                        onClick={() => claimReward(index + 1)}
                        disabled={!hasRequirements(index + 1)}
                        className="text-xs w-24 h-8"
                      >
                        Complete
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
      </>
    </CloseButtonPanel>
  );
};
