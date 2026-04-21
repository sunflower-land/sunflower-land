import React from "react";
import classNames from "classnames";
import { InnerPanel } from "components/ui/Panel";
import { Loading } from "features/auth/components/Loading";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { playerModalManager } from "features/social/lib/playerModalManager";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { formatNumber } from "lib/utils/formatNumber";
import type { EconomyLeaderboardPlayer } from "../lib/loadEconomyLeaderboard";

type Props = {
  loading: boolean;
  /** Null while loading or when the API hasn't responded yet. */
  players: EconomyLeaderboardPlayer[] | null;
  /** ms since epoch; rendered as a relative "Updated 2m ago" line at the bottom. */
  lastUpdated: number | null;
  error: string | null;
  /** Highlights the current farm in the list (when present in top 10). */
  currentFarmId?: number;
};

function relativeTimeFromNow(ms: number): string {
  const diff = Math.max(0, Date.now() - ms);
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export const MinigameLeaderboardWidget: React.FC<Props> = ({
  loading,
  players,
  lastUpdated,
  error,
  currentFarmId,
}) => {
  const { t } = useAppTranslation();

  return (
    <InnerPanel className="rounded-sm p-1">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between px-1 pt-0.5">
          <span className="text-xxs font-medium uppercase tracking-wide text-[#3e2731]/80">
            {t("minigame.dashboard.leaderboard")}
          </span>
        </div>

        {loading && !players && (
          <div className="flex items-center justify-center py-3">
            <Loading className="text-xs text-[#3e2731]" />
          </div>
        )}

        {!loading && error && !players && (
          <p className="px-1 py-2 text-xxs text-[#3e2731]/80">
            {t("minigame.dashboard.leaderboardFailed")}
          </p>
        )}

        {players && players.length === 0 && (
          <p className="px-1 py-2 text-xxs text-[#3e2731]/80">
            {t("minigame.dashboard.leaderboardEmpty")}
          </p>
        )}

        {players && players.length > 0 && (
          <ul className="flex flex-col">
            {players.map((player) => {
              const isCurrent =
                currentFarmId != null && currentFarmId === player.farmId;
              return (
                <li
                  key={`${player.farmId}-${player.rank}`}
                  className={classNames(
                    "flex items-center gap-1 px-1 py-0.5 rounded-sm",
                    {
                      "bg-[#ead4aa]": player.rank % 2 === 1 && !isCurrent,
                      "bg-[#f5c269]": isCurrent,
                      "cursor-pointer hover:bg-[#f5c269]/60": !!player.farmId,
                    },
                  )}
                  onClick={() => {
                    if (!player.farmId) return;
                    playerModalManager.open({
                      farmId: player.farmId,
                      username: player.username,
                      clothing: player.bumpkin,
                    });
                  }}
                >
                  <span className="w-5 shrink-0 text-center text-xxs tabular-nums text-[#3e2731]">
                    {player.rank}
                  </span>
                  <div
                    className="relative shrink-0"
                    style={{ width: 20, height: 20 }}
                  >
                    {player.bumpkin && (
                      <NPCIcon width={20} parts={player.bumpkin} />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col leading-tight">
                    <span className="truncate text-xxs text-[#3e2731]">
                      {player.username}
                    </span>
                    <span className="text-xxs text-[#3e2731]/70">
                      {t("minigame.dashboard.leaderboardLevelShort", {
                        level: player.level,
                      })}
                      {" · #"}
                      {player.farmId}
                    </span>
                  </div>
                  <span className="shrink-0 text-xxs tabular-nums text-[#3e2731]">
                    {formatNumber(player.highscore, { decimalPlaces: 0 })}
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        {lastUpdated != null && (
          <p className="px-1 pt-0.5 pb-0.5 text-right text-xxs italic text-[#3e2731]/60">
            {t("minigame.dashboard.leaderboardLastUpdated", {
              when: relativeTimeFromNow(lastUpdated),
            })}
          </p>
        )}
      </div>
    </InnerPanel>
  );
};
