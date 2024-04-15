import React from "react";

import { Loading } from "features/auth/components";
import { TicketTable } from "features/game/expansion/components/leaderboard/TicketTable";
import { TicketLeaderboard } from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { getSeasonalTicket } from "features/game/types/seasons";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getRelativeTime } from "lib/utils/time";

interface LeaderboardProps {
  farmId: number;
  data: TicketLeaderboard | undefined;
}
export const TicketsLeaderboard: React.FC<LeaderboardProps> = ({
  farmId,
  data,
}) => {
  const { t } = useAppTranslation();
  const seasonTicket = getSeasonalTicket();

  return data ? (
    <div>
      <div className="p-1 mb-1 space-y-1">
        <p className="text-sm">{`${seasonTicket} Leaderboard`}</p>
        <p className="text-[12px]">
          {t("last.updated")} {getRelativeTime(data.lastUpdated)}
        </p>
      </div>
      {data.topTen && (
        <TicketTable rankings={data.topTen} farmId={Number(farmId)} />
      )}
      {data.farmRankingDetails && (
        <>
          <div className="flex justify-center items-center">
            <p className="mb-[13px]">{"..."}</p>
          </div>
          <TicketTable
            showHeader={false}
            rankings={data.farmRankingDetails}
            farmId={Number(farmId)}
          />
        </>
      )}
    </div>
  ) : (
    <Loading />
  );
};
