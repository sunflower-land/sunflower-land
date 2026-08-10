/**
 * A tiny shared clock so every player runs the mini-game on the SAME timeline,
 * regardless of local clock skew.
 *
 * The party-games Colyseus room publishes `state.serverTime` (authoritative
 * epoch ms). On join we sample it once to work out this device's offset from the
 * server, then `serverNow()` returns server-corrected time. Since the giveaway's
 * `startAt` is also server epoch ms, `serverNow() - startAt` is identical on
 * every client — so the countdown and the game start line up for everyone.
 *
 * It's a module singleton (one giveaway runs at a time) shared by the React
 * provider and the Phaser scenes without prop-drilling.
 */
let offset = 0;
let synced = false;

/** Set the offset once, from the room's serverTime (ignored if `serverTime` is 0). */
export function syncServerClock(serverTime: number) {
  if (synced || !serverTime) return;
  offset = serverTime - Date.now();
  synced = true;
}

/** Reset so the next game re-syncs (call on unmount). */
export function resetServerClock() {
  offset = 0;
  synced = false;
}

/** Server-corrected "now" in epoch ms. Equals Date.now() until synced. */
export function serverNow(): number {
  return Date.now() + offset;
}

/**
 * The current correction (server epoch − local epoch), in ms. Lets React code
 * that already has a local `Date.now()` tick apply the same correction the
 * scenes use, so the HUD and the Phaser scene never drift onto different rounds.
 */
export function serverOffset(): number {
  return offset;
}
