import { hasVipAccess } from "features/game/lib/vipAccess";
import { GameState } from "features/game/types/game";

import { NPCName } from "lib/npcs";
import { FlowerName } from "./flowers";
import { BUMPKIN_FLOWER_BONUSES } from "./gifts";

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
  const currentStreak = streaks?.streak ?? 0;
  const lastClaimedAt = new Date(streaks?.lastClaimedAt ?? 0);
  const currentDate = new Date(createdAt);

  // Convert to UTC dates at midnight
  const lastClaimedDay = Date.UTC(
    lastClaimedAt.getUTCFullYear(),
    lastClaimedAt.getUTCMonth(),
    lastClaimedAt.getUTCDate(),
  );
  const currentDay = Date.UTC(
    currentDate.getUTCFullYear(),
    currentDate.getUTCMonth(),
    currentDate.getUTCDate(),
  );
  const previousDay = currentDay - 24 * 60 * 60 * 1000;

  // Check if same day or consecutive days
  if (lastClaimedDay === currentDay) {
    return { currentStreak, newStreak: currentStreak };
  }

  if (lastClaimedDay === previousDay) {
    return { currentStreak, newStreak: currentStreak + 1 };
  }

  // Reset streak if not consecutive
  return { currentStreak: 0, newStreak: 1 };
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

export function getLoveCharmReward({
  name,
  flower,
  points,
}: {
  name: NPCName;
  flower: FlowerName;
  points: number;
}): { loveCharmReward: number } {
  let loveCharmReward: number;
  if (points >= 6 || !!BUMPKIN_FLOWER_BONUSES[name]?.[flower]) {
    loveCharmReward = 10;
  } else if (points >= 3) {
    loveCharmReward = 5;
  } else {
    loveCharmReward = 2;
  }

  return { loveCharmReward };
}
