import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { CountdownLabel } from "components/ui/CountdownLabel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import crowWithoutShadow from "assets/decorations/crow_without_shadow.png";
import classNames from "classnames";
import eventBus from "../lib/eventBus";

type Listener = {
  collectCrow: (id: string) => void;
  hit: () => void;
  sceneLoaded: () => void;
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

  public listen(cb: Listener) {
    this.listener = cb;
  }
}

export const mazeManager = new MazeManager();

const TIME_LIMIT_SECONDS = 60 * 3;
const TOTAL_LOST_CROWS = 50;

export const MazeHud: React.FC = () => {
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(3);
  const [gameOver, setGameOver] = useState<"won" | "lost">();
  const [showIntro, setShowIntro] = useState(false);
  const [startedAt, setStartedAt] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    mazeManager.listen({
      collectCrow: () => {
        setScore((s) => {
          if (gameOver) return s;

          return s + 1;
        });
      },
      hit: () => {
        setHealth((h) => {
          if (gameOver) return 0;

          if (h > 1) return h - 1;

          return 0;
        });
      },
      sceneLoaded: () => {
        setShowIntro(true);
      },
    });
  }, []);

  useEffect(() => {
    if (health <= 0 || timeElapsed >= TIME_LIMIT_SECONDS) {
      setGameOver("lost");
    } else if (score === 50) {
      setGameOver("won");
    }
  }, [health, timeElapsed, score]);

  useEffect(() => {
    if (startedAt === 0) return;

    const interval = setInterval(() => {
      if (gameOver) {
        clearInterval(interval);
        eventBus.emit("corn_maze:gameOver");
        return;
      }

      const now = Date.now();
      const elapsed = Math.floor((+now - startedAt) / 1000);

      setTimeElapsed(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt, gameOver]);

  const handleStart = () => {
    const now = Date.now();
    // start timer
    setShowIntro(false);
    setStartedAt(now);
  };

  return (
    <>
      <div className="fixed inset-0">
        <div className="absolute top-2 right-2 text-[2.5rem] md:text-xl flex space-x-2 items-center">
          <img
            src={crowWithoutShadow}
            alt="Collected Crows"
            className="w-10 md:w-14"
          />
          <span className="mb-2">{`${score}/${TOTAL_LOST_CROWS}`}</span>
        </div>
        <div className="absolute top-2 left-2 flex space-x-2 items-center">
          {new Array(3).fill(null).map((_, i) => (
            <img
              key={i}
              src={SUNNYSIDE.icons.heart}
              className="w-10 md:w-14 grayscale opacity-50"
            />
          ))}
        </div>
        <div className="absolute top-2 left-2 flex space-x-2 items-center">
          {new Array(health).fill(null).map((_, i) => (
            <img key={i} src={SUNNYSIDE.icons.heart} className="w-10 md:w-14" />
          ))}
        </div>
        <div
          className={classNames(
            "absolute left-1/2 bottom-0 -translate-x-1/2 scale-150 md:scale-[2] transition-transform duration-500",
            {
              "translate-y-10": startedAt === 0,
              "-translate-y-4 md:-translate-y-6": startedAt > 0,
            }
          )}
        >
          <CountdownLabel timeLeft={TIME_LIMIT_SECONDS - timeElapsed} />
        </div>
      </div>
      <Modal show={!!gameOver} centered>
        <CloseButtonPanel title="Game Over" bumpkinParts={NPC_WEARABLES.luna}>
          <div className="p-1 -mt-2 text-xs md:text-sm space-y-2 mb-2">
            <p>
              Oh no! My poor crows! It seems you have been outwitted by the
              cunning enemies. For now, you shall return to whence you came.
            </p>
            <p>
              The magical corn maze bids you farewell, brave adventurer. Until
              next time!
            </p>
          </div>
          <Button
            onClick={() => {
              navigate("/world/plaza");
            }}
          >
            Go back
          </Button>
        </CloseButtonPanel>
      </Modal>
      {/* Welcome Modal */}
      <Modal centered show={showIntro}>
        <CloseButtonPanel
          title="Welcome to the Corn Maze!"
          bumpkinParts={NPC_WEARABLES.luna}
        >
          <>
            <div className="p-1 -mt-2 text-xs md:text-sm space-y-2 mb-2">
              <p>
                My adorable crows have disappeared, and I need your help. Find
                them, but beware of cunning enemies. Your bravery shall be
                rewarded, dear adventurer.
              </p>
              <p>
                Now, venture forth, and remember, time is of the essence. You
                only have three minutes, so navigate the twisting paths of the
                maze with speed and agility.
              </p>
              <div className="space-y-2 flex flex-col mt-3">
                <div className="flex items-center space-x-2">
                  <img src={crowWithoutShadow} alt="Corn" className="w-6" />
                  <p>Collect all the missing crows.</p>
                </div>
                <div className="flex items-center space-x-2">
                  <img
                    src={SUNNYSIDE.icons.heart}
                    alt="Health"
                    className="w-6"
                  />
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
              </div>
            </div>
            <Button onClick={handleStart}>{`Let's Go!`}</Button>
          </>
        </CloseButtonPanel>
      </Modal>
    </>
  );
};
