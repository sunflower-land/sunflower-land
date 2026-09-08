import { CONFIG } from "lib/config";
import { fetchWithRetry } from "lib/fetchWithRetry";
import { ERRORS } from "lib/errors";
import type { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { NPC_WEARABLES } from "lib/npcs";

/** The six daily stat boards the API publishes. Order is the display order. */
export const STATS_LEADERBOARD_NAMES = [
  "coins",
  "experience",
  "cropsHarvested",
  "fishCaught",
  "animalsFed",
  "deliveries",
] as const;

export type StatsLeaderboardName = (typeof STATS_LEADERBOARD_NAMES)[number];

export type StatsLeaderboardPlayer = {
  /** 1 to 100. The array is already in rank order. */
  rank: number;
  farmId: number;
  /** Falls back to the farm id as a string when the player has no username. */
  username: string;
  /** Equipped wearables. Absent for a farm deleted since the walk. */
  bumpkin?: BumpkinParts;
  /** Within-ascension level. Meaningless without `ascension`. */
  level: number;
  /** Ascension band this level belongs to (0 = pre-ascension). */
  ascension: number;
  /** The number this board ranks on — see the board's `description`. */
  count: number;
};

export type StatsLeaderboardBoard = {
  name: StatsLeaderboardName;
  title: string;
  description: string;
  /** Top 100, may be empty. */
  players: StatsLeaderboardPlayer[];
};

export type StatsLeaderboards = {
  /** The UTC day these boards describe. */
  reportDate: string;
  lastUpdated: number;
  /** Start of the 30 day activity window. */
  activeSince: number;
  /** Active players that were ranked. */
  scanned: number;
  boards: Record<StatsLeaderboardName, StatsLeaderboardBoard>;
};

/** `YYYY-MM-DD` for a UTC timestamp. */
export function toUTCDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * The latest day the API will serve: boards are built by the daily farm walk,
 * so today is always refused and yesterday is the newest complete day.
 */
export function getLatestStatsLeaderboardDate(now = Date.now()): string {
  return toUTCDateString(new Date(now - 24 * 60 * 60 * 1000));
}

/** Shift a `YYYY-MM-DD` UTC day by `days` (negative goes back in time). */
export function shiftUTCDateString(date: string, days: number): string {
  return toUTCDateString(
    new Date(
      new Date(`${date}T00:00:00Z`).getTime() + days * 24 * 60 * 60 * 1000,
    ),
  );
}

/**
 * Daily top-100 stat boards over players active in the last 30 days.
 *
 * `GET /data?type=statsLeaderboard[&date=YYYY-MM-DD]` — omitting `board`
 * returns all six in one response, which is what we want: nothing changes
 * until `reportDate` rolls over at 00:00 UTC, so one request per day is enough.
 *
 * Resolves to `null` when nothing is published for that day (the API returns
 * `{ data: null }`), which is an empty state rather than an error.
 */
export async function getStatsLeaderboards({
  token,
  date,
}: {
  token: string;
  /** UTC day, must be strictly before today. Defaults to yesterday. */
  date?: string;
}): Promise<StatsLeaderboards | null> {
  // Offline / UI mode: no backend — serve a local fixture.
  if (!CONFIG.API_URL) {
    return mockStatsLeaderboards(date ?? getLatestStatsLeaderboardDate());
  }

  const url = new URL(`${CONFIG.API_URL}/data`);
  url.searchParams.set("type", "statsLeaderboard");
  if (date) url.searchParams.set("date", date);

  const response = await fetchWithRetry(url, {
    method: "GET",
    headers: {
      "content-type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 429) {
    throw new Error(ERRORS.TOO_MANY_REQUESTS);
  }

  if (!response.ok) {
    throw new Error(ERRORS.FAILED_REQUEST);
  }

  const { data } = await response.json();

  return (data as StatsLeaderboards | null) ?? null;
}

const MOCK_NPCS = [
  "pumpkin' pete",
  "bailey",
  "grubnuk",
  "cornwell",
  "raven",
  "gordo",
  "craig",
  "birdie",
  "grimtooth",
  "hank",
] as const;

const MOCK_BOARDS: Record<
  StatsLeaderboardName,
  { title: string; description: string; top: number }
> = {
  coins: {
    title: "Most Coins",
    description: "Coins currently held",
    top: 4_500_000,
  },
  experience: {
    title: "Most XP",
    description: "Total Bumpkin experience",
    top: 12_000_000,
  },
  cropsHarvested: {
    title: "Crops Harvested",
    description: "Crops and greenhouse crops harvested, all time",
    top: 980_000,
  },
  fishCaught: {
    title: "Fish Caught",
    description: "Fish and marine marvels caught, all time",
    top: 42_000,
  },
  animalsFed: {
    title: "Animals Fed",
    description: "Chickens, cows and sheep fed, all time",
    top: 210_000,
  },
  deliveries: {
    title: "Deliveries",
    description: "Ticket, coin and FLOWER orders delivered, all time",
    top: 18_400,
  },
};

/** Fixture board so the UI can be worked on without a backend. */
function mockStatsLeaderboards(reportDate: string): StatsLeaderboards {
  const boards = STATS_LEADERBOARD_NAMES.reduce(
    (acc, name) => {
      const { title, description, top } = MOCK_BOARDS[name];

      return {
        ...acc,
        [name]: {
          name,
          title,
          description,
          players: MOCK_NPCS.map((npc, index) => ({
            rank: index + 1,
            farmId: 100 + index,
            username: npc,
            bumpkin: NPC_WEARABLES[npc],
            level: 50 - index * 3,
            ascension: index < 3 ? 2 : index < 6 ? 1 : 0,
            count: Math.floor(top * (1 - index * 0.08)),
          })),
        },
      };
    },
    {} as Record<StatsLeaderboardName, StatsLeaderboardBoard>,
  );

  return {
    reportDate,
    lastUpdated: Date.now() - 3 * 60 * 60 * 1000,
    activeSince: Date.now() - 30 * 24 * 60 * 60 * 1000,
    scanned: 183204,
    boards,
  };
}
