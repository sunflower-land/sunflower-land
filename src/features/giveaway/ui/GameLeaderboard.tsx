import React, { useEffect, useState } from "react";

import { InnerPanel } from "components/ui/Panel";
import { Label } from "components/ui/Label";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { NPC_WEARABLES } from "lib/npcs";
import type { MMOContext } from "features/world/mmoMachine";
import type { MinigameType } from "../lib/minigames";
import { scoreFromPosition, scoreUnit } from "../lib/gameScore";

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
 * A live mini leaderboard, top-left. It ranks players purely by the position
 * they broadcast to the MMO — race by X, jump by height, chop/eggs by the score
 * they send as their Y (see gameScore.ts). Shows the top 10, plus your own row
 * below if you've slipped out of it; your row is highlighted yellow.
 *
 * Desktop shows NPC + username + score; mobile drops the username.
 */
export const GameLeaderboard: React.FC<{
  /** The joined room, handed down from GiveawayGame (same object the scene uses). */
  server: MMOContext["server"];
  minigame: MinigameType;
}> = ({ server, minigame }) => {
  const { t } = useAppTranslation();

  // Re-read the room state a few times a second, since Colyseus mutates it in
  // place without re-rendering React.
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((n) => n + 1), 400);
    return () => clearInterval(interval);
  }, []);

  const connected = !!server;
  const rows: Row[] = [];
  if (server) {
    const players: Omit<Row, "position">[] = [];
    server.state.players.forEach((p, sessionId) => {
      players.push({
        sessionId,
        farmId: p.farmId,
        username: p.username,
        clothing: p.clothing?.body
          ? (p.clothing as unknown as Row["clothing"])
          : DEFAULT_PARTS,
        score: scoreFromPosition(minigame, p.x, p.y),
        isSelf: sessionId === server.sessionId,
      });
    });
    players
      .sort((a, b) => b.score - a.score)
      .forEach((p, i) => rows.push({ ...p, position: i + 1 }));
  }

  // TEMP diagnostic — full picture of what THIS client sees in the room, so we
  // can tell whether a newly-joined player is missing from `state.players`
  // (backend replication) vs present but not scored/ranked (frontend logic).
  // eslint-disable-next-line no-console
  console.log("[giveaway] leaderboard", {
    minigame,
    hasServer: !!server,
    selfSessionId: server?.sessionId,
    size: server?.state?.players?.size ?? -1,
    rows: rows.length,
    players: server
      ? [...server.state.players.entries()].map(([sessionId, p]) => ({
          sessionId,
          farmId: p.farmId,
          username: p.username,
          x: Math.round(p.x),
          y: Math.round(p.y),
          score: scoreFromPosition(minigame, p.x, p.y),
        }))
      : [],
  });

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
