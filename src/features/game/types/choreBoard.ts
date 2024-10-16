import { NPCName } from "lib/npcs";
import { GameState, InventoryItemName } from "./game";
import { getWeekKey } from "../lib/factions";
import { getKeys } from "./decorations";

type ChoreNPCName = Extract<
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

const CHORES = {
  CHOP_1_TREE: {
    requirement: 1,
    progress: (game: GameState) => game.bumpkin.activity["Tree Chopped"] ?? 0,
  },
} satisfies Record<string, ChoreTask>;

type ChoreName = keyof typeof CHORES;

type ChoreDetails = {
  name: ChoreName;
  reward: { items: Partial<Record<InventoryItemName, number>> };
};

type NpcChore = ChoreDetails & {
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
          initialProgress: CHORES[chores[name].name].progress(game),
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
