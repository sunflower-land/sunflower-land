import Decimal from "decimal.js-light";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { GameState } from "features/game/types/game";
import { produce } from "immer";
import { NPCName } from "lib/npcs";

type LoveRushChoreNPCTypes = "basic" | "advanced" | "expert";

const isBasicLoveRushChoreNPC = (npcName: NPCName) =>
  (
    [
      "pumpkin' pete",
      "miranda",
      "peggy",
      "betty",
      "corale",
      "grimbly",
      "garth",
      "grimtooth",
    ] as NPCName[]
  ).includes(npcName);
const isAdvancedLoveRushChoreNPC = (npcName: NPCName) =>
  (
    [
      "timmy",
      "raven",
      "bert",
      "finn",
      "birdie",
      "old salty",
      "victoria",
      "gordo",
    ] as NPCName[]
  ).includes(npcName);
const isExpertLoveRushChoreNPC = (npcName: NPCName) =>
  (
    [
      "tywin",
      "cornwell",
      "finley",
      "blacksmith",
      "tango",
      "pharaoh",
      "petro",
      "guria",
      "chase",
      "eldric",
    ] as NPCName[]
  ).includes(npcName);

export const getLoveRushChoreNPCType = (
  npcName: NPCName,
): LoveRushChoreNPCTypes | null => {
  if (isBasicLoveRushChoreNPC(npcName)) {
    return "basic";
  }

  if (isAdvancedLoveRushChoreNPC(npcName)) {
    return "advanced";
  }

  if (isExpertLoveRushChoreNPC(npcName)) {
    return "expert";
  }

  return null;
};

export const LOVE_RUSH_CHORES_REWARDS: Record<LoveRushChoreNPCTypes, number> = {
  basic: 3,
  advanced: 5,
  expert: 7,
};

export function getLoveRushChoreReward({
  npcName,
  game,
  createdAt = Date.now(),
}: {
  npcName: NPCName;
  game: GameState;
  createdAt?: number;
}) {
  const npcType = getLoveRushChoreNPCType(npcName);
  let loveCharmReward = npcType ? LOVE_RUSH_CHORES_REWARDS[npcType] : 0;
  if (hasVipAccess({ game, now: createdAt })) {
    loveCharmReward = loveCharmReward * 2;
  }
  return { loveCharmReward };
}

export function handleLoveRushChoreRewards({
  game,
  npcName,
  createdAt,
}: {
  game: GameState;
  npcName: NPCName;
  createdAt?: number;
}): GameState {
  return produce(game, (copy) => {
    const { loveCharmReward } = getLoveRushChoreReward({
      npcName,
      game: copy,
      createdAt,
    });
    copy.inventory["Love Charm"] = (
      copy.inventory["Love Charm"] ?? new Decimal(0)
    ).add(loveCharmReward);

    // Add 100 love charms for completing 21 chores
    const hasCompleted21Chores =
      Object.values(copy.choreBoard.chores).filter((chore) => chore.completedAt)
        .length === 21;
    if (hasCompleted21Chores) {
      copy.inventory["Love Charm"] = copy.inventory["Love Charm"].add(100);
    }

    return copy;
  });
}
