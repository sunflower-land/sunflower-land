import React, { useEffect, useState } from "react";

type InteractableName = "collect_corn";

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
  const [score, setScrore] = useState(0);
  const [health, setHealth] = useState(3);

  useEffect(() => {
    mazeManager.listen({
      collectCorn: (id) => {
        console.log("collect", id);
        setScrore((s) => s + 1);
      },
      hit: () => {
        console.log("hit");
      },
    });
  }, []);

  return (
    <div className="fixed inset-0">
      <div className="absolute top-2 right-2 text-xl">{score}</div>
      <div className="absolute top-2 left-2 text-xl">{health}</div>
    </div>
  );
};
