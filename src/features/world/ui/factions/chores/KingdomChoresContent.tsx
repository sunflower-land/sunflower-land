import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "@xstate/react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { ITEM_DETAILS } from "features/game/types/images";

import { SplitScreenView } from "components/ui/SplitScreenView";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { MachineState } from "features/game/lib/gameMachine";
import { InnerPanel } from "components/ui/Panel";
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
import { ModalOverlay } from "components/ui/ModalOverlay";
import { ProgressBar, ResizableBar } from "components/ui/ProgressBar";

import mark from "assets/icons/faction_mark.webp";

interface Props {
  kingdomChores: KingdomChores;
  onClose: () => void;
}

const WEEKLY_CHORES = 21;
const _autosaving = (state: MachineState) => state.matches("autosaving");
const _bumpkin = (state: MachineState) => state.context.state.bumpkin;

export const KingdomChoresContent: React.FC<Props> = ({ kingdomChores }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const autosaving = useSelector(gameService, _autosaving);
  const bumpkin = useSelector(gameService, _bumpkin);

  const [selected, setSelected] = useState<number>(0);
  const [showSkipConfirmation, setShowSkipConfirmation] =
    useState<boolean>(false);

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

  const handleSkip = () => {
    setShowSkipConfirmation(true);
  };

  const confirmSkip = (index: number) => {
    setShowSkipConfirmation(false);
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
  const progress = getProgress(selected);

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
          mobileReversePanelOrder={true}
          panel={
            <Panel
              progress={progress}
              chore={selectedChore}
              onComplete={() => handleComplete(selected)}
              onSkip={() => handleSkip()}
              isRefreshing={isRefreshing}
              skipAvailableAt={kingdomChores.skipAvailableAt ?? 0}
            />
          }
          content={
            <>
              <div className="flex flex-col mb-2 w-full">
                {
                  <div className="flex flex-row items-center justify-between px-1">
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
                  <div className="flex flex-row items-center justify-between px-1">
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
        <ModalOverlay
          className="inset-3 top-4"
          show={showSkipConfirmation}
          onBackdropClick={() => setShowSkipConfirmation(false)}
        >
          <ConfirmSkip
            chore={selectedChore}
            onConfirm={() => confirmSkip(selected)}
            onBack={() => setShowSkipConfirmation(false)}
          />
        </ModalOverlay>
      </div>
    </>
  );
};

type PanelProps = {
  progress: number;
  onComplete: () => void;
  onSkip: () => void;
  chore: KingdomChore;
  isRefreshing: boolean;
  skipAvailableAt: number;
};

const Panel: React.FC<PanelProps> = ({
  progress,
  skipAvailableAt,
  onComplete,
  onSkip,
  chore,
  isRefreshing,
}: PanelProps) => {
  useUiRefresher();

  const canSkip = skipAvailableAt < Date.now();
  const canComplete = progress >= chore.requirement;

  return (
    <div className="flex flex-col justify-center">
      <div className="flex space-x-2 justify-start items-center sm:flex-col-reverse md:space-x-0 p-1">
        {ITEM_DETAILS[chore.image].image && (
          <div className="sm:mt-2">
            <SquareIcon icon={ITEM_DETAILS[chore.image].image} width={14} />
          </div>
        )}
        <span className="sm:text-center">{chore.description}</span>
      </div>

      <div className="flex flex-col sm:items-center pb-2">
        <ResizableBar
          percentage={(progress / chore.requirement) * 100}
          type={canComplete ? "progress" : "quantity"}
          outerDimensions={{
            width: 50,
            height: 7,
          }}
        />
        <span className="text-xxs">
          Progress: {Math.min(progress, chore.requirement)}/{chore.requirement}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-1 gap-1 pt-1">
        <div className="row-start-1 flex justify-start sm:justify-center sm:pb-3">
          <Label type="warning" icon={mark} className="text-center">
            {chore.marks} {`Marks`}
          </Label>
        </div>
        {chore.startedAt && (
          <>
            <div className="col-span-full flex sm:flex-col gap-1">
              <Button
                disabled={!canComplete || isRefreshing}
                onClick={onComplete}
              >
                {`Complete`}
              </Button>
              {canSkip && (
                <Button onClick={onSkip} disabled={!canSkip}>
                  {`Skip`}
                </Button>
              )}
            </div>
            {!canSkip && (
              <div className="row-start-1 sm:row-start-3 flex justify-end sm:justify-center">
                <Label
                  type="info"
                  icon={SUNNYSIDE.icons.stopwatch}
                  className="whitespace-nowrap"
                >
                  {"Next skip: "}
                  {secondsToString(
                    Math.round((skipAvailableAt - Date.now()) / 1000),
                    {
                      length: "short",
                      removeTrailingZeros: true,
                    }
                  )}
                </Label>
              </div>
            )}
          </>
        )}
        {!chore.startedAt && (
          <span className="px-2 pb-1 text-xxs">
            Complete active chores to unlock
          </span>
        )}
      </div>
    </div>
  );
};

const ConfirmSkip: React.FC<{
  onConfirm: () => void;
  onBack: () => void;
  chore: KingdomChore;
}> = ({ onConfirm, onBack, chore }) => {
  return (
    <InnerPanel>
      <div className="flex flex-col justify-center">
        <Label type="danger" className="!w-full">
          You can only skip one chore every 24 hours
        </Label>
        <div className="flex space-x-2 justify-start items-center sm:flex-col-reverse md:space-x-0 p-1">
          {ITEM_DETAILS[chore.image].image && (
            <div className="sm:mt-2">
              <SquareIcon icon={ITEM_DETAILS[chore.image].image} width={14} />
            </div>
          )}
          <span className="sm:text-center">Skip {chore.description}</span>
        </div>
        <div className="flex justify-start sm:justify-center pb-2">
          <Label type="warning" className="text-center">
            {chore.marks} {`Marks`}
          </Label>
        </div>
        <div className="flex space-x-1">
          <Button onClick={onBack}>{`Back`}</Button>
          <Button onClick={onConfirm}>{`Skip`}</Button>
        </div>
      </div>
    </InnerPanel>
  );
};

const KingdomChoresTimer: React.FC<{
  onReset: () => void;
  resetsAt?: number;
}> = ({ onReset, resetsAt }) => {
  useUiRefresher();

  const shouldReset = resetsAt && resetsAt < Date.now();
  const shouldWarn = resetsAt && resetsAt - Date.now() < 100_000;

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
