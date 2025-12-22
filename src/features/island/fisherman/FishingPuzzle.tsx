import React, { useCallback, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { Button } from "components/ui/Button";

import deepBg from "assets/fish/minigame/deep_sea_bg.png";
import crabRock from "assets/fish/minigame/crab_rock.webp";
import blueCheck from "assets/fish/minigame/blue_up.png";
import { SUNNYSIDE } from "assets/sunnyside";
import { ITEM_DETAILS } from "features/game/types/images";
import { FishName } from "features/game/types/fishing";
import { Label } from "components/ui/Label";
import { FISH_RETRY_COST } from "features/game/events/landExpansion/retryFish";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

const wrong = SUNNYSIDE.icons.cancel;

const FAILURE_REVEAL_MS = 1800;
const MIN_ROWS = 3;
const MAX_ROWS = 8;
const MIN_COLS = 3;
const MAX_COLS = 8;
const MIN_ATTEMPTS = 1;
const MAX_ATTEMPTS = 6;

type Coordinate = {
  row: number;
  col: number;
};

type MistakeTile = Coordinate;

const coordinateKey = (row: number, col: number) => `${row}-${col}`;

const clampValue = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const getSurroundingTiles = (
  row: number,
  col: number,
  rows: number,
  cols: number,
) => {
  const coordinates: string[] = [];

  for (let r = row - 1; r <= row; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r === row && c === col) continue;
      if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
      coordinates.push(coordinateKey(r, c));
    }
  }

  return coordinates;
};

const generateSafePath = (rows: number, cols: number): Coordinate[] => {
  const path: Coordinate[] = [];
  let currentCol = Math.floor(Math.random() * cols);

  for (let row = rows - 1; row >= 0; row--) {
    path.push({ row, col: currentCol });

    if (row === 0) {
      break;
    }

    const nextOptions = [currentCol];
    if (currentCol > 0) nextOptions.push(currentCol - 1);
    if (currentCol < cols - 1) nextOptions.push(currentCol + 1);

    const nextIndex = Math.floor(Math.random() * nextOptions.length);
    currentCol = nextOptions[nextIndex];
  }

  return path;
};

interface FishingMinigameProps {
  rows?: number;
  cols?: number;
  maxAttempts?: number;
  resetKey?: number;
  onCatch: (result: {
    completed: true;
    attemptsLeft: number;
    attemptsUsed: number;
  }) => void;
  onMiss: (result: {
    completed: false;
    attemptsLeft: number;
    attemptsUsed: number;
  }) => void;
  onRetry: () => void;
  fishName: FishName;
}

export const FishingPuzzle: React.FC<FishingMinigameProps> = ({
  rows = 6,
  cols = 5,
  maxAttempts = 4,
  onCatch,
  onMiss,
  onRetry,
  fishName,
  resetKey = 0,
}) => {
  const { t } = useAppTranslation();
  const [dimensions, setDimensions] = useState({
    rows: clampValue(rows, MIN_ROWS, MAX_ROWS),
    cols: clampValue(cols, MIN_COLS, MAX_COLS),
  });
  const [path, setPath] = useState(() =>
    generateSafePath(dimensions.rows, dimensions.cols),
  );
  const initialAttemptLimit = clampValue(
    maxAttempts,
    MIN_ATTEMPTS,
    MAX_ATTEMPTS,
  );
  const [attemptLimit, setAttemptLimit] = useState(initialAttemptLimit);
  const [revealedTiles, setRevealedTiles] = useState<Set<string>>(
    () => new Set(),
  );
  const [temporaryReveals, setTemporaryReveals] = useState<Set<string>>(
    () => new Set(),
  );
  const [progress, setProgress] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(initialAttemptLimit);
  const [mistakeTile, setMistakeTile] = useState<MistakeTile | null>(null);
  const [isResolvingMistake, setIsResolvingMistake] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const failureTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const [showRetry, setShowRetry] = useState(false);
  const completionTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const hasReportedResultRef = useRef(false);

  const rowsArray = useMemo(
    () => Array.from({ length: dimensions.rows }, (_, index) => index),
    [dimensions.rows],
  );
  const colsArray = useMemo(
    () => Array.from({ length: dimensions.cols }, (_, index) => index),
    [dimensions.cols],
  );

  const applyConfig = useCallback(
    (rowsToUse: number, colsToUse: number, attemptsToUse: number) => {
      if (failureTimerRef.current) {
        clearTimeout(failureTimerRef.current);
        failureTimerRef.current = undefined;
      }

      const nextRows = clampValue(rowsToUse, MIN_ROWS, MAX_ROWS);
      const nextCols = clampValue(colsToUse, MIN_COLS, MAX_COLS);
      const nextAttempts = clampValue(
        attemptsToUse,
        MIN_ATTEMPTS,
        MAX_ATTEMPTS,
      );

      setDimensions({ rows: nextRows, cols: nextCols });
      setPath(generateSafePath(nextRows, nextCols));
      setRevealedTiles(new Set());
      setProgress(0);
      setAttemptsLeft(nextAttempts);
      setAttemptLimit(nextAttempts);
      setMistakeTile(null);
      setIsResolvingMistake(false);
      setIsComplete(false);
      setTemporaryReveals(new Set());
      hasReportedResultRef.current = false;
    },
    [],
  );

  React.useEffect(() => {
    applyConfig(rows, cols, maxAttempts);

    // Reset attempts
    setProgress(0);
    setIsComplete(false);
    setMistakeTile(null);
    setIsResolvingMistake(false);
    setRevealedTiles(new Set());
    setTemporaryReveals(new Set());
    setAttemptsLeft(initialAttemptLimit);
    setAttemptLimit(initialAttemptLimit);
    setShowRetry(false);
  }, [applyConfig, cols, maxAttempts, resetKey, rows]);

  const handleCorrectSelection = (row: number, col: number) => {
    const newRevealed = new Set(revealedTiles);
    newRevealed.add(coordinateKey(row, col));
    setRevealedTiles(newRevealed);

    const nextProgress = progress + 1;
    setProgress(nextProgress);
    if (nextProgress === path.length) {
      setIsComplete(true);
    }
  };

  const handleIncorrectSelection = (row: number, col: number) => {
    if (failureTimerRef.current) {
      clearTimeout(failureTimerRef.current);
    }

    setMistakeTile({ row, col });
    setIsResolvingMistake(true);
    setAttemptsLeft((prev) => Math.max(0, prev - 1));
    setTemporaryReveals(
      new Set(getSurroundingTiles(row, col, dimensions.rows, dimensions.cols)),
    );

    failureTimerRef.current = setTimeout(() => {
      setMistakeTile(null);
      setIsResolvingMistake(false);
      setRevealedTiles(new Set());
      setProgress(0);
      setTemporaryReveals(new Set());
    }, FAILURE_REVEAL_MS);
  };

  const handleTileClick = (row: number, col: number) => {
    if (isComplete || attemptsLeft === 0 || isResolvingMistake) return;
    const key = coordinateKey(row, col);
    if (revealedTiles.has(key)) return;

    const expectedStep = path[progress];
    if (!expectedStep) return;
    if (row !== expectedStep.row) return;

    if (expectedStep.row === row && expectedStep.col === col) {
      handleCorrectSelection(row, col);
    } else {
      handleIncorrectSelection(row, col);
    }
  };

  React.useEffect(() => {
    return () => {
      if (failureTimerRef.current) {
        clearTimeout(failureTimerRef.current);
      }
    };
  }, []);

  const nextStep = path[progress];

  const reportFinish = useCallback(
    (completed: boolean) => {
      if (hasReportedResultRef.current) return;
      hasReportedResultRef.current = true;

      const result = {
        completed,
        attemptsLeft,
        attemptsUsed: attemptLimit - attemptsLeft,
      };

      if (completed) {
        onCatch?.({ ...result, completed: true });
      } else {
        setShowRetry(true);
      }
    },
    [attemptLimit, attemptsLeft, onCatch, onMiss],
  );

  React.useEffect(() => {
    if (completionTimerRef.current) {
      clearTimeout(completionTimerRef.current);
      completionTimerRef.current = undefined;
    }

    if (isComplete) {
      completionTimerRef.current = setTimeout(() => {
        reportFinish(true);
        completionTimerRef.current = undefined;
      }, 2000);
    } else if (attemptsLeft === 0) {
      completionTimerRef.current = setTimeout(() => {
        reportFinish(false);
        completionTimerRef.current = undefined;
      }, 2000);
    }

    return () => {
      if (completionTimerRef.current) {
        clearTimeout(completionTimerRef.current);
        completionTimerRef.current = undefined;
      }
    };
  }, [isComplete, attemptsLeft, reportFinish]);

  if (showRetry) {
    return (
      <div className="space-y-3 text-sm text-brown-500 flex flex-col items-center">
        <Label type="danger">{t("fishingPuzzle.missedFish")}</Label>
        <p>{t("fishingPuzzle.retryPrompt", { coins: FISH_RETRY_COST })}</p>

        <div className="flex">
          <Button
            onClick={() =>
              onMiss({
                completed: false,
                attemptsLeft,
                attemptsUsed: attemptLimit - attemptsLeft,
              })
            }
            className="mr-1"
          >
            {t("no")}
          </Button>
          <Button onClick={onRetry}>{t("retry")}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 text-sm text-brown-500 flex flex-col items-center">
      <Label type={attemptsLeft <= 1 ? "danger" : "default"}>
        {t("fishingPuzzle.attemptsLeft", {
          attemptsLeft,
          attemptLimit,
        })}
      </Label>

      <div className="flex  items-center">
        <img src={blueCheck} className="w-10" />
        <p className="text-xs opacity-80">{t("fishingPuzzle.findSafePath")}</p>
      </div>

      {isComplete && (
        <div className="rounded bg-green-100 border border-green-400 px-2 py-1 text-xs text-green-700">
          {t("fishingPuzzle.success")}
        </div>
      )}
      {attemptsLeft === 0 && !isComplete && (
        <div className="rounded bg-red-100 border border-red-400 px-2 py-1 text-xs text-red-700">
          {t("fishingPuzzle.failedAttempts")}
        </div>
      )}

      <div
        className="grid gap-2 justify-items-center "
        style={{
          width: "max-content",
          backgroundImage: `url(${deepBg})`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px",
          gridTemplateColumns: `repeat(${dimensions.cols}, minmax(0, 1fr))`,
        }}
      >
        {rowsArray.map((row) =>
          colsArray.map((col) => {
            const key = coordinateKey(row, col);
            const isTemporarilyRevealed = temporaryReveals.has(key);
            const isRevealed = revealedTiles.has(key);
            const isMistake =
              mistakeTile?.row === row && mistakeTile?.col === col;
            const pathIndex = path.findIndex(
              (step) => step.row === row && step.col === col,
            );
            const isPathTile = pathIndex >= 0;
            const isSelectable = !!nextStep && row === nextStep.row;
            const isDisabled =
              isComplete ||
              attemptsLeft === 0 ||
              isResolvingMistake ||
              !isSelectable;
            const showGreen =
              (isRevealed || (isTemporarilyRevealed && isPathTile)) &&
              !isMistake;
            const showRed = isMistake || (isTemporarilyRevealed && !isPathTile);
            const isFlipped = showGreen || showRed;
            const isActiveRow = !!nextStep && row === nextStep.row;

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleTileClick(row, col)}
                disabled={isDisabled}
                style={{ perspective: "800px" }}
                className={classNames(
                  "h-20 w-20 sm:h-24 sm:w-24 rounded transition-colors duration-200",
                  {
                    " cursor-not-allowed": isDisabled,
                    "ring-2 ring-white/70": isActiveRow,
                  },
                )}
              >
                <div
                  className={classNames(
                    "relative h-full w-full transition-transform duration-[700ms] ease-in-out [transform-style:preserve-3d]",
                    { "[transform:rotateY(180deg)]": isFlipped },
                  )}
                >
                  <div
                    className="absolute inset-0 rounded [backface-visibility:hidden]"
                    style={{
                      backgroundColor: "transparent",
                      border: isActiveRow
                        ? "2px solid rgba(255,255,255,0.75)"
                        : "2px solid rgba(255,255,255,0.35)",
                      boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
                    }}
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center rounded [transform:rotateY(180deg)] [backface-visibility:hidden]"
                    style={{
                      backgroundColor: "transparent",
                      backgroundImage: showGreen
                        ? `url(${blueCheck})`
                        : showRed
                          ? `url(${crabRock})`
                          : undefined,
                      backgroundSize: "70%",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      opacity: 1,
                    }}
                  >
                    {showRed && (
                      <div
                        className="absolute top-1 right-1 w-1/3 h-1/3 bg-contain bg-no-repeat bg-center pointer-events-none"
                        style={{ backgroundImage: `url(${wrong})` }}
                      />
                    )}
                  </div>
                </div>
              </button>
            );
          }),
        )}
      </div>

      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-2">
          {fishName && (
            <div className="w-10 relative">
              <img
                src={ITEM_DETAILS[fishName as FishName].image}
                className="w-full"
                // silhoutte black mystery effect
                style={{
                  filter: "brightness(0%)",
                }}
              />
              <img
                src={SUNNYSIDE.icons.expression_confused}
                className="w-3 absolute bottom-7 right-4"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
