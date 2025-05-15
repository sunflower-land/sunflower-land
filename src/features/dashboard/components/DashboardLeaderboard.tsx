import React from "react";

import { Loading } from "features/auth/components";
import { TicketTable } from "features/game/expansion/components/leaderboard/TicketTable";
import {
  fetchLeaderboardData,
  TicketLeaderboard,
} from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { getSeasonalTicket } from "features/game/types/seasons";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getRelativeTime } from "lib/utils/time";
import { Label } from "components/ui/Label";
import { CONFIG } from "lib/config";
import { useAuth } from "features/auth/lib/Provider";
import useSWR from "swr";

interface LeaderboardProps {
  id: string;
}
export const DashboardLeaderboard: React.FC<LeaderboardProps> = ({ id }) => {
  const { t } = useAppTranslation();
  const seasonTicket = getSeasonalTicket();

  const { authState } = useAuth();

  const hotNowFetcher = ([, token]: [string, string]) => {
    if (CONFIG.API_URL) return fetchLeaderboardData(1);
  };

  const { data, error, isLoading } = useSWR(
    ["/marketplace/trends", authState.context.user.rawToken as string],
    hotNowFetcher,
  );

  if (isLoading && !data) return <Loading />;

  if (!data)
    return (
      <div className="p-1">
        <Label type="danger">{t("leaderboard.error")}</Label>
      </div>
    );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <Label type="warning" className="mb-1">{`${seasonTicket} ${t(
          "leaderboard.leaderboard",
        )}`}</Label>
      </div>
      {data.tickets?.topTen && (
        <TicketTable rankings={data.tickets.topTen} id={id} />
      )}
      {data.tickets?.farmRankingDetails && (
        <>
          <div className="flex justify-center items-center">
            <p className="mb-[13px]">{"..."}</p>
          </div>
          <TicketTable
            showHeader={false}
            rankings={data.tickets.farmRankingDetails}
            id={id}
          />
        </>
      )}
    </div>
  );
};
