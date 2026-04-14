import { getDayOfYear } from "lib/utils/time";
import { getKeys } from "lib/object";
import { GameState } from "../types/game";
import { getBumpkinLevel } from "./level";
import { hasVipAccess } from "./vipAccess";
import { isFaceVerified } from "features/retreat/components/personhood/lib/faceRecognition";

export enum Reputation {
  Beginner = 0,
  Seedling = 2,
  Grower = 3,
  Cropkeeper = 4,
  GrandHarvester = 5,
}

export const REPUTATION_NAME: Record<Reputation, string> = {
  [Reputation.Beginner]: "Beginner",
  [Reputation.Seedling]: "Seedling",
  [Reputation.Grower]: "Grower",
  [Reputation.Cropkeeper]: "Cropkeeper",
  [Reputation.GrandHarvester]: "Grand Harvester",
};

export const REPUTATION_TIERS: Record<Reputation, number> = {
  [Reputation.Beginner]: 0,
  [Reputation.Seedling]: 250,
  [Reputation.Grower]: 350,
  [Reputation.Cropkeeper]: 600,
  [Reputation.GrandHarvester]: 1100,
};

export const REPUTATION_POINTS = {
  SpringIsland: 100,
  Level15: 50,
  DesertIsland: 50,
  VolcanoIsland: 50,
  Discord: 50,
  ProofOfHumanity: 100,
  Level100: 150,
  Bud: 300,
  VIP: 600,
};

export const REPUTATION_TASKS: Record<
  keyof typeof REPUTATION_POINTS,
  ({ game, now }: { game: GameState; now: number }) => boolean
> = {
  SpringIsland: ({ game }) => game.island.type !== "basic",
  DesertIsland: ({ game }) =>
    game.island.type !== "basic" && game.island.type !== "spring",
  VolcanoIsland: ({ game }) =>
    game.island.type !== "basic" &&
    game.island.type !== "spring" &&
    game.island.type !== "desert",
  Discord: ({ game }) => !!game.discord?.verified,
  ProofOfHumanity: ({ game }) => isFaceVerified({ game }) || !!game.verified,
  Level100: ({ game }) => getBumpkinLevel(game.bumpkin.experience) >= 100,
  Level15: ({ game }) => getBumpkinLevel(game.bumpkin.experience) >= 15,
  Bud: ({ game }) => getKeys(game.buds ?? {}).length > 0,
  VIP: ({ game, now }) => hasVipAccess({ game: game, type: "full", now }),
};

export function getReputationPoints({
  game,
  now,
}: {
  game: GameState;
  now: number;
}): number {
  let points = 0;

  for (const [key, task] of Object.entries(REPUTATION_TASKS)) {
    if (task({ game, now })) {
      points += REPUTATION_POINTS[key as keyof typeof REPUTATION_POINTS];
    }
  }

  return points;
}

export function getReputation({
  game,
  now,
}: {
  game: GameState;
  now: number;
}): Reputation {
  const points = getReputationPoints({ game, now });

  // Get the highest tier that the player has reached
  const tier = getKeys(REPUTATION_TIERS)
    .reverse()
    .find(
      (tier) => points >= REPUTATION_TIERS[tier as Reputation],
    ) as Reputation;

  return tier || Reputation.Beginner;
}

export function hasReputation({
  game,
  reputation,
  now,
}: {
  game: GameState;
  reputation: Reputation;
  now: number;
}) {
  const playerReputation = getReputation({ game, now });
  return playerReputation >= reputation;
}

export function getRemainingTrades({
  game,
  now,
}: {
  game: GameState;
  now: number;
}) {
  const today = getDayOfYear(new Date(now));
  const dailyListings = game.trades.dailyListings ?? {
    date: 0,
    count: 0,
  };

  const count = dailyListings.date === today ? dailyListings.count : 0;

  const playerReputation = getReputation({ game, now });

  if (playerReputation == Reputation.Beginner) {
    return 0;
  }

  // 2 trades per day
  if (playerReputation == Reputation.Seedling) {
    return 2 - count;
  }

  // 3 Trades per day
  if (playerReputation == Reputation.Grower) {
    return 3 - count;
  }

  return Infinity;
}
