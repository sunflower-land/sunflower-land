import Decimal from "decimal.js-light";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { NPCData, GameState } from "features/game/types/game";

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

export const LOVE_RUSH_CHORES_REWARDS = {
  basic: {},
  medium: {},
  advanced: {},
  expert: {},
};

export const LOVE_RUSH_GIFTS_REWARDS = {
  basic: {},
  medium: {},
  advanced: {},
  expert: {},
};

export function getLoveRushStreaks({
  streaks,
  createdAt = Date.now(),
}: {
  streaks?: { streak: number; lastClaimedAt: number };
  createdAt?: number;
}) {
  const lastClaimedAt = new Date(streaks?.lastClaimedAt ?? 0);
  const currentDate = new Date(createdAt);
  const streakCount = streaks?.streak ?? 0;

  const dayDifference =
    (currentDate.getTime() - lastClaimedAt.getTime()) / (1000 * 60 * 60 * 24);

  if (dayDifference > 1) {
    return 1;
  }

  return streakCount + 1;
}

export function getLoveRushDeliveryRewards({
  newStreak,
  game,
  npcName,
}: {
  newStreak: number;
  game: GameState;
  npcName: NPCName;
}) {
  const streakIndex = (newStreak > 5 ? 5 : newStreak) as StreakNumber;
  const npcType = getLoveRushDeliveryNPCType(npcName);
  let loveCharmReward = npcType
    ? LOVE_RUSH_DELIVERIES_REWARDS[npcType][streakIndex]
    : 0;
  if (hasVipAccess({ game })) {
    loveCharmReward = loveCharmReward * 2;
  }
  return { loveCharmReward };
}

export function handleLoveRushDeliveryRewards({
  createdAt,
  npcName,
  npc,
  game,
}: {
  createdAt: number;
  npcName: NPCName;
  npc: NPCData;
  game: GameState;
}) {
  const newStreak = getLoveRushStreaks({
    streaks: npc.streaks,
    createdAt,
  });

  const { loveCharmReward } = getLoveRushDeliveryRewards({
    newStreak,
    game,
    npcName,
  });

  const loveCharmCount = game.inventory["Love Charm"] ?? new Decimal(0);

  game.inventory["Love Charm"] = loveCharmCount.add(loveCharmReward);

  npc.streaks = {
    streak: newStreak,
    lastClaimedAt: createdAt,
  };
}
