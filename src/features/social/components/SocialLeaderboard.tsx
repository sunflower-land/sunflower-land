import React from "react";

import { TicketTable } from "features/game/expansion/components/leaderboard/TicketTable";
import { fetchSocialLeaderboardData } from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getRelativeTime } from "lib/utils/time";
import { Label } from "components/ui/Label";
import socialPointsIcon from "assets/icons/social_score.webp";
import useSWR from "swr";
import { LeaderboardSkeleton } from "./skeletons/LeaderboardSkeleton";

interface LeaderboardProps {
  id: number;
}

export const SocialLeaderboard: React.FC<LeaderboardProps> = ({ id }) => {
  const { t } = useAppTranslation();

  const { data, isLoading } = useSWR(
    id ? ["socialLeaderboard", id] : null,
    () => fetchSocialLeaderboardData(Number(id)),
  );

  // Prefer the prop data if provided, otherwise use SWR data
  const leaderboardData = data?.socialPoints ?? null;

  if (isLoading) return <LeaderboardSkeleton />;

  if (!leaderboardData)
    return (
      <div className="p-1">
        <Label type="danger">{t("leaderboard.error")}</Label>
      </div>
    );

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between p-1">
        <Label type="default" icon={socialPointsIcon}>
          {t("social.leaderboard")}
        </Label>
        <p className="font-secondary text-xs">
          {t("last.updated")} {getRelativeTime(leaderboardData.lastUpdated)}
        </p>
      </div>
      {leaderboardData.topTen && (
        <TicketTable rankings={leaderboardData.topTen} />
      )}
      {leaderboardData.farmRankingDetails && (
        <>
          <div className="flex justify-center items-center">
            <p className="mb-[13px]">{"..."}</p>
          </div>
          <TicketTable
            showHeader={false}
            rankings={leaderboardData.farmRankingDetails}
          />
        </>
      )}
    </>
  );
};
