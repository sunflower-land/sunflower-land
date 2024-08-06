import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { Loading } from "features/auth/components";
import { TicketTable } from "features/game/expansion/components/leaderboard/TicketTable";
import { FactionLeaderboard } from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { FactionName } from "features/game/types/game";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { shortenCount } from "lib/utils/formatNumber";
import { getRelativeTime } from "lib/utils/time";
import React from "react";

interface LeaderboardProps {
  id: string;
  faction: FactionName;
  isLoading: boolean;
  data: FactionLeaderboard | null | undefined;
  onBack: () => void;
}

export const MiniFactionLeaderboard: React.FC<LeaderboardProps> = ({
  id,
  faction,
  isLoading,
  data,
  onBack,
}) => {
  const { t } = useAppTranslation();

  if (isLoading && !data) return <Loading />;

  if (!data)
    return (
      <div className="p-1">
        <Label type="danger">{t("leaderboard.error")}</Label>
      </div>
    );

  const topTen = data.topTens[faction];
  const totalMembers = data.totalMembers?.[faction];

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between px-1 pt-1">
        <Label type="default" className="capitalize">{`${faction.slice(
          0,
          -1,
        )} ${t("leaderboard.leaderboard")}`}</Label>
        <p className="text-xs">
          {t("last.updated")} {getRelativeTime(data.lastUpdated)}
        </p>
      </div>
      <div className="py-1">
        <img
          src={SUNNYSIDE.icons.arrow_left}
          className="h-6 w-6 ml-2 cursor-pointer"
          onClick={onBack}
        />
      </div>

      <div className="scrollable overflow-y-auto max-h-full p-1 space-y-1.5">
        {data.farmRankingDetails && (
          <div className="space-y-1.5">
            <Label type="info">{t("leaderboard.yourPosition")}</Label>
            <TicketTable
              showHeader={true}
              rankings={data.farmRankingDetails}
              id={id}
            />
          </div>
        )}

        {topTen && (
          <div className="space-y-1.5">
            <Label type="info">{t("leaderboard.topTen")}</Label>
            <TicketTable rankings={topTen} id={id} />
          </div>
        )}
        <div className="flex justify-end">
          <p className="text-xs">
            {`${t("leaderboard.factionMembers")}: ${shortenCount(
              totalMembers ?? 0,
            )}`}
          </p>
        </div>
      </div>
    </>
  );
};
