import React from "react";
import useSWR from "swr";
import { useContext } from "react";
import classNames from "classnames";

import { Label } from "components/ui/Label";
import { Loading } from "features/auth/components";
import { InnerPanel } from "components/ui/Panel";
import * as Auth from "features/auth/lib/Provider";
import { Context as GameContext } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { CONFIG } from "lib/config";
import { toOrdinalSuffix } from "features/retreat/components/auctioneer/AuctionLeaderboardTable";
import coinsIcon from "assets/icons/coins.webp";

import { getGiveawayLeaderboard } from "../actions/getGiveawayLeaderboard";
import type { PrizeTier } from "../lib/types";

/** The tier covering a given 1-based leaderboard position, if any. */
export const prizeForPosition = (prizes: PrizeTier[], position: number) =>
  prizes.find((tier) => position >= tier.from && position <= tier.to);

const prizeRewardLabel = (tier: PrizeTier) => {
  const parts: string[] = [];
  if (tier.coins) parts.push(`${tier.coins}`);
  Object.entries(tier.items ?? {}).forEach(([name, amount]) =>
    parts.push(`${amount} ${name}`),
  );
  return parts.join(", ");
};

/**
 * The ranked top 10, with each position's prize shown on the right of its row.
 * Self-fetching by `id` (shares the SWR cache key with the mini-game provider),
 * so it can be dropped into the town-hall panel or the race results overlay.
 */
export const GiveawayLeaderboard: React.FC<{ id: string }> = ({ id }) => {
  const { t } = useAppTranslation();
  const { authService } = useContext(Auth.Context);
  const { gameService } = useContext(GameContext);
  const token = authService.getSnapshot().context.user.rawToken as string;
  const playerId = useSelector(gameService, (state) => state.context.farmId);

  const { data: board } = useSWR(
    token || !CONFIG.API_URL ? ["giveawayLeaderboard", id] : null,
    () => getGiveawayLeaderboard({ token, id }),
    { refreshInterval: 5000 },
  );

  if (!board) return <Loading />;

  return (
    <InnerPanel className="p-2">
      <div className="flex justify-between mb-1">
        <Label type="default">{t("giveaway.leaderboard")}</Label>
        <span className="text-xxs">
          {t("giveaway.participants", { count: board.totalParticipants })}
        </span>
      </div>

      {board.leaderboard.length === 0 && (
        <p className="text-xs p-1">{t("giveaway.noScores")}</p>
      )}

      {board.leaderboard.map((row) => {
        const prize = prizeForPosition(board.prizes, row.position);

        return (
          <div
            key={row.farmId}
            className={classNames(
              "flex items-center gap-2 text-xs py-0.5 px-1",
              {
                "bg-white bg-opacity-30 rounded-sm": row.farmId === playerId,
              },
            )}
          >
            <span className="w-8 shrink-0">
              {toOrdinalSuffix(row.position)}
            </span>
            <span className="flex-1 truncate">
              {row.username ?? `#${row.farmId}`}
            </span>
            {/* Their score. */}
            <span className="w-10 shrink-0 text-right">{row.score}</span>
            {/* The prize for finishing in this position. */}
            {prize && (
              <span className="flex items-center gap-1 shrink-0 w-14 justify-end">
                {prizeRewardLabel(prize)}
                {!!prize.coins && (
                  <img src={coinsIcon} className="h-4" alt="coins" />
                )}
              </span>
            )}
          </div>
        );
      })}
    </InnerPanel>
  );
};
