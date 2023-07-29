import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { CountdownLabel } from "components/ui/CountdownLabel";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useContext, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import crowWithoutShadow from "assets/decorations/crow_without_shadow.png";
import crowFeather from "assets/decorations/crow_feather_large.png";
import classNames from "classnames";
import { Context } from "features/game/GameProvider";
import { MachineState as GameMachineState } from "features/game/lib/gameMachine";
import { useInterpret, useSelector } from "@xstate/react";
import { calculateFeathersEarned } from "features/game/events/landExpansion/attemptMaze";
import { getSeasonWeek } from "lib/utils/getSeasonWeek";
import { MazeMetadata, WitchesEve } from "features/game/types/game";
import { Panel } from "components/ui/Panel";
import {
  MachineInterpreter,
  MachineState,
  cornMazeMachine,
} from "../lib/cornmazeMachine";

type Listener = {
  collectCrow: (id: string) => void;
  hit: () => void;
  sceneLoaded: (crowCount: number) => void;
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

  public sceneLoaded(crowCount: number) {
    if (this.listener) {
      this.listener.sceneLoaded(crowCount);
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

const TIME_LIMIT_SECONDS = 60 * 3;
const DEFAULT_HEALTH = 3;

const _witchesEve = (state: GameMachineState) =>
  state.context.state.witchesEve as WitchesEve;

const _sceneLoaded = (state: MachineState) => state.context.sceneLoaded;
const _score = (state: MachineState) => state.context.score;
const _health = (state: MachineState) => state.context.health;
const _timeElapsed = (state: MachineState) => state.context.timeElapsed;
const _startedAt = (state: MachineState) => state.context.startedAt;

const _playing = (state: MachineState) => state.matches("playing");
const _paused = (state: MachineState) => state.matches("paused");
const _wonGame = (state: MachineState) => state.matches("wonGame");
const _lostGame = (state: MachineState) => state.matches("lostGame");
const _showingTips = (state: MachineState) => state.matches("showingTips");

export const MazeHud: React.FC = () => {
  const { gameService } = useContext(Context);
  const currentWeek = getSeasonWeek(Date.now());
  const witchesEve = useSelector(gameService, _witchesEve);

  const { weeklyLostCrowCount } = witchesEve;
  const { claimedFeathers, highestScore } = witchesEve?.maze[
    currentWeek
  ] as MazeMetadata;

  // const [score, setScore] = useState(0);
  // const [health, setHealth] = useState(3);
  // const [totalLostCrows, setTotalLostCrowCount] = useState(0);
  // const [gameOver, setGameOver] = useState<"won" | "lost">();
  // const [sceneLoaded, setSceneLoaded] = useState(false);
  // const [showTips, setShowTips] = useState(false);
  // const [startedAt, setStartedAt] = useState<number>(0);
  // const [timeElapsed, setTimeElapsed] = useState<number>(0);
  // const [paused, setPaused] = useState(false);
  // const [pausedAt, setPausedAt] = useState(0);

  const navigate = useNavigate();

  const cornMazeService = useInterpret(cornMazeMachine, {
    context: {
      score: 0,
      health: DEFAULT_HEALTH,
      totalLostCrows: weeklyLostCrowCount,
      gameOver: undefined,
      sceneLoaded: false,
      startedAt: 0,
      timeElapsed: 0,
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
        // setScore((s) => s + 1);
        cornMazeService.send("COLLECT_CROW");
      },
      hit: () => {
        // setHealth((h) => h - 1);
        cornMazeService.send("HIT");
      },
      sceneLoaded: (crowCount: number) => {
        // setTotalLostCrowCount(crowCount);
        cornMazeService.send("SCENE_LOADED");
      },
      handlePortalHit: () => {
        // setGameOver("won");
        cornMazeService.send("PORTAL_HIT");
      },
    });
  }, []);

  const handleStart = () => {
    // setStartedAt(Date.now());
    cornMazeService.send("START_GAME");
  };

  const handleResume = () => {
    // setPaused(false);
    // setTimeElapsed((e) => e + Date.now() - pausedAt);
    cornMazeService.send("RESUME_GAME");
  };

  const getFeathersEarned = () => {
    const weeklyMazeData = witchesEve?.maze[currentWeek];

    if (!weeklyMazeData) return 0;

    const { claimedFeathers } = weeklyMazeData;

    return calculateFeathersEarned(weeklyLostCrowCount, score, claimedFeathers);
  };

  const handleMazeComplete = () => {
    // All game stats are recorded so action is always called when leaving
    gameService.send("maze.attempted", {
      crowsFound: score,
      health,
      timeRemaining: TIME_LIMIT_SECONDS - timeElapsed,
    });
    gameService.send("SAVE");

    navigate("/world/plaza");
  };

  const handleReturnToPlaza = () => {
    navigate("/world/plaza");
  };

  const handleShowTips = () => {
    // setShowTips(true);
    cornMazeService.send("SHOW_TIPS");
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
          className="absolute bottom-2 right-2 cursor-pointer"
          onClick={handleShowTips}
        >
          <img
            src={SUNNYSIDE.icons.expression_confused}
            className="h-10 md:h-14"
          />
        </div>
        <div
          className={classNames(
            "absolute left-1/2 bottom-0 -translate-x-1/2 scale-150 md:scale-[2] transition-transform duration-500",
            {
              "translate-y-10": startedAt === 0,
              "-translate-y-4 md:-translate-y-6": startedAt > 0,
              scaling: TIME_LIMIT_SECONDS - timeElapsed <= 10,
            }
          )}
        >
          <CountdownLabel timeLeft={TIME_LIMIT_SECONDS - timeElapsed} />
        </div>
      </div>
      {/* Lost */}
      {/* Call action and go back to plaza */}
      <Modal show={lostGame} centered>
        <LosingModalContent
          timeRemaining={TIME_LIMIT_SECONDS - timeElapsed}
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

const TipsModalContent: React.FC<{
  gameActive: boolean;
  onStart: () => void;
  onResume: () => void;
}> = ({ gameActive, onStart, onResume }) => {
  return (
    <Panel
      bumpkinParts={{
        ...NPC_WEARABLES.luna,
        body: "Light Brown Worried Farmer Potion",
      }}
    >
      <>
        <div className="p-1 pt-2 space-y-2 mb-2">
          <div className="space-y-2 flex flex-col">
            <div className="flex items-center space-x-2">
              <img src={crowWithoutShadow} alt="Corn" className="w-6" />
              <p>Collect all the missing crows.</p>
            </div>
            <div className="flex items-center space-x-2">
              <img src={SUNNYSIDE.icons.heart} alt="Health" className="w-6" />
              <p>Avoid all the enemies.</p>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src={SUNNYSIDE.icons.stopwatch}
                alt="timer"
                className="h-6"
              />
              <p>Make it back to the portal before the time runs out!</p>
            </div>
            <div className="flex items-center space-x-2">
              <img src={crowFeather} alt="feather" className="h-6" />
              <p>{`Earn up to 100 feathers each week.`}</p>
            </div>
          </div>
        </div>
        {!gameActive && <Button onClick={onStart}>{`Let's Go!`}</Button>}
        {gameActive && <Button onClick={onResume}>{`Got it`}</Button>}
      </>
    </Panel>
  );
};

const LosingModalContent: React.FC<{
  timeRemaining: number;
  onClick: () => void;
}> = ({ timeRemaining, onClick }) => {
  return (
    <Panel
      bumpkinParts={{
        ...NPC_WEARABLES.luna,
        body: "Light Brown Worried Farmer Potion",
      }}
    >
      <div className="p-1 space-y-2 mb-2 flex flex-col">
        <p>
          {`Oh no ${
            timeRemaining === 0 ? "times up" : ""
          }! My poor crows! It seems you have been outwitted by the cunning
          enemies. For now, you shall return to whence you came.`}
        </p>
        <p>
          The magical corn maze bids you farewell, brave adventurer. Until next
          time!
        </p>
      </div>
      <Button onClick={onClick}>Back to Plaza</Button>
    </Panel>
  );
};

const WinningModalContent: React.FC<{
  feathersEarned: number;
  claimedFeathers: number;
  onClick: () => void;
}> = ({ feathersEarned, claimedFeathers, onClick }) => {
  return (
    <Panel bumpkinParts={NPC_WEARABLES.luna}>
      <div className="p-1 space-y-2 mb-2 flex flex-col">
        <p>
          {`Ah, you've done it! You found all my mischievous crows hidden in
      the corn maze! I am absolutely delighted! `}
        </p>
        <p>
          {`I bestow upon you ${feathersEarned} valuable crow ${
            feathersEarned > 1 ? "feathers" : "feather"
          }, shimmering
          with magic to bless your future journeys.`}
        </p>
        <p className="text-xxs pb-1 italic">{`Feathers earned this week: ${claimedFeathers}/100`}</p>
      </div>
      <Button onClick={onClick}>Claim Crow Feathers</Button>
    </Panel>
  );
};

const PausedHighScoreModalContent: React.FC<{
  score: number;
  feathersEarned: number;
  claimedFeathers: number;
  onContinue: () => void;
  onEnd: () => void;
}> = ({ score, feathersEarned, claimedFeathers, onContinue, onEnd }) => {
  return (
    <Panel bumpkinParts={NPC_WEARABLES.luna}>
      <div className="p-1 space-y-2 mb-2 flex flex-col">
        <p>
          {`You found ${score} of my mischievous crows hidden in
      the corn maze! For your efforts, I will bestow upon you ${feathersEarned} valuable crow feathers.`}
        </p>
        <p>Are you sure you want to end now?</p>
        <p className="text-xxs italic">{`Feathers earned this week: ${claimedFeathers}/100`}</p>
      </div>
      <div className="flex flex-col-reverse space-y-1 space-y-reverse md:flex-row md:space-y-0 md:space-x-1">
        <Button onClick={onContinue}>Keep Playing</Button>
        <Button onClick={onEnd}>Claim Crow Feathers</Button>
      </div>
    </Panel>
  );
};

const PausedLowScoreModalContent: React.FC<{
  highestScore: number;
  claimedFeathers: number;
  onContinue: () => void;
  onEnd: () => void;
}> = ({ highestScore, claimedFeathers, onContinue, onEnd }) => {
  return (
    <Panel
      bumpkinParts={{
        ...NPC_WEARABLES.luna,
        body: "Light Brown Worried Farmer Potion",
      }}
    >
      <div className="p-1 space-y-2 mb-2 flex flex-col">
        <p>{`Oh no! Last time you found ${highestScore} crows! You will need to find more than that if you want more feathers from me!`}</p>
        <p>Are you sure you want to end now?</p>
        <p className="text-xxs italic">{`Feathers earned this week: ${claimedFeathers}/100`}</p>
      </div>
      <div className="flex flex-col-reverse space-y-1 space-y-reverse md:flex-row md:space-y-0 md:space-x-1">
        <Button onClick={onEnd}>Back to Plaza</Button>
        <Button onClick={onContinue}>Keep Playing</Button>
      </div>
    </Panel>
  );
};
