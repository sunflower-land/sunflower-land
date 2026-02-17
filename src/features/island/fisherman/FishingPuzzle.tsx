import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import { Button } from "components/ui/Button";

import deepBg from "assets/fish/minigame/deep_sea_bg.png";
import crabRock from "assets/fish/minigame/crab_rock.webp";
import blueCheck from "assets/fish/minigame/blue_up.png";
import mapIcon from "assets/icons/map.webp";
import lightning from "assets/icons/lightning.png";
import { SUNNYSIDE } from "assets/sunnyside";
import {
  FishName,
  MAP_PUZZLE_DIFFICULTY,
  MarineMarvelName,
} from "features/game/types/fishing";
import { Label } from "components/ui/Label";
import { FISH_RETRY_COST } from "features/game/events/landExpansion/retryFish";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { getKeys } from "features/game/lib/crafting";
import { useGame } from "features/game/GameProvider";
import { isCollectibleBuilt } from "features/game/lib/collectibleBuilt";
import { BoostsDisplay } from "components/ui/layouts/BoostsDisplay";
import { BoostName, GameState } from "features/game/types/game";

const wrong = SUNNYSIDE.icons.cancel;
const PUZZLE_STARTED_KEY = "fishing-puzzle-started";

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

const DIFFICULTY: Record<number, { attempts: number; rows: number }> = {
  1: { attempts: 4, rows: 5 },
  2: { attempts: 4, rows: 6 },
  3: { attempts: 4, rows: 7 },
  4: { attempts: 4, rows: 8 },
  5: { attempts: 5, rows: 9 },
};

export const FishermanPuzzle: React.FC<{
  maps: Partial<Record<MarineMarvelName, number>>;
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
}> = ({ maps, onCatch, onMiss, onRetry }) => {
  const { gameState } = useGame();
  const [showRetry, setShowRetry] = useState(false);
  const [showTimeoutMiss, setShowTimeoutMiss] = useState(false);
  const { t } = useAppTranslation();

  const mapPieces = getKeys(maps);
  const difficulty = MAP_PUZZLE_DIFFICULTY[mapPieces[0]] ?? 3;
  const coins = gameState.context.state.coins;
  const anemoneFlowerBuilt = isCollectibleBuilt({
    name: "Anemone Flower",
    game: gameState.context.state,
  });

  const { attempts, rows } = DIFFICULTY[difficulty] ?? { attempts: 3, rows: 5 };
  const attemptsWithBonus = anemoneFlowerBuilt ? attempts + 1 : attempts;
  const [attemptLimit, setAttemptLimit] = useState(attemptsWithBonus);
  const wharfCastedAt = gameState.context.state.fishing.wharf.castedAt;
  const hasAutoMissedRef = useRef(false);

  const retry = () => {
    onRetry();
    setAttemptLimit((prev) => prev + 3);
    setShowRetry(false);
  };

  // If the player refreshed after starting the puzzle, treat it as a miss
  useEffect(() => {
    if (!wharfCastedAt) return;
    if (hasAutoMissedRef.current) return;

    const startedAt = localStorage.getItem(PUZZLE_STARTED_KEY);
    if (startedAt && Number(startedAt) === wharfCastedAt) {
      hasAutoMissedRef.current = true;
      const raf = requestAnimationFrame(() => setShowTimeoutMiss(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [wharfCastedAt]);

  const handlePuzzleStarted = () => {
    if (!wharfCastedAt) return;
    localStorage.setItem(PUZZLE_STARTED_KEY, String(wharfCastedAt));
  };

  const handleCatch = (result: {
    completed: true;
    attemptsLeft: number;
    attemptsUsed: number;
  }) => {
    localStorage.removeItem(PUZZLE_STARTED_KEY);
    onCatch(result);
  };

  const handleMiss = (result: {
    completed: false;
    attemptsLeft: number;
    attemptsUsed: number;
  }) => {
    localStorage.removeItem(PUZZLE_STARTED_KEY);
    onMiss(result);
  };

  return (
    <>
      <FishingPuzzle
        rows={rows}
        cols={4}
        maxAttempts={attemptLimit}
        onCatch={handleCatch}
        onMiss={() => setShowRetry(true)}
        difficultCatch={mapPieces}
        onPuzzleStarted={handlePuzzleStarted}
        boosts={
          anemoneFlowerBuilt
            ? [{ name: "Anemone Flower", value: "+1 Attempt" }]
            : []
        }
        gameState={gameState.context.state}
      />

      <Modal show={showRetry}>
        <Panel>
          <div className="text-sm text-brown-500 flex flex-col p-1">
            <Label type="danger">{t("fishingPuzzle.missedFish")}</Label>
            <p className="p-1 mb-1.5">
              {t("fishingPuzzle.retryPrompt", { coins: FISH_RETRY_COST })}
            </p>
          </div>
          <div className="flex w-full">
            <Button
              onClick={() =>
                onMiss({
                  completed: false,
                  attemptsLeft: 0,
                  attemptsUsed: attemptLimit,
                })
              }
              className="mr-1"
            >
              {t("no")}
            </Button>
            <Button disabled={coins < FISH_RETRY_COST} onClick={retry}>
              {t("retry")}
            </Button>
          </div>
        </Panel>
      </Modal>

      <Modal show={showTimeoutMiss} onHide={() => setShowTimeoutMiss(false)}>
        <Panel>
          <div className="text-sm text-brown-500 flex flex-col p-1">
            <Label type="danger">{t("fishingPuzzle.timeoutTitle")}</Label>
            <p className="p-1 mb-1.5">{t("fishingPuzzle.timeoutMessage")}</p>
          </div>
          <Button
            onClick={() => {
              setShowTimeoutMiss(false);
              handleMiss({
                completed: false,
                attemptsLeft: 0,
                attemptsUsed: attemptLimit,
              });
            }}
          >
            {t("ok")}
          </Button>
        </Panel>
      </Modal>
    </>
  );
};

interface FishingMinigameProps {
  rows?: number;
  cols?: number;
  maxAttempts?: number;
  resetKey?: number;
  onPuzzleStarted?: () => void;
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
  difficultCatch: (FishName | MarineMarvelName)[];
  boosts: { name: BoostName; value: string }[];
  gameState: GameState;
}

const FishingPuzzle: React.FC<FishingMinigameProps> = ({
  gameState,
  rows = 6,
  cols = 4,
  maxAttempts = 4,
  onCatch,
  onMiss,
  resetKey = 0,
  difficultCatch,
  onPuzzleStarted,
  boosts,
}) => {
  const [dimensions, setDimensions] = useState({
    rows: clampValue(rows, MIN_ROWS, MAX_ROWS),
    cols: clampValue(cols, MIN_COLS, MAX_COLS),
  });
  const [path, setPath] = useState(() =>
    generateSafePath(dimensions.rows, dimensions.cols),
  );
  const [showBoostPopover, setShowBoostPopover] = useState(false);

  const { t } = useAppTranslation();

  const [revealedTiles, setRevealedTiles] = useState<Set<string>>(
    () => new Set(),
  );
  const [temporaryReveals, setTemporaryReveals] = useState<Set<string>>(
    () => new Set(),
  );
  const [progress, setProgress] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [mistakeTile, setMistakeTile] = useState<MistakeTile | null>(null);
  const [isResolvingMistake, setIsResolvingMistake] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const failureTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const completionTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const hasReportedResultRef = useRef(false);
  const lastMaxAttemptsRef = useRef(maxAttempts);
  const hasMarkedStartRef = useRef(false);

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
      setAttempts(0);
      setMistakeTile(null);
      setIsResolvingMistake(false);
      setIsComplete(false);
      setTemporaryReveals(new Set());
      hasReportedResultRef.current = false;
    },
    [],
  );

  useEffect(() => {
    // Defer the full reset to the next frame to avoid React's cascading render warning
    // from multiple synchronous setState calls inside effects.
    const raf = requestAnimationFrame(() =>
      applyConfig(rows, cols, maxAttempts),
    );
    return () => cancelAnimationFrame(raf);
  }, [applyConfig, cols, resetKey, rows]);

  // When the allowed attempts increase (paid retry), clear the reported flag
  // so a subsequent success/fail can fire callbacks again without regenerating the path.
  useEffect(() => {
    if (maxAttempts !== lastMaxAttemptsRef.current) {
      lastMaxAttemptsRef.current = maxAttempts;
      hasReportedResultRef.current = false;
    }
  }, [maxAttempts]);

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
    setAttempts((prev) => prev + 1);
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
    if (!hasMarkedStartRef.current) {
      onPuzzleStarted?.();
      hasMarkedStartRef.current = true;
    }

    if (isComplete || attempts === maxAttempts || isResolvingMistake) return;
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

  useEffect(() => {
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
        attemptsLeft: maxAttempts - attempts,
        attemptsUsed: attempts,
      };

      if (completed) {
        onCatch?.({ ...result, completed: true });
      } else {
        onMiss?.({ ...result, completed: false });
      }
    },
    [attempts, onCatch, onMiss, maxAttempts],
  );

  useEffect(() => {
    if (completionTimerRef.current) {
      clearTimeout(completionTimerRef.current);
      completionTimerRef.current = undefined;
    }

    if (isComplete) {
      completionTimerRef.current = setTimeout(() => {
        reportFinish(true);
        completionTimerRef.current = undefined;
      }, 2000);
    } else if (attempts === maxAttempts) {
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
  }, [isComplete, attempts, reportFinish, maxAttempts]);

  return (
    <div className=" text-sm text-brown-500 flex flex-col items-center">
      <Label
        type={
          maxAttempts - attempts === 1
            ? "warning"
            : maxAttempts - attempts === 0
              ? "danger"
              : "default"
        }
        secondaryIcon={boosts.length ? lightning : undefined}
        onClick={
          boosts.length
            ? () => {
                setShowBoostPopover(true);
              }
            : undefined
        }
      >
        {t("fishingPuzzle.attemptsLeft", {
          attemptsLeft: maxAttempts - attempts,
          attemptLimit: maxAttempts,
        })}
      </Label>
      <BoostsDisplay
        boosts={bonusAttempts}
        show={showBoostPopover}
        state={gameState}
        onClick={() => {
          setShowBoostPopover(false);
        }}
      />

      <div className="flex  items-center justify-center my-2">
        <img src={blueCheck} className="w-8" />
        <p className="text-xs text-center">{t("fishingPuzzle.findSafePath")}</p>
        <img src={blueCheck} className="w-8" />
      </div>

      {isComplete && (
        <div className="rounded bg-green-100 border border-green-400 px-2 py-1 text-xs text-green-700 mb-2">
          {t("fishingPuzzle.success")}
        </div>
      )}
      {attempts === maxAttempts && !isComplete && (
        <div className="rounded bg-red-100 border border-red-400 px-2 py-1 text-xs text-red-700 mb-2">
          {t("fishingPuzzle.failedAttempts")}
        </div>
      )}

      <div
        className="grid gap-2 justify-items-center p-2 rounded-lg"
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
              attempts === maxAttempts ||
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
                  "h-12 w-12 rounded transition-colors duration-200",
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
                        ? "1px solid rgba(255,255,255,0.75)"
                        : "1px solid rgba(255,255,255,0.35)",
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

      <div className="flex gap-2 mt-3 justify-center flex-wrap">
        {difficultCatch.map((name, idx) => (
          <div key={`${name}-${idx}`} className="w-10 relative">
            <img src={mapIcon} className="w-full" />
            <img
              src={SUNNYSIDE.icons.expression_confused}
              className="w-3 absolute bottom-7 right-4"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
