import { useCallback, useEffect, useState } from "react";
import type { Moderation } from "features/game/lib/gameMachine";

/** Every player in the room's mute/kick record, keyed by farm id. */
export type ModerationHistory = Record<number, Moderation>;

/**
 * Fetches moderation history for the moderator panel.
 *
 * This used to ride along in the replicated room state: `Player.moderation` was
 * pushed to every client 20 times a second behind a `@filter` that hid it from
 * non-moderators. That filter was the single most expensive thing in the MMO —
 * it forced Colyseus to re-encode the whole room separately for every connected
 * client on every update, which cost 160x at 200 players and got dramatically
 * worse from there.
 *
 * Moderators need this when they open the panel, for a handful of players, a
 * few times an hour. So it is a request now: ask once, get an answer addressed
 * to you. The server re-checks that the requester is wearing the Halo, so the
 * gate is still enforced where it matters rather than by hiding a field.
 *
 * @param scene   the Phaser scene, for `scene.mmoService`
 * @param enabled only talk to the server while the panel is actually open
 */
export const useModerationHistory = (scene: any, enabled: boolean) => {
  const [history, setHistory] = useState<ModerationHistory>({});

  const server = scene?.mmoService?.getSnapshot()?.context?.server;

  const refresh = useCallback(() => {
    server?.send("moderation:history");
  }, [server]);

  useEffect(() => {
    if (!enabled || !server) return;

    const removeListener = server.onMessage(
      "moderation:history",
      (payload: ModerationHistory) => setHistory(payload ?? {}),
    );

    refresh();

    // A mute or kick issued from any moderator's panel changes what we should
    // be showing, so re-ask rather than trying to patch our copy locally.
    const removeEventListener = server.onMessage("moderation_event", () =>
      refresh(),
    );

    return () => {
      removeListener?.();
      removeEventListener?.();
    };
  }, [enabled, server, refresh]);

  return { history, refresh };
};

/**
 * The player's current mute, if it hasn't expired yet.
 *
 * Returns `undefined` both when a player has never been muted and when the
 * panel hasn't received history yet — callers render the same "not muted" state
 * for both, which is the safe way round: a moderator sees no stale mute badge
 * while the request is in flight.
 */
export const getActiveMute = (record?: Moderation) => {
  const latest = [...(record?.muted ?? [])].sort(
    (a, b) => b.mutedUntil - a.mutedUntil,
  )[0];

  return latest && latest.mutedUntil > Date.now() ? latest : undefined;
};
