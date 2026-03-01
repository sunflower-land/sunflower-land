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
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  hasExtended?: boolean;
}

/** ~10.5 rows at ~30px per row */
const TOP_RANKINGS_MAX_HEIGHT = "305px";

export const TicketsLeaderboard: React.FC<LeaderboardProps> = ({
  isLoading,
  data,
  onLoadMore,
  isLoadingMore = false,
  hasExtended = false,
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

  const showLoadMore =
    data.topTen &&
    data.topTen.length >= 50 &&
    onLoadMore &&
    !hasExtended &&
    !isLoadingMore;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between p-1 flex-wrap">
        <Label type="default">{`${seasonTicket} ${t(
          "leaderboard.leaderboard",
        )}`}</Label>
        <p className="font-secondary text-xs">
          <LastUpdatedAt lastUpdated={data.lastUpdated} />
        </p>
      </div>
      {data.topTen && (
        <div
          className="overflow-y-auto overflow-x-hidden w-full scrollable pr-0.5"
          style={{ maxHeight: TOP_RANKINGS_MAX_HEIGHT }}
        >
          <TicketTable rankings={data.topTen} />
          {showLoadMore && (
            <div className="flex justify-center py-2">
              <button
                type="button"
                onClick={onLoadMore}
                className="text-xs underline cursor-pointer hover:opacity-90"
              >
                {t("leaderboard.loadMore")}
              </button>
            </div>
          )}
          {isLoadingMore && (
            <div className="flex justify-center mb-2">
              <Loading className="text-xs" />
            </div>
          )}
        </div>
      )}
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
