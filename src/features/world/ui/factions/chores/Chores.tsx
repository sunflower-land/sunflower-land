import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "@xstate/react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";

import { SplitScreenView } from "components/ui/SplitScreenView";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MachineState } from "features/game/lib/gameMachine";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { SquareIcon } from "components/ui/SquareIcon";
import {
  InventoryItemName,
  KingdomChore,
  KingdomChores,
} from "features/game/types/game";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { InlineDialogue } from "../../TypingMessage";
import { NPCName } from "lib/npcs";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import classNames from "classnames";

interface Props {
  kingdomChores: KingdomChores;
  npc: NPCName;
  onClose: () => void;
}

const WEEKLY_CHORES = 21;
const _autosaving = (state: MachineState) => state.matches("autosaving");
const _bumpkin = (state: MachineState) => state.context.state.bumpkin;

export const Chores: React.FC<Props> = ({ kingdomChores, npc }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const autosaving = useSelector(gameService, _autosaving);
  const bumpkin = useSelector(gameService, _bumpkin);

  const [selected, setSelected] = useState<number>(0);

  useLayoutEffect(() => {
    const chore = kingdomChores.chores[selected];
    if (!chore.completedAt && !chore.skippedAt) {
      return;
    }

    let nextChore = chores
      .slice(selected + 1)
      .find(
        ([, chore]) => chore.startedAt && !chore.completedAt && !chore.skippedAt
      );

    if (nextChore) {
      setSelected(Number(nextChore[0]));
      return;
    }

    nextChore = chores
      .slice(0, selected)
      .reverse()
      .find(
        ([, chore]) => chore.startedAt && !chore.completedAt && !chore.skippedAt
      );

    if (nextChore) {
      setSelected(Number(nextChore[0]));
      return;
    }
  }, [kingdomChores]);

  const getProgress = (index: number) => {
    return (
      (bumpkin?.activity?.[kingdomChores.chores[index].activity] ?? 0) -
      (kingdomChores.chores[index].startCount ?? 0)
    );
  };

  const handleComplete = (index: number) => {
    gameService.send("kingdomChore.completed", { id: index });
    gameService.send("SAVE");
  };

  const handleReset = () => {
    gameService.send("kingdomChores.refreshed");
    gameService.send("SAVE");
  };

  const handleSkip = (index: number) => {
    gameService.send("kingdomChore.skipped", { id: index });
    gameService.send("SAVE");
  };

  const chores = Object.entries(kingdomChores.chores);

  const activeChores = chores.filter(
    ([, chore]) => chore.startedAt && !chore.completedAt && !chore.skippedAt
  );
  const completedChores = chores.filter(
    ([, chore]) => chore.completedAt || chore.skippedAt
  );
  const upcomingChores = chores.filter(([, chore]) => !chore.startedAt);

  const completedCount = completedChores.length;

  const selectedChore = kingdomChores.chores[selected];
  const canComplete = getProgress(selected) >= selectedChore.requirement;

  const needsRefresh =
    kingdomChores.resetsAt && kingdomChores.resetsAt < Date.now();
  const isRefreshing = !!(needsRefresh && autosaving);

  if (activeChores.length === 0) {
    return (
      <InnerPanel>
        <KingdomChoresTimer
          resetsAt={kingdomChores.resetsAt}
          onReset={handleReset}
        />
        <div className="p-2 min-h-[65px]">
          <InlineDialogue
            key={`refreshing-${isRefreshing}`}
            message={
              isRefreshing
                ? "Just a second. I'm preparing some chores."
                : completedCount > 0
                ? "Looks like you have completed all your chores for now. Come back soon!"
                : "I'm sorry, I don't have any chores available right now. Come back soon!"
            }
          />
        </div>
      </InnerPanel>
    );
  }

  return (
    <>
      <KingdomChoresTimer
        resetsAt={kingdomChores.resetsAt}
        onReset={handleReset}
      />
      <div className="p-1">
        <SplitScreenView
          panel={
            <Panel
              canComplete={canComplete}
              chore={selectedChore}
              onComplete={() => handleComplete(selected)}
              onSkip={() => handleSkip(selected)}
              isRefreshing={isRefreshing}
            />
          }
          content={
            <>
              <div className="flex flex-col mb-2 w-full">
                {
                  <div className="flex flex-row justify-between pl-1">
                    <Label type="default" className="text-center">
                      {`Chores`}
                    </Label>
                    <p className="text-xxs">
                      {completedCount} {t("completed")}
                    </p>
                  </div>
                }
                <div className="flex mb-2 flex-wrap pl-0.5">
                  {activeChores.map(([choreId, chore]) => (
                    <Box
                      key={choreId}
                      onClick={() => setSelected(Number(choreId))}
                      isSelected={selected === Number(choreId)}
                      image={ITEM_DETAILS[chore.image].image}
                    />
                  ))}
                  {activeChores.length === 0 && (
                    <span className="p-2">No upcoming chores</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col mb-2 w-full">
                {
                  <div className="flex flex-row justify-between pl-1">
                    <Label type="default" className="text-center">
                      {`Upcoming`}
                    </Label>
                    <p className="text-xxs">
                      {t("chores.upcoming", {
                        chores: WEEKLY_CHORES - completedCount,
                      })}
                    </p>
                  </div>
                }
                <div className="flex flex-wrap pl-0.5">
                  {upcomingChores.slice(0, 3).map(([choreId, chore]) => (
                    <Box
                      key={choreId}
                      onClick={() => setSelected(Number(choreId))}
                      isSelected={selected === Number(choreId)}
                      image={ITEM_DETAILS[chore.image].image}
                    />
                  ))}
                  {upcomingChores.length === 0 && (
                    <span className="p-2">No upcoming chores</span>
                  )}
                </div>
              </div>
            </>
          }
        />
      </div>
    </>
  );
};

type PanelProps = {
  canComplete: boolean;
  onComplete: () => void;
  onSkip: () => void;
  chore: KingdomChore;
  isRefreshing: boolean;
};

const Panel: React.FC<PanelProps> = ({
  canComplete,
  onComplete,
  onSkip,
  chore,
  isRefreshing,
}: PanelProps) => {
  return (
    <div className="flex flex-col justify-center">
      <div className="px-1 py-1">
        <div className="flex space-x-2 justify-start items-center sm:flex-col-reverse md:space-x-0">
          {ITEM_DETAILS[chore.image].image && (
            <div className="sm:mt-2">
              <SquareIcon icon={ITEM_DETAILS[chore.image].image} width={14} />
            </div>
          )}
          <span className="sm:text-center">{chore.description}</span>
        </div>
        <div className="flex flex-col space-y-1 mt-2">
          <div className="flex justify-start sm:justify-center">
            <Label type="warning" className="text-center">
              {chore.marks} {`Marks`}
            </Label>
          </div>
        </div>
      </div>

      <div className="flex space-x-1 sm:space-x-0 sm:space-y-1 sm:flex-col w-full pt-1">
        {chore.startedAt && (
          <>
            <Button
              disabled={!canComplete || isRefreshing}
              onClick={onComplete}
            >
              {`Complete`}
            </Button>
            <Button disabled={!canComplete || isRefreshing} onClick={onSkip}>
              {`Skip`}
            </Button>
          </>
        )}
        {!chore.startedAt && (
          <span className="px-1 pb-1 text-xxs">
            Complete active chores to unlock
          </span>
        )}
      </div>
    </div>
  );
};

const KingdomChoresTimer: React.FC<{
  onReset: () => void;
  resetsAt?: number;
}> = ({ onReset, resetsAt }) => {
  useUiRefresher();

  const shouldReset = resetsAt && resetsAt < Date.now();
  // TODO feat/kingdom-chores-logic - REMOVE true
  const shouldWarn = (resetsAt && resetsAt - Date.now() < 10000) || true;

  useEffect(() => {
    if (shouldReset) onReset();
  }, [shouldReset]);

  if (shouldReset) {
    return (
      <div className="absolute -top-7 right-0 bulge-subtle">
        <Label type="info" icon={SUNNYSIDE.icons.timer}>
          <span className="loading">Loading new chores</span>
        </Label>
      </div>
    );
  }

  return resetsAt ? (
    <div className="absolute -top-7 right-0">
      <Label
        type={shouldWarn ? "danger" : "info"}
        className={classNames("whitespace-nowrap", {
          "bulge-subtle": shouldWarn,
        })}
        icon={SUNNYSIDE.icons.stopwatch}
      >
        {"New Chores: "}
        {secondsToString(Math.round((resetsAt - Date.now()) / 1000), {
          length: "medium",
          removeTrailingZeros: true,
        })}
      </Label>
    </div>
  ) : (
    <></>
  );
};
