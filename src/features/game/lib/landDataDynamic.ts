import { Bumpkin, GameState } from "../types/game";
import { LEVEL_EXPERIENCE } from "./level";
import { BumpkinLevel } from "features/game/lib/level";
import { INITIAL_BUMPKIN_LEVEL, INITIAL_EXPANSIONS } from "./bumpkinData";
import { getEnabledNodeCount } from "../expansion/lib/expansionNodes";
import { INITIAL_RESOURCES } from "./landDataStatic";
import { INITIAL_BUMPKIN } from "./bumpkinData";
import { STATIC_OFFLINE_FARM } from "./landDataStatic";

function getInitialNodes(name: string) {
  let count = getEnabledNodeCount(INITIAL_BUMPKIN_LEVEL as BumpkinLevel, name);
  let x = -1;
  let y = 9;

  if (INITIAL_EXPANSIONS < 4) {
    count = name === "Stone Rock" ? 2 : 0;
    x = 3;
    y = 7;
  }
  if (INITIAL_EXPANSIONS >= 9) {
    x = -7;
  }

  if (count === 0) return {};

  if (name === "Iron Rock") x += 1;
  if (name === "Gold Rock") x += 2;

  return [...Array(count).keys()].reduce(
    (acc, _, i) => ({
      ...acc,
      [i + 1]: {
        stone: { amount: 1, minedAt: 0 },
        x: x,
        y: y - i,
        height: 1,
        width: 1,
      },
    }),
    {}
  );
}

const DYNAMIC_INITIAL_RESOURCES: Pick<
  GameState,
  "crops" | "trees" | "stones" | "iron" | "gold" | "fruitPatches"
> = {
  ...INITIAL_RESOURCES,
  stones: getInitialNodes("Stone Rock"),
  iron: getInitialNodes("Iron Rock"),
  gold: getInitialNodes("Gold Rock"),
};

const DYNAMIC_INITIAL_BUMPKIN: Bumpkin = {
  ...INITIAL_BUMPKIN,
  experience: LEVEL_EXPERIENCE[INITIAL_BUMPKIN_LEVEL as BumpkinLevel],
};

export const DYNAMIC_OFFLINE_FARM: GameState = {
  ...STATIC_OFFLINE_FARM,
  ...DYNAMIC_INITIAL_RESOURCES,
  bumpkin: DYNAMIC_INITIAL_BUMPKIN,
};
