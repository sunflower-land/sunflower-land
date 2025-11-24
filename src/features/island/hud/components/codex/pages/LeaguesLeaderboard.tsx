import React from "react";

import { Loading } from "features/auth/components";
import { LeaguesLeaderboard } from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getRelativeTime } from "lib/utils/time";
import { Label } from "components/ui/Label";
import { LeaguesTable } from "features/game/expansion/components/leaderboard/LeagueTable";
import { InnerPanel } from "components/ui/Panel";
import { CropName } from "features/game/types/crops";
import { ITEM_DETAILS } from "features/game/types/images";

interface LeaderboardProps {
  isLoading: boolean;
  data: LeaguesLeaderboard | null;
}
export const LeagueLeaderboard: React.FC<LeaderboardProps> = ({
  isLoading,
  data,
}) => {
  const { t } = useAppTranslation();

  if (isLoading && !data) return <Loading />;

  if (!data) {
    return (
      <InnerPanel className="p-1">
        <Label type="danger">{t("leaderboard.error")}</Label>
      </InnerPanel>
    );
  }

  const { playerLeague, playersToShow, promotionRank, demotionRank } = data;
  const leagueCrop = playerLeague.split(" ")[0] as CropName;

  return (
    <InnerPanel>
      <div className="flex flex-col md:flex-row md:items-center justify-between p-1">
        <Label type="default" icon={ITEM_DETAILS[leagueCrop].image}>
          {`${playerLeague} ${t("leaderboard.leaderboard")}`}
        </Label>
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
    </InnerPanel>
  );
};
