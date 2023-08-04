import { SUNNYSIDE } from "assets/sunnyside";
import React, { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Context } from "features/game/GameProvider";
import { MachineState as GameMachineState } from "features/game/lib/gameMachine";
import { useInterpret, useSelector } from "@xstate/react";
import {
  SaveMazeAction,
  calculateFeathersEarned,
} from "features/game/events/landExpansion/saveMaze";
import { getSeasonWeek } from "lib/utils/getSeasonWeek";
import { MazeMetadata, WitchesEve } from "features/game/types/game";
import { LosingModalContent } from "./LosingModalContent";
import { PausedHighScoreModalContent } from "./PausedHighScoreModalContent";
import { PausedLowScoreModalContent } from "./PausedLowScoreModalContent";
import { TipsModalContent } from "./TipsModalContent";
import { WinningModalContent } from "./WinningModalContent";

import crowWithoutShadow from "assets/decorations/crow_without_shadow.png";

import { TimerDisplay } from "./TimerDisplay";
import {
  HIT_PENALTY_SECONDS,
  MachineInterpreter,
  MachineState,
  cornMazeMachine,
} from "features/world/lib/cornmazeMachine";
import { MAZE_TIME_LIMIT_SECONDS } from "features/game/events/landExpansion/startMaze";
import { createPortal } from "react-dom";
import { NoActiveAttemptContent } from "./NoAttemptModalContent";
import { Label } from "components/ui/Label";
import classNames from "classnames";

type Listener = {
  collectCrow: (id: string) => void;
  hit: () => void;
  sceneLoaded: () => void;
  handlePortalHit: () => void;
};
class MazeManager {
  private listener?: Listener;

  public collect(id: string) {
    if (this.listener) {
      this.listener.collectCrow(id);
    }
  }

  public hit() {
    if (this.listener) {
      this.listener.hit();
    }
  }

  public sceneLoaded() {
    if (this.listener) {
      this.listener.sceneLoaded();
    }
  }

  public handlePortalHit() {
    if (this.listener) {
      this.listener.handlePortalHit();
    }
  }

  public listen(cb: Listener) {
    this.listener = cb;
  }
}

export const mazeManager = new MazeManager();

const DEFAULT_HEALTH = 3;

const _witchesEve = (state: GameMachineState) =>
  state.context.state.witchesEve as WitchesEve;

const _score = (state: MachineState) => state.context.score;
const _health = (state: MachineState) => state.context.health;
const _timeElapsed = (state: MachineState) => state.context.timeElapsed;
const _startedAt = (state: MachineState) => state.context.startedAt;
const _attemptCompletedAt = (state: MachineState) =>
  state.context.attemptCompletedAt;
const _pausedAt = (state: MachineState) => state.context.pausedAt;
const _paused = (state: MachineState) => state.matches("paused");
const _wonGame = (state: MachineState) => state.matches("wonGame");
const _lostGame = (state: MachineState) => state.matches("lostGame");
const _showingTips = (state: MachineState) => state.matches("showingTips");
const _noActiveAttempt = (state: MachineState) =>
  state.matches("noActiveAttempt");

export const MazeHud: React.FC = () => {
  const { gameService } = useContext(Context);
  const currentWeek = getSeasonWeek(Date.now());
  const witchesEve = useSelector(gameService, _witchesEve);

  const { weeklyLostCrowCount } = witchesEve;
  const { claimedFeathers, highestScore, attempts } = witchesEve?.maze[
    currentWeek
  ] as MazeMetadata;

  // Attempt is added to game start when Luna is paid
  const activeAttempt = attempts?.find((attempt) => !attempt.completedAt);

  const navigate = useNavigate();

  const cornMazeService = useInterpret(cornMazeMachine, {
    context: {
      score: activeAttempt?.crowsFound ?? 0,
      health: activeAttempt?.health ?? DEFAULT_HEALTH,
      totalLostCrows: weeklyLostCrowCount,
      gameOver: undefined,
      sceneLoaded: false,
      startedAt: 0,
      timeElapsed: activeAttempt?.time ? activeAttempt.time : 0,
      previousTimElapsed: activeAttempt?.time ? activeAttempt.time : 0,
      pausedAt: 0,
      activeAttempt,
    },
  }) as unknown as MachineInterpreter;

  const score = useSelector(cornMazeService, _score);
  const health = useSelector(cornMazeService, _health);
  const timeElapsed = useSelector(cornMazeService, _timeElapsed);
  const startedAt = useSelector(cornMazeService, _startedAt);
  const paused = useSelector(cornMazeService, _paused);
  const pausedAt = useSelector(cornMazeService, _pausedAt);
  const wonGame = useSelector(cornMazeService, _wonGame);
  const lostGame = useSelector(cornMazeService, _lostGame);
  const showingTips = useSelector(cornMazeService, _showingTips);
  const noActiveAttempt = useSelector(cornMazeService, _noActiveAttempt);
  const attemptCompletedAt = useSelector(cornMazeService, _attemptCompletedAt);

  const [showTimePenalty, setShowTimePenalty] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    mazeManager.listen({
      collectCrow: () => {
        cornMazeService.send("COLLECT_CROW");
      },
      hit: () => {
        cornMazeService.send("HIT");
        setShowTimePenalty(true);

        timeout = setTimeout(() => {
          setShowTimePenalty(false);
        }, 2000);
      },
      sceneLoaded: () => {
        cornMazeService.send("SCENE_LOADED");
      },
      handlePortalHit: () => {
        cornMazeService.send("PORTAL_HIT");
      },
    });

    const saveGameState = (event: BeforeUnloadEvent) => {
      console.log("active attempt in save, ", activeAttempt);
      handleSaveAttempt({
        crowsFound: cornMazeService.state.context.score,
        health: cornMazeService.state.context.health,
        timeRemaining: Math.max(
          MAZE_TIME_LIMIT_SECONDS - cornMazeService.state.context.timeElapsed,
          0
        ),
        ...(cornMazeService.state.context.attemptCompletedAt && {
          completedAt: cornMazeService.state.context.attemptCompletedAt,
        }),
      });

      event.preventDefault();
      event.returnValue = "";
    };

    // Save maze progress if a player refreshes the browser
    window.addEventListener("beforeunload", saveGameState);

    // unmount the save call
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("beforeunload", saveGameState);
    };
  }, []);

  useEffect(() => {
    if (!startedAt) return;

    // If lost game, persist attempt
    handleSaveAttempt({
      crowsFound: score,
      health,
      timeRemaining: MAZE_TIME_LIMIT_SECONDS - timeElapsed,
      completedAt: attemptCompletedAt,
    });
  }, [lostGame]);

  const handleStart = () => {
    cornMazeService.send("START_GAME");
  };

  const handleResume = () => {
    cornMazeService.send("RESUME_GAME");
  };

  const handleSaveAttempt = (attempt: Omit<SaveMazeAction, "type">) => {
    gameService.send("maze.saved", attempt);
    gameService.send("SAVE");
  };

  const handleReturnToPlaza = () => {
    navigate("/world/plaza");
  };

  const handleShowTips = () => {
    cornMazeService.send("SHOW_TIPS");
  };

  const getFeathersEarned = () => {
    const weeklyMazeData = witchesEve?.maze[currentWeek];

    if (!weeklyMazeData) return 0;

    const { claimedFeathers } = weeklyMazeData;

    return calculateFeathersEarned(weeklyLostCrowCount, score, claimedFeathers);
  };

  const hasNewHighScore = score > highestScore;

  return createPortal(
    <>
      <div className="absolute top-2 right-2 text-[2.5rem] md:text-xl flex flex-col items-end space-y-2">
        <div className="flex space-x-1 items-center">
          <img
            src={crowWithoutShadow}
            alt="Collected Crows"
            className="w-10 md:w-14"
          />
          <span className="mb-2">{`${score}/${weeklyLostCrowCount}`}</span>
        </div>
        {highestScore > 0 && (
          <Label type="info">{`Highest score: ${highestScore}`}</Label>
        )}
      </div>
      <div className="absolute top-2 left-2 flex space-x-2 items-center">
        {new Array(3).fill(null).map((_, i) => (
          <img
            key={i}
            src={SUNNYSIDE.icons.heart}
            className="w-10 md:w-14 grayscale opacity-90"
          />
        ))}
      </div>
      <div className="absolute top-2 left-2 flex space-x-2 items-center">
        {new Array(health).fill(null).map((_, i) => (
          <img key={i} src={SUNNYSIDE.icons.heart} className="w-10 md:w-14" />
        ))}
      </div>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center">
        <span
          className={classNames("pulsating transition-opacity duration-300", {
            "opacity-0": !showTimePenalty,
            "opacity-100": showTimePenalty,
          })}
        >
          {`-${HIT_PENALTY_SECONDS} secs`}
        </span>
      </div>
      <div
        className="absolute bottom-2 left-2 cursor-pointer"
        onClick={handleShowTips}
      >
        <img
          src={SUNNYSIDE.icons.expression_confused}
          className="h-10 md:h-14"
        />
      </div>
      <TimerDisplay
        startedAt={startedAt}
        timeLeft={MAZE_TIME_LIMIT_SECONDS - timeElapsed}
      />
      {/* Lost */}
      {/* Call action and go back to plaza */}
      <Modal show={lostGame} centered>
        <LosingModalContent
          timeRemaining={MAZE_TIME_LIMIT_SECONDS - timeElapsed}
          onClick={() => {
            handleReturnToPlaza();
          }}
        />
      </Modal>
      {/* Won: Found all crows */}
      {/* Complete attempt and go back to plaza */}
      <Modal show={wonGame} centered>
        <WinningModalContent
          claimedFeathers={claimedFeathers}
          feathersEarned={getFeathersEarned()}
          onClick={() => {
            handleSaveAttempt({
              crowsFound: score,
              health,
              timeRemaining: MAZE_TIME_LIMIT_SECONDS - timeElapsed,
              completedAt: attemptCompletedAt,
            });
            handleReturnToPlaza();
          }}
        />
      </Modal>
      {/* Paused: New high score */}
      {/* Either complete attempt and go back to plaza or continue playing */}
      <Modal show={paused && hasNewHighScore} centered>
        <PausedHighScoreModalContent
          feathersEarned={getFeathersEarned()}
          score={score}
          claimedFeathers={claimedFeathers}
          onContinue={handleResume}
          onEnd={() => {
            handleSaveAttempt({
              crowsFound: score,
              health,
              timeRemaining: MAZE_TIME_LIMIT_SECONDS - timeElapsed,
              completedAt: pausedAt,
            });
            handleReturnToPlaza();
          }}
        />
      </Modal>
      {/* Paused: Continue */}
      {/* Need to find more crows */}
      <Modal show={paused && !hasNewHighScore} centered>
        <PausedLowScoreModalContent
          highestScore={highestScore}
          onContinue={handleResume}
        />
      </Modal>
      {/* Welcome Modal */}
      <Modal centered show={showingTips}>
        <TipsModalContent
          hasSavedProgress={!!activeAttempt?.time}
          onStart={handleStart}
        />
      </Modal>
      {/* No active attempt modal */}
      <Modal onHide={handleReturnToPlaza} centered show={noActiveAttempt}>
        <NoActiveAttemptContent onClick={handleReturnToPlaza} />
      </Modal>
    </>,
    document.body
  );
};
