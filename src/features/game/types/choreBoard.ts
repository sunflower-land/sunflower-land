import { NPCName } from "lib/npcs";
import { GameState, InventoryItemName } from "./game";
import { getWeekKey } from "../lib/factions";
import { getKeys } from "./decorations";
import { ITEM_DETAILS } from "./images";

export type ChoreNPCName = Extract<
  NPCName,
  | "pumpkin' pete"
  | "bert"
  | "raven"
  | "timmy"
  | "tywin"
  | "cornwell"
  | "finn"
  | "finley"
  | "miranda"
  | "jester"
  | "pharaoh"
  | "betty"
  | "peggy"
  | "tango"
  | "corale"
  | "blacksmith"
  | "victoria"
  | "old salty"
  | "grimbly"
  | "grimtooth"
  | "grubnuk"
  | "gambit"
>;

type ChoreTask = {
  requirement: number;
  progress: (game: GameState) => number;
};

export const NPC_CHORES = {
  CHOP_1_TREE: {
    requirement: 1,
    progress: (game: GameState) => game.bumpkin.activity["Tree Chopped"] ?? 0,
  },
  CHOP_2_TREE: {
    requirement: 2,
    progress: (game: GameState) => game.bumpkin.activity["Tree Chopped"] ?? 0,
  },
} satisfies Record<string, ChoreTask>;

export const CHORE_DETAILS: Record<
  ChoreName,
  { icon: string; description: string }
> = {
  CHOP_1_TREE: {
    description: "Chop 1 Tree",
    icon: ITEM_DETAILS.Axe.image,
  },
  CHOP_2_TREE: {
    description: "Chop 2 Trees",
    icon: ITEM_DETAILS.Axe.image,
  },
};

type ChoreName = keyof typeof NPC_CHORES;

type ChoreDetails = {
  name: ChoreName;
  reward: { items: Partial<Record<InventoryItemName, number>> };
};

export type NpcChore = ChoreDetails & {
  initialProgress: number;
  startedAt: number;
  completedAt?: number;
};

export type ChoreBoard = {
  chores: Partial<Record<NPCName, NpcChore>>;
};

const WEEKLY_CHORES: Record<string, Record<ChoreNPCName, ChoreDetails>> = {
  "2024-10-14": {
    "pumpkin' pete": { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    bert: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    raven: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    timmy: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    tywin: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    cornwell: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    finn: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    finley: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    miranda: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    jester: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    pharaoh: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    betty: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    peggy: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    tango: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    corale: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    blacksmith: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    victoria: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    "old salty": { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    grimbly: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    grimtooth: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    grubnuk: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
    gambit: { name: "CHOP_1_TREE", reward: { items: { Wood: 1 } } },
  },
};

function makeChoreBoard({
  now = Date.now(),
  game,
}: {
  now?: number;
  game: GameState;
}): ChoreBoard {
  const weekKey = getWeekKey({ date: new Date(now) });

  const chores = WEEKLY_CHORES[weekKey];

  const progress = getKeys(chores).reduce(
    (acc, name) => {
      let existing = game.choreBoard.chores[name];

      // No progress exists or progress is from a previous week
      if (
        !existing ||
        getWeekKey({ date: new Date(existing.startedAt) }) !== weekKey
      ) {
        existing = {
          ...chores[name],
          initialProgress: NPC_CHORES[chores[name].name].progress(game),
          startedAt: now,
        };
      }

      return {
        ...acc,
        [name]: existing,
      };
    },
    {} as Record<ChoreNPCName, NpcChore>,
  );

  return {
    chores: progress,
  };
}

export function getChoreProgress({
  chore,
  game,
}: {
  chore: NpcChore;
  game: GameState;
}) {
  const progress = NPC_CHORES[chore.name].progress(game);

  return progress - chore.initialProgress;
}

export const NPC_CHORE_UNLOCKS: Record<ChoreNPCName, number> = {
  "pumpkin' pete": 1,
  betty: 1,
  blacksmith: 1,
  peggy: 3,
  corale: 7,
  tango: 13,
  "old salty": 15,
  victoria: 30,
  grimbly: 10,
  grimtooth: 10,
  gambit: 10,
  jester: 10,
  pharaoh: 10,
  timmy: 10,
  tywin: 10,
  cornwell: 10,
  finn: 10,
  finley: 10,
  miranda: 10,
  raven: 10,
  grubnuk: 10,
  bert: 10,
};
