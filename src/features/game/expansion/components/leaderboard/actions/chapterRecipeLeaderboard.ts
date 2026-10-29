import { CONFIG } from "lib/config";
import { fetchWithRetry } from "lib/fetchWithRetry";
import { ERRORS } from "lib/errors";
import { NPC_WEARABLES } from "lib/npcs";
import type { CookableName } from "features/game/types/consumables";
import { CHAPTER_CROP_WEEK_RECIPE } from "features/game/types/chapterCropWeek";
import type { StatsLeaderboardPlayer } from "./statsLeaderboard";

/** One row of the board. Same shape as the Hall of Fame stats boards. */
export type ChapterRecipeLeaderboardPlayer = StatsLeaderboardPlayer;

export type ChapterRecipeLeaderboard = {
  recipe: CookableName;
  /** When the served (profile-joined) shape was built. */
  lastUpdated: number;
  /** When the hourly farm walk that produced the ranking ran. */
  dumpUpdatedAt: number;
  /** Active farms the walk considered. */
  scanned: number;
  /** Top 100 by event-recipe cooks, already in rank order. May be empty. */
  players: ChapterRecipeLeaderboardPlayer[];
};

/**
 * Chapter Crop Week cooking leaderboard: the top 100 players by how many times
 * they cooked the event recipe (Crystal Cookie for the October 2026 run).
 *
 * `GET /data?type=chapterRecipeLeaderboard`. The ranking is rebuilt by the
 * API's hourly farm walk and the served shape is cached for 5 minutes, so one
 * request per modal open is plenty. There is no "your rank" lookup: a player
 * finds themselves in the list by farm id.
 *
 * Resolves to `null` while the walk has not published a board yet (the API
 * returns `{ data: null }`), which is an empty state rather than an error.
 */
export async function getChapterRecipeLeaderboard({
  token,
}: {
  token: string;
}): Promise<ChapterRecipeLeaderboard | null> {
  // Offline / UI mode: no backend — serve a local fixture.
  if (!CONFIG.API_URL) {
    return mockChapterRecipeLeaderboard();
  }

  const url = new URL(`${CONFIG.API_URL}/data`);
  url.searchParams.set("type", "chapterRecipeLeaderboard");

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

  return (data as ChapterRecipeLeaderboard | null) ?? null;
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

/** Fixture board so the UI can be worked on without a backend. */
function mockChapterRecipeLeaderboard(): ChapterRecipeLeaderboard {
  const players = Array.from({ length: 100 }, (_, index) => {
    const npc = MOCK_NPCS[index % MOCK_NPCS.length];

    return {
      rank: index + 1,
      farmId: 100 + index,
      username: index < MOCK_NPCS.length ? npc : `${npc} ${index + 1}`,
      bumpkin: NPC_WEARABLES[npc],
      level: Math.max(1, 60 - index),
      ascension: index < 10 ? 2 : index < 40 ? 1 : 0,
      count: Math.max(1, Math.floor(420 * (1 - index * 0.0095))),
    };
  });

  return {
    recipe: CHAPTER_CROP_WEEK_RECIPE,
    lastUpdated: Date.now() - 4 * 60 * 1000,
    dumpUpdatedAt: Date.now() - 40 * 60 * 1000,
    scanned: 183204,
    players,
  };
}
