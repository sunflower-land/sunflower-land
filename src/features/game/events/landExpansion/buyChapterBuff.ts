import { GameState } from "features/game/types/game";

import { produce } from "immer";
import {
  ChapterName,
  getChapterArtefact,
  getChapterTicket,
  getCurrentChapter,
} from "features/game/types/chapters";
import cloneDeep from "lodash.clonedeep";

export type ChapterBuffCurrency = "sfl" | "ticket" | "artefact";

export const CHAPTER_BUFF_COST: Record<ChapterBuffCurrency, number> = {
  sfl: 100,
  ticket: 100,
  artefact: 100,
};

export type BuyChapterBuffAction = {
  type: "chapterBuff.bought";
  currency: ChapterBuffCurrency;
};

type Options = {
  state: Readonly<GameState>;
  action: BuyChapterBuffAction;
  createdAt?: number;
};

export function buyChapterBuff({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  return produce(state, (copy) => {
    if (!copy.megastore) {
      copy.megastore = { boughtAt: {} };
    }

    if (action.currency === "sfl") {
      if (copy.balance.lt(CHAPTER_BUFF_COST[action.currency])) {
        throw new Error("Insufficient SFL");
      }

      copy.balance = copy.balance.sub(CHAPTER_BUFF_COST[action.currency]);
    }

    if (action.currency === "ticket") {
      const ticket = getChapterTicket(createdAt);
      if (copy.inventory[ticket]?.lt(CHAPTER_BUFF_COST[action.currency])) {
        throw new Error("Insufficient Ticket");
      }

      copy.inventory[ticket] = copy.inventory[ticket]?.sub(
        CHAPTER_BUFF_COST[action.currency],
      );
    }

    if (action.currency === "artefact") {
      const artefact = getChapterArtefact(createdAt);
      if (copy.inventory[artefact]?.lt(CHAPTER_BUFF_COST[action.currency])) {
        throw new Error("Insufficient Artefact");
      }

      copy.inventory[artefact] = copy.inventory[artefact]?.sub(
        CHAPTER_BUFF_COST[action.currency],
      );
    }

    const chapter = getCurrentChapter(createdAt);

    // Add the buff
    copy = addChapterBuff({ game: copy, chapter });

    copy.megastore!.buffs![chapter]!.bought[action.currency] = createdAt;

    return copy;
  });
}

export function addChapterBuff({
  game,
  chapter,
}: {
  game: GameState;
  chapter: ChapterName;
}): GameState {
  let copy = cloneDeep(game);
  if (!copy.megastore) {
    copy.megastore = { boughtAt: {} };
  }

  const previous = copy.megastore.buffs?.[chapter] ?? {
    count: 0,
    bought: {},
    power: 0,
  };

  copy.megastore.buffs = {
    ...copy.megastore.buffs,
    [chapter]: {
      ...previous,
      count: previous.count + 1,
    },
  };

  return copy;
}
