import type {
  GiveawaysResponse,
  GiveawayLeaderboardResponse,
  PrizeTier,
} from "./types";
import { TRIVIA_GAME_MS } from "./trivia";
import { POP_GAME_MS } from "./pop";

/**
 * Offline/UI mode fixtures. When `CONFIG.API_URL` is unset there's no backend to
 * create or serve giveaways, so the read actions return these instead — letting
 * you open the giveaway board, join, and watch a race run locally with just
 * yourself. See `getGiveaways` / `getGiveawayLeaderboard`.
 */

/** Short lobby so you see the countdown, then the race auto-starts. */
const LOBBY_MS = 2000;
const DURATION_MS = 5 * 60 * 1000;
/** Lobby + the longest game on offer; after this a cycle is considered
 * finished and the board re-anchors for a fresh countdown. */
const RACE_WINDOW_MS =
  LOBBY_MS + Math.max(30000, TRIVIA_GAME_MS, POP_GAME_MS) + 5000;

export const MOCK_GIVEAWAY_ID = "local-race";
export const MOCK_PAST_GIVEAWAY_ID = "local-race-past";

/**
 * The active mock giveaway's id. Minigames seed themselves off the giveaway id
 * (trivia questions, pop bots, race bots), so a fixed id meant every offline
 * playthrough replayed the identical game. Stamping the anchored start time
 * into the id gives each race cycle a fresh seed while staying stable across
 * polls within one cycle — which is what determinism actually requires.
 */
export const mockGiveawayId = () => `${MOCK_GIVEAWAY_ID}-${startAt()}`;

// Start time is anchored in module scope so it's STABLE across polls (otherwise
// every re-fetch would push the start forward and it'd never begin). It re-
// anchors once a full race cycle has elapsed, so returning to the board always
// gives a fresh countdown instead of a race that's already over.
// `Date.now()` is fine here (browser-only, not a workflow script).
let anchoredStartAt: number | undefined;
const startAt = () => {
  const now = Date.now();
  if (anchoredStartAt === undefined || now > anchoredStartAt + RACE_WINDOW_MS) {
    anchoredStartAt = now + LOBBY_MS;
  }
  return anchoredStartAt;
};

const PRIZES: PrizeTier[] = [
  { from: 1, to: 1, coins: 1000 },
  { from: 2, to: 3, coins: 250 },
  { from: 4, to: 10, coins: 100 },
];

export function mockGiveaways(): GiveawaysResponse {
  const s = startAt();
  return {
    active: [
      {
        id: mockGiveawayId(),
        title: "Local Test Race",
        description: "Offline mock giveaway — just you on the track.",
        status: Date.now() >= s ? "live" : "upcoming",
        startAt: s,
        endAt: s + DURATION_MS,
        prizes: PRIZES,
      },
    ],
    recent: [
      {
        id: MOCK_PAST_GIVEAWAY_ID,
        title: "Last Week's Race",
        status: "complete",
        startAt: s - DURATION_MS,
        endAt: s - 1000,
        endedAt: s - 1000,
        prizes: PRIZES,
      },
    ],
  };
}

export function mockGiveawayLeaderboard(
  id: string,
): GiveawayLeaderboardResponse {
  const s = startAt();
  const isPast = id === MOCK_PAST_GIVEAWAY_ID;

  return {
    id,
    title: isPast ? "Last Week's Race" : "Local Test Race",
    status: isPast ? "complete" : Date.now() >= s ? "live" : "upcoming",
    startAt: isPast ? s - DURATION_MS : s,
    endAt: isPast ? s - 1000 : s + DURATION_MS,
    prizes: PRIZES,
    // The race scene always adds the local player, so an empty participant list
    // means "just me". A finished mock giveaway shows a sample winner board.
    leaderboard: isPast
      ? [
          { farmId: 1, score: 987, position: 1, username: "Bumpkin1" },
          { farmId: 2, score: 812, position: 2, username: "Bumpkin2" },
        ]
      : [],
    participants: [],
    totalParticipants: isPast ? 2 : 1,
  };
}
