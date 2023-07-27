import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { CountdownLabel } from "components/ui/CountdownLabel";
import { Panel } from "components/ui/Panel";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { NPC_WEARABLES } from "lib/npcs";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

type Listener = {
  collectCorn: (id: string) => void;
  hit: () => void;
};
class MazeManager {
  private listener?: Listener;

  public collect(id: string) {
    if (this.listener) {
      this.listener.collectCorn(id);
    }
  }

  public hit() {
    if (this.listener) {
      this.listener.hit();
    }
  }

  public listen(cb: Listener) {
    this.listener = cb;
  }
}

export const mazeManager = new MazeManager();

const TIME_LIMIT_SECONDS = 60 * 3;

export const MazeHud: React.FC = () => {
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(3);
  const [gameOver, setGameOver] = useState<"won" | "lost">();
  const [collectedCorn, setCollectedCorn] = useState<string[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [startedAt, setStartedAt] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    mazeManager.listen({
      collectCorn: (id) => {
        setCollectedCorn((c) => [...c, id]);
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
    });
  }, []);

  useEffect(() => {
    if (health <= 0 || timeElapsed >= TIME_LIMIT_SECONDS) {
      setGameOver("lost");
      return;
    }

    if (score === 50) {
      setGameOver("won");
    }
  }, [health, timeElapsed, score]);

  useEffect(() => {
    if (startedAt === 0) return;

    const interval = setInterval(() => {
      if (gameOver) {
        clearInterval(interval);
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
            src={CROP_LIFECYCLE.Corn.crop}
            alt="Collected Corn"
            className="w-10 md:w-14"
          />
          <span>{score}</span>
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
        {startedAt > 0 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 scale-150">
            <CountdownLabel timeLeft={TIME_LIMIT_SECONDS - timeElapsed} />
          </div>
        )}
      </div>
      <Modal centered>
        <Panel>
          <div className="p-1 mb-2">
            {`Oh no! You lost all your health! You can try again, but for now it's a
          one way ticket back to the Plaza for you.`}
          </div>
          <Button onClick={() => setHealth(3)}>Go back</Button>
        </Panel>
      </Modal>
      {/* Welcome Modal */}
      <Modal centered show={showIntro}>
        <CloseButtonPanel
          onClose={() => setShowIntro(false)}
          title="Welcome to the Corn Maze!"
          bumpkinParts={NPC_WEARABLES.luna}
        >
          <>
            <div className="p-1 -mt-2 text-xs md:text-sm space-y-2 mb-2">
              <p>
                You have entered the Corn Maze. Do you have what it takes to
                collect all the corn and make it out alive?
              </p>
              <p>
                Time is of the essence, so navigate the twisting paths of the
                maze with speed and agility.
              </p>
              <div className="space-y-2 flex flex-col">
                <div className="flex items-center space-x-2">
                  <img
                    src={CROP_LIFECYCLE.Corn.crop}
                    alt="Corn"
                    className="w-6"
                  />
                  <p>Collect all the missing corn.</p>
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
                    src={SUNNYSIDE.icons.timer}
                    alt="Timer"
                    className="w-6"
                  />
                  <p>Make it back to the portal before your time runs out</p>
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
