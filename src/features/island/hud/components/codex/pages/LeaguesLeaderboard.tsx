import React from "react";

import { Loading } from "features/auth/components";
import { TicketTable } from "features/game/expansion/components/leaderboard/TicketTable";
import { LeaguesLeaderboard } from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getRelativeTime } from "lib/utils/time";
import { Label } from "components/ui/Label";
import { LeagueName } from "features/game/types/leagues";

interface LeaderboardProps {
  id: string;
  isLoading: boolean;
  data: LeaguesLeaderboard | null;
  leagueName: LeagueName;
}
export const LeagueLeaderboard: React.FC<LeaderboardProps> = ({
  id,
  isLoading,
  data,
  leagueName,
}) => {
  const { t } = useAppTranslation();

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
        <Label type="default">{`${leagueName} ${t(
          "leaderboard.leaderboard",
        )}`}</Label>
        <p className="font-secondary text-xs">
          {t("last.updated")} {getRelativeTime(data.lastUpdated)}
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
