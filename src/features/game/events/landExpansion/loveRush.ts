import Decimal from "decimal.js-light";
import { hasVipAccess } from "features/game/lib/vipAccess";
import { NPCData, GameState } from "features/game/types/game";
import {
  CoinNPCName,
  GoblinNPCName,
} from "features/island/delivery/lib/delivery";
import { QuestNPCName } from "./deliver";

type LoveRushNPCTypes = "basic" | "medium" | "advanced" | "expert";

export const getLoveRushNPCType = (
  npcName: DeliveryNPCName,
): LoveRushNPCTypes | null => {
  if (isBasicLoveRushNPC(npcName)) {
    return "basic";
  }

  if (isMediumLoveRushNPC(npcName)) {
    return "medium";
  }

  if (isAdvancedLoveRushNPC(npcName)) {
    return "advanced";
  }

  if (isExpertLoveRushNPC(npcName)) {
    return "expert";
  }

  return null;
};

const isBasicLoveRushNPC = (npcName: DeliveryNPCName) =>
  npcName === "betty" ||
  npcName === "blacksmith" ||
  npcName === "peggy" ||
  npcName === "pumpkin' pete";

const isMediumLoveRushNPC = (npcName: DeliveryNPCName) =>
  npcName === "bert" ||
  npcName === "finley" ||
  npcName === "miranda" ||
  npcName === "finn" ||
  npcName === "corale" ||
  npcName === "tango" ||
  npcName === "old salty";

const isAdvancedLoveRushNPC = (npcName: DeliveryNPCName) =>
  npcName === "tywin" ||
  npcName === "cornwell" ||
  npcName === "timmy" ||
  npcName === "raven" ||
  npcName === "pharaoh" ||
  npcName === "jester" ||
  npcName === "victoria";

const isExpertLoveRushNPC = (npcName: DeliveryNPCName) =>
  npcName === "grimbly" ||
  npcName === "grimtooth" ||
  npcName === "grubnuk" ||
  npcName === "gordo" ||
  npcName === "guria" ||
  npcName === "gambit";

export type StreakNumber = 1 | 2 | 3 | 4 | 5;

export const LOVE_RUSH_DELIVERIES_REWARDS: Record<
  LoveRushNPCTypes,
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
    1: 10,
    2: 14,
    3: 18,
    4: 22,
    5: 25,
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
  createdAt,
}: {
  streaks?: { streak: number; lastClaimedAt: number };
  createdAt: number;
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
export type DeliveryNPCName = QuestNPCName | GoblinNPCName | CoinNPCName;
export function handleLoveRushRewards({
  createdAt,
  npcName,
  npc,
  game,
}: {
  createdAt: number;
  npcName: DeliveryNPCName;
  npc: NPCData;
  game: GameState;
}) {
  const newStreak = getLoveRushStreaks({
    streaks: npc.streaks,
    createdAt,
  });
  const streakIndex = (newStreak > 5 ? 5 : newStreak) as StreakNumber;

  const npcType = getLoveRushNPCType(npcName);
  let loveCharmReward = npcType
    ? LOVE_RUSH_DELIVERIES_REWARDS[npcType][streakIndex]
    : 0;
  const loveCharmCount = game.inventory["Love Charm"] ?? new Decimal(0);

  if (hasVipAccess({ game, now: createdAt })) {
    loveCharmReward = loveCharmReward * 2;
  }

  game.inventory["Love Charm"] = loveCharmCount.add(loveCharmReward);

  npc.streaks = {
    streak: newStreak,
    lastClaimedAt: createdAt,
  };
}
