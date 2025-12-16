import React from "react";

import { Loading } from "features/auth/components";
import { TicketTable } from "features/game/expansion/components/leaderboard/TicketTable";
import { TicketLeaderboard } from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { getChapterTicket } from "features/game/types/chapters";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { LastUpdatedAt } from "components/LastUpdatedAt";
import { useNow } from "lib/utils/hooks/useNow";

interface LeaderboardProps {
  isLoading: boolean;
  data: TicketLeaderboard | null;
}
export const TicketsLeaderboard: React.FC<LeaderboardProps> = ({
  isLoading,
  data,
}) => {
  const { t } = useAppTranslation();
  const now = useNow();
  const seasonTicket = getChapterTicket(now);
  if (isLoading && !data) return <Loading />;

  if (!data)
    return (
      <div className="p-1">
        <Label type="danger">{t("leaderboard.error")}</Label>
      </div>
    );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between p-1">
        <Label type="default">{`${seasonTicket} ${t(
          "leaderboard.leaderboard",
        )}`}</Label>
        <p className="font-secondary text-xs">
          <LastUpdatedAt lastUpdated={data.lastUpdated} />
        </p>
      </div>
      {data.topTen && <TicketTable rankings={data.topTen} />}
      {data.farmRankingDetails && (
        <>
          <div className="flex justify-center items-center">
            <p className="mb-[13px]">{"..."}</p>
          </div>
          <TicketTable showHeader={false} rankings={data.farmRankingDetails} />
        </>
      )}
    </div>
  );
};
