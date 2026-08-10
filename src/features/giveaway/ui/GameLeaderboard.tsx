import React, { useEffect, useState } from "react";

import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NPC_WEARABLES } from "lib/npcs";
import type { MMOContext } from "features/world/mmoMachine";
import type { MinigameType } from "../lib/minigames";
import { scoreUnit } from "../lib/gameScore";

/** Fallback avatar when the room doesn't replicate a player's clothing. */
const DEFAULT_PARTS = NPC_WEARABLES[
  "pumpkin' pete"
] as unknown as React.ComponentProps<typeof NPCIcon>["parts"];

const MAX_ROWS = 10;

type Row = {
  sessionId: string;
  farmId: number;
  username?: string;
  clothing: React.ComponentProps<typeof NPCIcon>["parts"];
  score: number;
  position: number;
  isSelf: boolean;
};

/**
 * Snapshot the room's players into a ranked row list. Colyseus mutates the room
 * state in place (the `server` reference never changes), so reading it directly
 * in render gets memoised to stale output — we snapshot into React state on an
 * interval instead (see below), and this is the pure builder for that snapshot.
 */
function buildRows(server: MMOContext["server"]): Row[] {
  if (!server) return [];

  const players: Omit<Row, "position">[] = [];
  server.state.players.forEach((p, sessionId) => {
    players.push({
      sessionId,
      farmId: p.farmId,
      username: p.username,
      clothing: p.clothing?.body
        ? (p.clothing as unknown as Row["clothing"])
        : DEFAULT_PARTS,
      // Standardised: every game submits its live score as `points`.
      score: Math.max(0, Math.round(p.points ?? 0)),
      isSelf: sessionId === server.sessionId,
    });
  });

  return players
    .sort((a, b) => b.score - a.score)
    .map((p, i) => ({ ...p, position: i + 1 }));
}

/**
 * A live mini leaderboard, top-left. Every mini-game submits its score live to
 * the MMO as the player's `points` field, so this just ranks players by their
 * `points` (highest first) — one standard source for all games. Shows the top
 * 10, plus your own row below if you've slipped out of it (highlighted yellow).
 *
 * Desktop shows NPC + username + score; mobile drops the username.
 */
export const GameLeaderboard: React.FC<{
  /** The joined room, handed down from GiveawayGame (same object the scene uses). */
  server: MMOContext["server"];
  minigame: MinigameType;
}> = ({ server, minigame }) => {
  const { t } = useAppTranslation();

  // Colyseus mutates the room in place, so reading it directly in render gets
  // memoised to stale output (the `server` reference never changes). Instead we
  // snapshot it into React state a few times a second — a fresh array each tick
  // that the render actually re-consumes. The lazy initialiser seeds the first
  // frame; the interval keeps it live (and re-seeds if `server` swaps).
  const [rows, setRows] = useState<Row[]>(() => buildRows(server));
  useEffect(() => {
    const interval = setInterval(() => setRows(buildRows(server)), 400);
    return () => clearInterval(interval);
  }, [server]);

  const connected = !!server;
  const unit = scoreUnit(minigame);
  const top = rows.slice(0, MAX_ROWS);
  const self = rows.find((r) => r.isSelf);
  const selfBelow = self && self.position > MAX_ROWS ? self : undefined;

  const row = (r: Row) => (
    <tr key={r.sessionId} className={r.isSelf ? "bg-[#ffdc82]" : ""}>
      <td className="py-0.5 pl-1 pr-0.5 w-5 text-right">{r.position}</td>
      <td className="py-0.5 px-0.5 w-6">
        <div className="w-[18px] h-[18px] overflow-hidden">
          <NPCIcon width={18} parts={r.clothing} />
        </div>
      </td>
      <td className="hidden sm:table-cell py-0.5 px-1 truncate max-w-[90px]">
        {r.username ?? `#${r.farmId}`}
      </td>
      <td className="py-0.5 pr-1 pl-0.5 text-right whitespace-nowrap">
        {r.score}
        {unit}
      </td>
    </tr>
  );

  return (
    <div className="absolute top-2 left-2 z-20 pointer-events-none">
      <InnerPanel className="p-1 w-28 sm:w-44">
        <div className="mb-1">
          <Label type="default">{t("giveaway.leaderboard")}</Label>
        </div>

        {rows.length > 0 ? (
          <table className="w-full text-xxs sm:text-xs">
            <tbody>
              {top.map(row)}
              {selfBelow && (
                <>
                  <tr>
                    <td colSpan={4} className="text-center leading-none">
                      {"…"}
                    </td>
                  </tr>
                  {row(selfBelow)}
                </>
              )}
            </tbody>
          </table>
        ) : (
          // Nothing to rank yet — explain why (this board is MMO-driven, not API).
          <p className="text-xxs p-1 leading-snug">
            {connected
              ? t("giveaway.leaderboardWaiting")
              : t("giveaway.leaderboardOffline")}
          </p>
        )}
      </InnerPanel>
    </div>
  );
};
