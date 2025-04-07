import { hasVipAccess } from "features/game/lib/vipAccess";
import { GameState } from "features/game/types/game";
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
