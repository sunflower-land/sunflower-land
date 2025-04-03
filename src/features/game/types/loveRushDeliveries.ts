import { hasVipAccess } from "features/game/lib/vipAccess";
import { GameState } from "features/game/types/game";

import { NPCName } from "lib/npcs";

type LoveRushDeliveryNPCTypes = "basic" | "medium" | "advanced" | "expert";

export const getLoveRushDeliveryNPCType = (
  npcName: NPCName,
): LoveRushDeliveryNPCTypes | null => {
  if (isBasicLoveRushDeliveryNPC(npcName)) {
    return "basic";
  }

  if (isMediumLoveRushDeliveryNPC(npcName)) {
    return "medium";
  }

  if (isAdvancedLoveRushDeliveryNPC(npcName)) {
    return "advanced";
  }

  if (isExpertLoveRushDeliveryNPC(npcName)) {
    return "expert";
  }

  return null;
};

const isBasicLoveRushDeliveryNPC = (npcName: NPCName) =>
  (
    [
      "betty",
      "peggy",
      "pumpkin' pete",
      "grimbly",
      "grubnuk",
      "grimtooth",
    ] as NPCName[]
  ).includes(npcName);

const isMediumLoveRushDeliveryNPC = (npcName: NPCName) =>
  (
    [
      "gordo",
      "guria",
      "blacksmith",
      "corale",
      "tango",
      "old salty",
    ] as NPCName[]
  ).includes(npcName);

const isAdvancedLoveRushDeliveryNPC = (npcName: NPCName) =>
  (
    ["bert", "finley", "miranda", "finn", "gambit", "victoria"] as NPCName[]
  ).includes(npcName);

const isExpertLoveRushDeliveryNPC = (npcName: NPCName) =>
  (
    ["tywin", "cornwell", "timmy", "raven", "pharaoh", "jester"] as NPCName[]
  ).includes(npcName);

export type StreakNumber = 1 | 2 | 3 | 4 | 5;

export const LOVE_RUSH_DELIVERIES_REWARDS: Record<
  LoveRushDeliveryNPCTypes,
  Record<StreakNumber, number>
> = {
  basic: {
    1: 3,
    2: 6,
    3: 9,
    4: 12,
    5: 15,
  },
  medium: {
    1: 6,
    2: 10,
    3: 13,
    4: 15,
    5: 20,
  },
  advanced: {
    1: 10,
    2: 16,
    3: 22,
    4: 28,
    5: 35,
  },
  expert: {
    1: 25,
    2: 32,
    3: 39,
    4: 45,
    5: 50,
  },
};

export function getLoveRushStreaks({
  streaks,
  createdAt = Date.now(),
}: {
  streaks?: { streak: number; lastClaimedAt: number };
  createdAt?: number;
}): { currentStreak: number; newStreak: number } {
  let currentStreak: number = streaks?.streak ?? 0;
  let newStreak: number = currentStreak + 1;
  const lastClaimedAt = new Date(streaks?.lastClaimedAt ?? 0);
  const currentDate = new Date(createdAt);

  const dayDifference =
    (currentDate.getTime() - lastClaimedAt.getTime()) / (1000 * 60 * 60 * 24);

  if (dayDifference > 1) {
    currentStreak = 0;
    newStreak = 1;
  }

  const lastClaimAtDate = lastClaimedAt.toISOString().split("T")[0];
  const currentDateString = currentDate.toISOString().split("T")[0];

  if (lastClaimAtDate === currentDateString) {
    newStreak = currentStreak;
  }

  return { currentStreak, newStreak };
}

export function getLoveRushDeliveryRewards({
  currentStreak,
  newStreak,
  game,
  npcName,
}: {
  currentStreak: number;
  newStreak: number;
  game: GameState;
  npcName: NPCName;
}) {
  let loveCharmReward: number;
  if (currentStreak === newStreak) {
    loveCharmReward = 0;
  } else {
    const streakIndex = (newStreak > 5 ? 5 : newStreak) as StreakNumber;
    const npcType = getLoveRushDeliveryNPCType(npcName);
    loveCharmReward = npcType
      ? LOVE_RUSH_DELIVERIES_REWARDS[npcType][streakIndex]
      : 0;
  }

  if (hasVipAccess({ game })) {
    loveCharmReward = loveCharmReward * 2;
  }
  return { loveCharmReward };
}

export const LOVE_RUSH_GIFTS_REWARD = 5;
