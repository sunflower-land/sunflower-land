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
      // "betty", Removed April 17th
      // "peggy", Removed April 17th
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
      // "blacksmith", Removed April 17th
      // "corale", Removed April 17th
      // "tango", Removed April 17th
      // "old salty", Removed April 17th
    ] as NPCName[]
  ).includes(npcName);

const isAdvancedLoveRushDeliveryNPC = (npcName: NPCName) =>
  (
    [
      "bert",
      "finley",
      "miranda",
      "finn",
      "gambit",
      // "victoria" Removed April 17th
    ] as NPCName[]
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
    2: 9,
    3: 12,
    4: 15,
    5: 18,
  },
  advanced: {
    1: 10,
    2: 13,
    3: 16,
    4: 19,
    5: 22,
  },
  expert: {
    1: 20,
    2: 24,
    3: 27,
    4: 30,
    5: 33,
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
  const lastClaimedAt = streaks?.lastClaimedAt ?? 0;

  // Get the date in YYYY-MM-DD format
  const lastClaimAtDate = new Date(lastClaimedAt).toISOString().split("T")[0];
  const currentDate = new Date(createdAt).toISOString().split("T")[0];

  // Calculate the difference in days between the last claim and the current date from 00:00:00 UTC
  const dayDifference =
    (new Date(currentDate).getTime() - new Date(lastClaimAtDate).getTime()) /
    (1000 * 60 * 60 * 24);

  // If the difference is greater than 1, reset the streak
  if (dayDifference > 1) {
    currentStreak = 0;
    newStreak = 1;
  }

  // If the last claim is the same as the current date, set the new streak to the current streak
  if (lastClaimAtDate === currentDate) {
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
  } else {
    loveCharmReward = Math.ceil(loveCharmReward * 0.5);
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
  if (BUMPKIN_FLOWER_BONUSES[name]?.[flower]) {
    loveCharmReward = 10;
  } else if (points >= 6) {
    loveCharmReward = 5;
  } else {
    loveCharmReward = 2;
  }

  return { loveCharmReward };
}
