import React, { useCallback, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import { Button } from "components/ui/Button";

const FAILURE_REVEAL_MS = 1000;
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

  for (let r = row - 1; r <= row + 1; r++) {
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
}

export const FishingMinigame: React.FC<FishingMinigameProps> = ({
  rows = 4,
  cols = 3,
  maxAttempts = 3,
}) => {
  const [dimensions, setDimensions] = useState({
    rows: clampValue(rows, MIN_ROWS, MAX_ROWS),
    cols: clampValue(cols, MIN_COLS, MAX_COLS),
  });
  const [pendingRows, setPendingRows] = useState(dimensions.rows);
  const [pendingCols, setPendingCols] = useState(dimensions.cols);
  const [path, setPath] = useState(() =>
    generateSafePath(dimensions.rows, dimensions.cols),
  );
  const initialAttemptLimit = clampValue(
    maxAttempts,
    MIN_ATTEMPTS,
    MAX_ATTEMPTS,
  );
  const [attemptLimit, setAttemptLimit] = useState(initialAttemptLimit);
  const [pendingAttempts, setPendingAttempts] = useState(initialAttemptLimit);
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
  const failureTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const rowsArray = useMemo(
    () => Array.from({ length: dimensions.rows }, (_, index) => index),
    [dimensions.rows],
  );
  const colsArray = useMemo(
    () => Array.from({ length: dimensions.cols }, (_, index) => index),
    [dimensions.cols],
  );

  const regeneratePuzzle = useCallback(
    (rowsToUse: number, colsToUse: number) => {
      if (failureTimerRef.current) {
        clearTimeout(failureTimerRef.current);
        failureTimerRef.current = undefined;
      }

      const nextRows = clampValue(rowsToUse, MIN_ROWS, MAX_ROWS);
      const nextCols = clampValue(colsToUse, MIN_COLS, MAX_COLS);

      setDimensions({ rows: nextRows, cols: nextCols });
      setPendingRows(nextRows);
      setPendingCols(nextCols);
      setPath(generateSafePath(nextRows, nextCols));
      setRevealedTiles(new Set());
      setProgress(0);
      setAttemptsLeft(attemptLimit);
      setMistakeTile(null);
      setIsResolvingMistake(false);
      setIsComplete(false);
      setPendingAttempts(attemptLimit);
      setTemporaryReveals(new Set());
    },
    [attemptLimit],
  );

  const handleReset = () => regeneratePuzzle(dimensions.rows, dimensions.cols);

  const handleApplyDimensions = () =>
    regeneratePuzzle(pendingRows, pendingCols);

  const handleApplyAttempts = () => {
    if (failureTimerRef.current) {
      clearTimeout(failureTimerRef.current);
      failureTimerRef.current = undefined;
    }
    const nextAttemptLimit = clampValue(
      pendingAttempts,
      MIN_ATTEMPTS,
      MAX_ATTEMPTS,
    );
    setAttemptLimit(nextAttemptLimit);
    setPendingAttempts(nextAttemptLimit);
    setAttemptsLeft(nextAttemptLimit);
    setRevealedTiles(new Set());
    setProgress(0);
    setMistakeTile(null);
    setIsResolvingMistake(false);
    setIsComplete(false);
    setTemporaryReveals(new Set());
  };

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

  const handleIncorrectSelection = (
    row: number,
    col: number,
  ) => {
    if (failureTimerRef.current) {
      clearTimeout(failureTimerRef.current);
    }

    setMistakeTile({ row, col });
    setIsResolvingMistake(true);
    setAttemptsLeft((prev) => Math.max(0, prev - 1));
    setTemporaryReveals(
      new Set(
        getSurroundingTiles(row, col, dimensions.rows, dimensions.cols),
      ),
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

  const statusLabel = (() => {
    if (isComplete) return "Success! The path is clear.";
    if (attemptsLeft === 0) return "Out of attempts. Reset to try again.";
    return "Find the safe path from bottom to top.";
  })();

  const currentStep = Math.min(progress + 1, path.length);

  const nextStep = path[progress];

  return (
    <div className="space-y-3 text-sm text-brown-500">
      <div>
        <h2 className="text-lg font-bold text-brown-600">Fishing Minigame</h2>
        <p className="text-xs opacity-80">{statusLabel}</p>
      </div>

      <div className="flex flex-wrap gap-3 text-xs">
        <div className="flex-1 min-w-[120px]">
          <div className="font-semibold text-brown-600">Attempts</div>
          <div>
            {attemptsLeft}/{attemptLimit}
          </div>
        </div>
        <div className="flex-1 min-w-[120px]">
          <div className="font-semibold text-brown-600">Step</div>
          <div>
            {currentStep}/{path.length}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <label className="flex flex-col gap-1 flex-1 min-w-[120px]">
          <span className="font-semibold text-brown-600">Rows</span>
          <input
            type="number"
            min={MIN_ROWS}
            max={MAX_ROWS}
            value={pendingRows}
            onChange={(event) =>
              setPendingRows(Number(event.currentTarget.value))
            }
            className="rounded border border-brown-500/60 bg-[#ffefc4] px-2 py-1 text-brown-700"
          />
        </label>
        <label className="flex flex-col gap-1 flex-1 min-w-[120px]">
          <span className="font-semibold text-brown-600">Columns</span>
          <input
            type="number"
            min={MIN_COLS}
            max={MAX_COLS}
            value={pendingCols}
            onChange={(event) =>
              setPendingCols(Number(event.currentTarget.value))
            }
            className="rounded border border-brown-500/60 bg-[#ffefc4] px-2 py-1 text-brown-700"
          />
        </label>
        <div className="flex flex-col justify-end flex-1 min-w-[120px]">
          <Button
            onClick={handleApplyDimensions}
            disabled={isResolvingMistake}
            className="text-xs"
          >
            Update Grid
          </Button>
        </div>
        <label className="flex flex-col gap-1 flex-1 min-w-[120px]">
          <span className="font-semibold text-brown-600">Attempts</span>
          <input
            type="number"
            min={MIN_ATTEMPTS}
            max={MAX_ATTEMPTS}
            value={pendingAttempts}
            onChange={(event) =>
              setPendingAttempts(Number(event.currentTarget.value))
            }
            className="rounded border border-brown-500/60 bg-[#ffefc4] px-2 py-1 text-brown-700"
          />
        </label>
        <div className="flex flex-col justify-end flex-1 min-w-[120px]">
          <Button
            onClick={handleApplyAttempts}
            disabled={isResolvingMistake}
            className="text-xs"
          >
            Update Attempts
          </Button>
        </div>
      </div>

      <div
        className="grid gap-2"
        style={{
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
            const isSelectable =
              !!nextStep &&
              row === nextStep.row;
            const isDisabled =
              isComplete ||
              attemptsLeft === 0 ||
              isResolvingMistake ||
              !isSelectable;
            const showGreen =
              (isRevealed || (isTemporarilyRevealed && isPathTile)) &&
              !isMistake;
            const showRed =
              isMistake || (isTemporarilyRevealed && !isPathTile);

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleTileClick(row, col)}
                disabled={isDisabled}
                className={classNames(
                  "aspect-square rounded border-2 shadow-inner transition-colors duration-200",
                  {
                    "bg-green-500 border-green-600 text-white": showGreen,
                    "bg-red-500 border-red-600 text-white": showRed,
                    "bg-slate-200 border-slate-300":
                      !showGreen && !showRed,
                    "opacity-60 cursor-not-allowed": isDisabled,
                  },
                )}
              >
                {isRevealed && pathIndex >= 0 ? pathIndex + 1 : ""}
              </button>
            );
          }),
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Button
          onClick={handleReset}
          disabled={isResolvingMistake}
          className="text-xs"
        >
          Reset Puzzle
        </Button>
        {isComplete && (
          <div className="rounded bg-green-100 border border-green-400 px-2 py-1 text-xs text-green-700">
            Great job! You reached the top.
          </div>
        )}
        {attemptsLeft === 0 && !isComplete && (
          <div className="rounded bg-red-100 border border-red-400 px-2 py-1 text-xs text-red-700">
            You ran out of attempts. Reset to try a new path.
          </div>
        )}
      </div>
    </div>
  );
};
