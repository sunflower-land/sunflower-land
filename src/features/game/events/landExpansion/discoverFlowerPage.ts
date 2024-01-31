import { GameState } from "features/game/types/game";
import { SEASONS } from "features/game/types/seasons";
import { getSeasonWeekByCreatedAt } from "lib/utils/getSeasonWeek";
import cloneDeep from "lodash.clonedeep";

export type FlowerPageDiscoveredAction = {
  id: number;
  type: "flowerPage.discovered";
};

type Options = {
  state: Readonly<GameState>;
  action: FlowerPageDiscoveredAction;
  createdAt?: number;
};

export const FLOWER_PAGES_COUNT = 3;

export function discoverFlowerPage({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const game: GameState = cloneDeep(state);

  if (createdAt < SEASONS["Spring Blossom"].startDate.getTime()) {
    throw new Error("Spring Blossom season has not started");
  }

  if (createdAt > SEASONS["Spring Blossom"].endDate.getTime()) {
    throw new Error("Spring Blossom season has ended");
  }

  if (action.id > FLOWER_PAGES_COUNT || action.id <= 0) {
    throw new Error("Page does not exist");
  }

  const week = getSeasonWeekByCreatedAt(createdAt);

  const springBlossom = game.springBlossom[week];

  if (!springBlossom.collectedFlowerPages.includes(action.id)) {
    springBlossom.collectedFlowerPages =
      springBlossom.collectedFlowerPages.concat(action.id);
  }

  return game;
}
