import { SUNNYSIDE } from "assets/sunnyside";
import React, { useContext, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Context } from "features/game/GameProvider";
import { MachineState as GameMachineState } from "features/game/lib/gameMachine";
import { useInterpret, useSelector } from "@xstate/react";
import { calculateFeathersEarned } from "features/game/events/landExpansion/saveMaze";
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
  MachineInterpreter,
  MachineState,
  cornMazeMachine,
} from "features/world/lib/cornmazeMachine";
import { MAZE_TIME_LIMIT_SECONDS } from "features/game/events/landExpansion/startMaze";

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

const _sceneLoaded = (state: MachineState) => state.context.sceneLoaded;
const _score = (state: MachineState) => state.context.score;
const _health = (state: MachineState) => state.context.health;
const _timeElapsed = (state: MachineState) => state.context.timeElapsed;
const _startedAt = (state: MachineState) => state.context.startedAt;
const _paused = (state: MachineState) => state.matches("paused");
const _wonGame = (state: MachineState) => state.matches("wonGame");
const _lostGame = (state: MachineState) => state.matches("lostGame");
const _showingTips = (state: MachineState) => state.matches("showingTips");

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
    },
  }) as unknown as MachineInterpreter;

  const sceneLoaded = useSelector(cornMazeService, _sceneLoaded);
  const score = useSelector(cornMazeService, _score);
  const health = useSelector(cornMazeService, _health);
  const timeElapsed = useSelector(cornMazeService, _timeElapsed);
  const startedAt = useSelector(cornMazeService, _startedAt);
  const paused = useSelector(cornMazeService, _paused);
  const wonGame = useSelector(cornMazeService, _wonGame);
  const lostGame = useSelector(cornMazeService, _lostGame);
  const showingTips = useSelector(cornMazeService, _showingTips);

  useEffect(() => {
    mazeManager.listen({
      collectCrow: () => {
        cornMazeService.send("COLLECT_CROW");
      },
      hit: () => {
        cornMazeService.send("HIT");
      },
      sceneLoaded: () => {
        cornMazeService.send("SCENE_LOADED");
      },
      handlePortalHit: () => {
        cornMazeService.send("PORTAL_HIT");
      },
    });

    const saveGameState = (event: BeforeUnloadEvent) => {
      gameService.send("maze.saved", {
        crowsFound: cornMazeService.state.context.score,
        health,
        timeRemaining:
          MAZE_TIME_LIMIT_SECONDS - cornMazeService.state.context.timeElapsed,
      });
      gameService.send("SAVE");

      event.preventDefault();
      event.returnValue = "";
    };

    // Save maze progress if a player refreshes the browser
    window.addEventListener("beforeunload", saveGameState);

    // unmount the save call
    return () => {
      window.removeEventListener("beforeunload", saveGameState);
    };
  }, []);

  useEffect(() => {
    if (!startedAt) return;

    handleMazeComplete();
  }, [lostGame]);

  // if (!activeAttempt) {
  //   navigate("/world/plaza");
  //   return null;
  // }

  const handleStart = () => {
    cornMazeService.send("START_GAME");
  };

  const handleResume = () => {
    cornMazeService.send("RESUME_GAME");
  };

  const handleMazeComplete = () => {
    console.log("Maze Complete");
    // All game stats are recorded so action is always called when leaving
    gameService.send("maze.saved", {
      crowsFound: score,
      health,
      timeRemaining: MAZE_TIME_LIMIT_SECONDS - timeElapsed,
      // completedAt: Date.now(),
    });
    gameService.send("SAVE");
  };

  const handleReturnToPlaza = () => {
    console.log("Maze Complete");
    // All game stats are recorded so action is always called when leaving
    gameService.send("maze.saved", {
      crowsFound: score,
      health,
      timeRemaining: MAZE_TIME_LIMIT_SECONDS - timeElapsed,
      completedAt: Date.now(),
    });
    gameService.send("SAVE");
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

  if (!sceneLoaded) return null;

  const hasNewHighScore = score > highestScore;

  return (
    <>
      <div className="fixed inset-0">
        <div className="absolute top-2 right-2 text-[2.5rem] md:text-xl flex space-x-2 items-center">
          <img
            src={crowWithoutShadow}
            alt="Collected Crows"
            className="w-10 md:w-14"
          />
          <span className="mb-2">{`${score}/${weeklyLostCrowCount}`}</span>
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
      </div>
      {/* Lost */}
      {/* Call action and go back to plaza */}
      <Modal show={lostGame} centered>
        <LosingModalContent
          timeRemaining={MAZE_TIME_LIMIT_SECONDS - timeElapsed}
          onClick={handleReturnToPlaza}
        />
      </Modal>
      {/* Won: Found all crows */}
      {/* Call action and go back to plaza */}
      <Modal show={wonGame} centered>
        <WinningModalContent
          claimedFeathers={claimedFeathers}
          feathersEarned={getFeathersEarned()}
          onClick={() => {
            handleMazeComplete();
            handleReturnToPlaza();
          }}
        />
      </Modal>
      {/* Paused: New high score */}
      {/* Either all action and go back to plaza or continue playing */}
      <Modal show={paused && hasNewHighScore} centered>
        <PausedHighScoreModalContent
          feathersEarned={getFeathersEarned()}
          score={score}
          claimedFeathers={claimedFeathers}
          onContinue={handleResume}
          onEnd={() => {
            handleMazeComplete();
            handleReturnToPlaza();
          }}
        />
      </Modal>
      {/* Paused: Continue */}
      {/* Either continue playing or call action and go back to the plaza */}
      <Modal show={paused && !hasNewHighScore} centered>
        <PausedLowScoreModalContent
          highestScore={highestScore}
          claimedFeathers={claimedFeathers}
          onContinue={handleResume}
          onEnd={() => {
            handleMazeComplete();
            handleReturnToPlaza();
          }}
        />
      </Modal>
      {/* Welcome Modal */}
      <Modal onHide={handleResume} centered show={showingTips}>
        <TipsModalContent
          gameActive={startedAt > 0}
          onStart={handleStart}
          onResume={handleResume}
        />
      </Modal>
    </>
  );
};
