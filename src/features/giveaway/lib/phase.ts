import type { GiveawayLeaderboardResponse } from "./types";

/**
 * The mini-game lifecycle, derived from the server giveaway status + the clock.
 * This is the reusable layer shared by every giveaway mini-game (race, chop,
 * jumper, trivia); only the Phaser scene differs per type.
 *
 * loading  - board not yet fetched
 * lobby    - joined, paused, waiting for the event to start (status upcoming)
 * racing   - event is live, the mini-game runs
 * ended    - time is up, awaiting admin finalisation
 * complete - finalised; prizes claimable
 */
export type GiveawayPhase =
  | "loading"
  | "lobby"
  | "racing"
  | "ended"
  | "complete";

export function getPhase(
  board: GiveawayLeaderboardResponse | undefined,
  now: number,
): GiveawayPhase {
  if (!board) return "loading";

  switch (board.status) {
    case "complete":
      return "complete";
    case "ended":
      return "ended";
    case "live":
      return "racing";
    case "upcoming":
      // Flip to racing as soon as the client clock passes startAt, so the race
      // feels responsive even before the next poll confirms `live`.
      return now >= board.startAt ? "racing" : "lobby";
    default:
      return "lobby";
  }
}
