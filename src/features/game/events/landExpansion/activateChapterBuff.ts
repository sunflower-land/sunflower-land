import { GameState } from "features/game/types/game";

import { produce } from "immer";
import { getCurrentChapter } from "features/game/types/chapters";

export type BuyChapterBuffAction = {
  type: "chapterBuff.activated";
};

type Options = {
  state: Readonly<GameState>;
  action: BuyChapterBuffAction;
  createdAt?: number;
};

const CHAPTER_BUFF_POWER = 10;

export function activateChapterBuff({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    const chapter = getCurrentChapter(createdAt);
    const count = copy.megastore?.buffs?.[chapter]?.count ?? 0;

    if (count <= 0) {
      throw new Error("No buffs remaining");
    }

    copy.megastore!.buffs![chapter]!.count = count - 1;
    copy.megastore!.buffs![chapter]!.power = CHAPTER_BUFF_POWER;

    return copy;
  });
}
