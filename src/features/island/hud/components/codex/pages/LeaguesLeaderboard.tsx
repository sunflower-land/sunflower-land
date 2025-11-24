import React from "react";

import { Loading } from "features/auth/components";
import { LeaguesLeaderboard } from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getRelativeTime } from "lib/utils/time";
import { Label } from "components/ui/Label";
import { LeagueName } from "features/game/types/leagues";
import { LeaguesTable } from "features/game/expansion/components/leaderboard/LeagueTable";

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

  if (!data) {
    return (
      <div className="p-1">
        <Label type="danger">{t("leaderboard.error")}</Label>
      </div>
    );
  }

  const { playersToShow, promotionRank, demotionRank } = data;

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
      {playersToShow.length && (
        <>
          <LeaguesTable
            showHeader
            rankings={playersToShow}
            promotionRank={promotionRank}
            demotionRank={demotionRank}
          />
        </>
      )}
    </div>
  );
};

/**
 *           <div className="flex justify-center items-center">
            <p className="mb-[13px]">{"..."}</p>
          </div>
 */
