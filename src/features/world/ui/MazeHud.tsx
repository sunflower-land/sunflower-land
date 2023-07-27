import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Panel } from "components/ui/Panel";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
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

export const MazeHud: React.FC = () => {
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [collectedCorn, setCollectedCorn] = useState<string[]>([]);

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
    if (health <= 0) {
      setGameOver(true);
    }
  }, [health]);

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
    </>
  );
};
