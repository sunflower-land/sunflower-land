import React, { useContext, useEffect, useState } from "react";
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
import { KingdomChore, KingdomChores } from "features/game/types/game";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import { secondsToString } from "lib/utils/time";
import { InlineDialogue } from "../../TypingMessage";
import classNames from "classnames";
import { ModalOverlay } from "components/ui/ModalOverlay";
import { ResizableBar } from "components/ui/ProgressBar";

import mark from "assets/icons/faction_mark.webp";
import levelup from "assets/icons/level_up.png";
import chefsHat from "assets/icons/chef_hat.png";
import lightning from "assets/icons/lightning.png";

import { FarmActivityName } from "features/game/types/farmActivity";
import { getKingdomChoreBoost } from "features/game/events/landExpansion/completeKingdomChore";
import { formatNumber } from "lib/utils/formatNumber";
import { BoostInfoPanel } from "../BoostInfoPanel";
import { useCountdown } from "lib/utils/hooks/useCountdown";

const getSecondaryImage = (activity: FarmActivityName) => {
  if (activity.endsWith("Cooked")) return chefsHat;
  if (activity.endsWith("Fed")) return levelup;

  return undefined;
};

const getChoreImage = (kingdomChore: KingdomChore) => {
  if (kingdomChore.activity.endsWith("Casted")) return SUNNYSIDE.icons.fish;

  return ITEM_DETAILS[kingdomChore.image].image;
};

interface Props {
  kingdomChores: KingdomChores;
  onClose: () => void;
}

const WEEKLY_CHORES = 21;
const _autosaving = (state: MachineState) => state.matches("autosaving");
const _farmActivity = (state: MachineState) => state.context.state.farmActivity;

export const KingdomChoresContent: React.FC<Props> = ({ kingdomChores }) => {
  const { t } = useAppTranslation();
  const { gameService } = useContext(Context);

  const autosaving = useSelector(gameService, _autosaving);
  const farmActivity = useSelector(gameService, _farmActivity);
  const chores = Object.entries(kingdomChores.chores);
  const activeChores = chores.filter(
    ([, chore]) => chore.startedAt && !chore.completedAt && !chore.skippedAt,
  );
  const completedChores = chores.filter(
    ([, chore]) => chore.completedAt || chore.skippedAt,
  );
  const upcomingChores = chores.filter(([, chore]) => !chore.startedAt);

  const [selected, setSelected] = useState<number>(
    Number(activeChores[0]?.[0] ?? 0),
  );
  const [showSkipConfirmation, setShowSkipConfirmation] =
    useState<boolean>(false);

  const getProgress = (index: number) => {
    const chore = kingdomChores.chores[index];
    if (!chore?.startedAt) {
      return 0;
    }

    return (farmActivity?.[chore.activity] ?? 0) - (chore.startCount ?? 0);
  };

  const handleComplete = (index: number) => {
    gameService.send({ type: "kingdomChore.completed", id: index });
    gameService.send({ type: "SAVE" });
  };

  const handleReset = () => {
    gameService.send({ type: "kingdomChores.refreshed" });
    gameService.send({ type: "SAVE" });
  };

  const handleSkip = () => {
    setShowSkipConfirmation(true);
  };

  const confirmSkip = (index: number) => {
    setShowSkipConfirmation(false);
    gameService.send({ type: "kingdomChore.skipped", id: index });
    gameService.send({ type: "SAVE" });
  };

  const activeChoresCount = activeChores.length;
  const completedCount = completedChores.length;

  const selectedChore = kingdomChores.chores[selected];
  const progress = getProgress(selected);

  const { totalSeconds: secondsRemaining } = useCountdown(
    kingdomChores.resetsAt ?? 0,
  );
  const needsRefresh = kingdomChores.resetsAt && secondsRemaining <= 0;
  const isRefreshing = !!(needsRefresh && autosaving);

  if (activeChoresCount === 0) {
    return (
      <InnerPanel>
        <div className="absolute -top-7 right-0">
          <KingdomChoresTimer
            resetsAt={kingdomChores.resetsAt}
            onReset={handleReset}
          />
        </div>
        <div className="p-2 min-h-[65px]">
          <InlineDialogue
            key={`refreshing-${isRefreshing}`}
            message={
              isRefreshing
                ? t("kingdomChores.preparing")
                : completedCount > 0
                  ? t("kingdomChores.completed")
                  : t("kingdomChores.noChores")
            }
          />
        </div>
      </InnerPanel>
    );
  }

  return (
    <>
      <div className="absolute -top-7 right-0">
        <KingdomChoresTimer
          resetsAt={kingdomChores.resetsAt}
          onReset={handleReset}
        />
      </div>
      <div className="p-1">
        <SplitScreenView
          mobileReversePanelOrder={true}
          tallMobileContent={true}
          panel={
            <ChoresPanel
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
                      {t("chores")}
                    </Label>
                    <p className="text-xxs">
                      {completedCount} {t("completed")}
                    </p>
                  </div>
                }
                <div className="flex mb-2 flex-wrap pl-0.5">
                  {activeChores.map(([choreId, chore]) => {
                    const progress = getProgress(Number(choreId));
                    const canComplete = progress >= chore.requirement;

                    return (
                      <Box
                        key={choreId}
                        onClick={() => setSelected(Number(choreId))}
                        isSelected={selected === Number(choreId)}
                        image={getChoreImage(chore)}
                        secondaryImage={getSecondaryImage(chore.activity)}
                        progress={{
                          label: `${Math.min(progress, chore.requirement)}/${
                            chore.requirement
                          }`,
                          percentage: (progress / chore.requirement) * 100,
                          type: canComplete ? "progress" : "quantity",
                        }}
                      />
                    );
                  })}
                  {activeChoresCount === 0 && (
                    <span className="p-2 text-xxs">
                      {t("kingdomChores.noUpcoming")}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col mb-2 w-full">
                {
                  <div className="flex flex-row items-center justify-between px-1">
                    <Label type="default" className="text-center">
                      {t("upcoming")}
                    </Label>
                    <p className="text-xxs">
                      {`${
                        WEEKLY_CHORES - completedCount - activeChoresCount
                      } ${t("upcoming")}`}
                    </p>
                  </div>
                }
                <div className="flex flex-wrap pl-0.5">
                  {upcomingChores.slice(0, 3).map(([choreId, chore]) => {
                    const progress = getProgress(Number(choreId));
                    const canComplete = progress >= chore.requirement;

                    return (
                      <Box
                        key={choreId}
                        onClick={() => setSelected(Number(choreId))}
                        isSelected={selected === Number(choreId)}
                        image={getChoreImage(chore)}
                        secondaryImage={getSecondaryImage(chore.activity)}
                        progress={{
                          label: `${Math.min(progress, chore.requirement)}/${
                            chore.requirement
                          }`,
                          percentage: (progress / chore.requirement) * 100,
                          type: canComplete ? "progress" : "quantity",
                        }}
                      />
                    );
                  })}
                  {upcomingChores.length === 0 && (
                    <span className="p-2 text-xxs">
                      {t("kingdomChores.noUpcoming")}
                    </span>
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

const ChoresPanel: React.FC<PanelProps> = ({
  progress,
  skipAvailableAt,
  onComplete,
  onSkip,
  chore,
  isRefreshing,
}: PanelProps) => {
  const { gameService } = useContext(Context);
  const [showBoostInfo, setShowBoostInfo] = useState(false);

  const { t } = useAppTranslation();
  const { totalSeconds: secondsRemaining } = useCountdown(skipAvailableAt);

  const canSkip = secondsRemaining <= 0;
  const canComplete = progress >= chore.requirement;

  const boost = getKingdomChoreBoost(
    gameService.getSnapshot().context.state,
    chore.marks,
  )[0];
  const boostedMarks = chore.marks + boost;

  return (
    <div className="flex flex-col justify-center">
      <div className="flex space-y-1 space-x-2 justify-start items-center sm:flex-col-reverse md:space-x-0 p-1">
        <div className="sm:mt-2">
          <SquareIcon icon={getChoreImage(chore)} width={14} />
        </div>
        <span className="sm:text-center">{chore.description}</span>
        <div className="flex-1 flex justify-end pb-1 sm:justify-center relative">
          <BoostInfoPanel
            show={showBoostInfo}
            onClick={() => setShowBoostInfo(false)}
            feature="kingdom_chores"
            baseAmount={chore.marks}
          />
          <Label
            type="warning"
            icon={mark}
            secondaryIcon={boost ? lightning : null}
            className="text-center whitespace-nowrap"
            onClick={() => setShowBoostInfo(!showBoostInfo)}
          >
            <span className={boost ? "pl-1.5" : ""}>
              {`${formatNumber(boostedMarks)} ${t("marks")}`}
            </span>
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-1 gap-1 pt-1">
        <div className="row-start-1 flex justify-start sm:justify-center sm:pb-3">
          <div className="flex flex-col sm:items-center px-1 space-y-0.5">
            <ResizableBar
              percentage={(progress / chore.requirement) * 100}
              type={canComplete ? "progress" : "quantity"}
              outerDimensions={{ width: 50, height: 7 }}
            />
            <span className="text-xxs">
              {t("kingdomChores.progress", {
                progress: `${Math.min(progress, chore.requirement)}/${chore.requirement}`,
              })}
            </span>
          </div>
        </div>
        {chore.startedAt && (
          <>
            <div className="col-span-full flex flex-row-reverse sm:flex-col gap-1">
              {chore.completedAt && (
                <div className="ml-4 py-2">
                  <Label type="transparent" icon={SUNNYSIDE.icons.confirm}>
                    <span className="ml-1 text-sm" style={{ color: "#3e2731" }}>
                      {t("completed")}
                    </span>
                  </Label>
                </div>
              )}
              {chore.skippedAt && (
                <div className="ml-4 py-2">
                  <Label type="transparent" icon={SUNNYSIDE.icons.cancel}>
                    <span className="ml-1 text-sm" style={{ color: "#3e2731" }}>
                      {t("skipped")}
                    </span>
                  </Label>
                </div>
              )}
              {!chore.completedAt && !chore.skippedAt && (
                <>
                  <Button
                    disabled={!canComplete || isRefreshing}
                    onClick={onComplete}
                  >
                    {t("complete")}
                  </Button>
                  {canSkip && (
                    <Button onClick={onSkip} disabled={!canSkip}>
                      {t("skip")}
                    </Button>
                  )}
                </>
              )}
            </div>
            {!canSkip && (
              <div className="row-start-1 sm:row-start-3 flex justify-end sm:justify-center">
                <div className="px-1">
                  <Label
                    type="info"
                    icon={SUNNYSIDE.icons.stopwatch}
                    className="whitespace-nowrap"
                  >
                    {t("kingdomChores.nextSkip", {
                      skip: secondsToString(secondsRemaining, {
                        length: "short",
                        removeTrailingZeros: true,
                      }),
                    })}
                  </Label>
                </div>
              </div>
            )}
          </>
        )}
        {!chore.startedAt && (
          <span className="px-2 pb-1 text-xxs">
            {t("kingdomChores.completeActive")}
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
  const { gameService } = useContext(Context);

  const { t } = useAppTranslation();

  const boost = getKingdomChoreBoost(
    gameService.getSnapshot().context.state,
    chore.marks,
  )[0];

  const boostedMarks = chore.marks + boost;

  return (
    <InnerPanel>
      <div className="flex flex-col justify-center items-center">
        <Label type="danger" className="!w-full">
          {t("kingdomChores.skipWarning")}
        </Label>
        <div className="flex space-x-2 justify-start items-center sm:flex-col-reverse md:space-x-0 p-1">
          <div className="sm:mt-2">
            <SquareIcon icon={getChoreImage(chore)} width={14} />
          </div>
          <span>
            {t("skip")} {chore.description}
          </span>
        </div>
        <div className="pb-2">
          <Label type="warning" icon={mark} className="text-center">
            {formatNumber(boostedMarks)} {t("marks")}
          </Label>
        </div>
        <div className="flex w-full space-x-1">
          <Button onClick={onBack}>{t("back")}</Button>
          <Button onClick={onConfirm}>{t("skip")}</Button>
        </div>
      </div>
    </InnerPanel>
  );
};

export const KingdomChoresTimer: React.FC<{
  onReset: () => void;
  resetsAt?: number;
}> = ({ onReset, resetsAt }) => {
  const { t } = useAppTranslation();

  const { totalSeconds: secondsRemaining } = useCountdown(resetsAt ?? 0);

  const shouldReset = secondsRemaining <= 0;
  const shouldWarn = secondsRemaining <= 100_000;

  useEffect(() => {
    if (shouldReset) onReset();
  }, [shouldReset, onReset]);

  if (shouldReset) {
    return (
      <div className="bulge-subtle">
        <Label type="info" icon={SUNNYSIDE.icons.timer}>
          <span className="loading">{t("kingdomChores.loading")}</span>
        </Label>
      </div>
    );
  }

  return resetsAt ? (
    <div>
      <Label
        type={shouldWarn ? "danger" : "info"}
        className={classNames({ "bulge-subtle": shouldWarn })}
        icon={SUNNYSIDE.icons.stopwatch}
      >
        {t("kingdomChores.reset", {
          timeLeft: secondsToString(secondsRemaining, {
            length: "medium",
            removeTrailingZeros: true,
          }),
        })}
      </Label>
    </div>
  ) : (
    <></>
  );
};
