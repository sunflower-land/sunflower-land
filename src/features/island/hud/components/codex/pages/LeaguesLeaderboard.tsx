import React from "react";

import { Loading } from "features/auth/components";
import { LeaguesLeaderboard } from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { LeaguesTable } from "features/game/expansion/components/leaderboard/LeagueTable";
import { CropName } from "features/game/types/crops";
import { ITEM_DETAILS } from "features/game/types/images";
import { LastUpdatedAt } from "components/LastUpdatedAt";

interface LeaderboardProps {
  isLoading: boolean;
  data: LeaguesLeaderboard | null;
  username?: string;
  farmId: number;
}
export const LeagueLeaderboard: React.FC<LeaderboardProps> = ({
  isLoading,
  data,
  username,
  farmId,
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

  const { playerLeague, playersToShow, promotionRank, demotionRank } = data;
  const leagueCrop = playerLeague.split(" ")[0] as CropName;

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between p-1">
        <Label type="default" icon={ITEM_DETAILS[leagueCrop].image}>
          {`${playerLeague} ${t("leaderboard.leaderboard")}`}
        </Label>
        <p className="font-secondary text-xs">
          <LastUpdatedAt lastUpdated={data.lastUpdated} />
        </p>
      </div>
      {!!playersToShow.length && (
        <>
          <LeaguesTable
            showHeader
            rankings={playersToShow}
            promotionRank={promotionRank}
            demotionRank={demotionRank}
            username={username}
            farmId={farmId}
          />
        </>
      )}
    </>
  );
};
