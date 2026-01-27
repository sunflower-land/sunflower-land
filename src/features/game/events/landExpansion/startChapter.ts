import { GameState } from "features/game/types/game";

import { produce } from "immer";
import { getCurrentChapter } from "features/game/types/chapters";

export type StartChapterAction = {
  type: "chapter.started";
};

type Options = {
  state: Readonly<GameState>;
  action: StartChapterAction;
  createdAt?: number;
};

export function startChapter({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const chapterName = getCurrentChapter(createdAt);

    if (copy.chapter && copy.chapter.name === chapterName) {
      throw new Error("Chapter already started");
    }

    copy.chapter = {
      name: chapterName,
      boughtAt: {},
    };

    delete copy.inventory["Chapter Surge"];

    return copy;
  });
}
