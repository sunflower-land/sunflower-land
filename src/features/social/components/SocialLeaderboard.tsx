import React from "react";
import {
  fetchSocialLeaderboardData,
  RankData,
} from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { getRelativeTime } from "lib/utils/time";
import { Label } from "components/ui/Label";
import socialPointsIcon from "assets/icons/social_score.webp";
import useSWR from "swr";
import { LeaderboardSkeleton } from "./skeletons/LeaderboardSkeleton";
import classNames from "classnames";
import { toOrdinalSuffix } from "features/retreat/components/auctioneer/AuctionLeaderboardTable";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { SUNNYSIDE } from "assets/sunnyside";
import {
  playerModalManager,
  PlayerModalPlayer,
} from "../lib/playerModalManager";

interface LeaderboardProps {
  id: number;
  onClose: () => void;
}

export const SocialLeaderboard: React.FC<LeaderboardProps> = ({
  id,
  onClose,
}) => {
  const { t } = useAppTranslation();

  const { data, isLoading } = useSWR(
    id ? ["socialLeaderboard", id] : null,
    () => fetchSocialLeaderboardData(Number(id)),
  );

  if (isLoading) return <LeaderboardSkeleton />;

  if (!data) {
    return (
      <div className="p-1">
        <Label type="danger">{t("leaderboard.error")}</Label>
      </div>
    );
  }

  const handlePlayerClick = ({
    farmId,
    username,
    clothing,
  }: PlayerModalPlayer) => {
    onClose();
    playerModalManager.open({ farmId, username, clothing });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-col mb-1 gap-1 md:flex-row md:items-center justify-between p-1">
          <Label type="default" icon={socialPointsIcon}>
            {t("social.leaderboard.weekly")}
          </Label>
          <p className="font-secondary text-xs">
            {t("last.updated")} {getRelativeTime(data.lastUpdated)}
          </p>
        </div>
        {data.weekly.topTen && (
          <SocialLeaderboardTable
            rankings={data.weekly.topTen}
            handlePlayerClick={handlePlayerClick}
          />
        )}
        {data.weekly.farmRankingDetails && (
          <>
            <div className="flex justify-center items-center">
              <p className="mb-[13px]">{"..."}</p>
            </div>
            <SocialLeaderboardTable
              showHeader={false}
              rankings={data.weekly.farmRankingDetails}
              handlePlayerClick={handlePlayerClick}
            />
          </>
        )}
      </div>
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between p-1 mb-1">
          <Label type="default" icon={socialPointsIcon}>
            {t("social.leaderboard.allTime")}
          </Label>
        </div>
        {data.allTime.topTen && (
          <SocialLeaderboardTable
            rankings={data.allTime.topTen}
            handlePlayerClick={handlePlayerClick}
          />
        )}
        {data.allTime.farmRankingDetails && (
          <>
            <div className="flex justify-center items-center">
              <p className="mb-[13px]">{"..."}</p>
            </div>
            <SocialLeaderboardTable
              showHeader={false}
              rankings={data.allTime.farmRankingDetails}
              handlePlayerClick={handlePlayerClick}
            />
          </>
        )}
      </div>
    </div>
  );
};

interface Props {
  rankings: (RankData & { username: string })[];
  showHeader?: boolean;
  handlePlayerClick: (player: PlayerModalPlayer) => void;
}

export const SocialLeaderboardTable: React.FC<Props> = ({
  rankings,
  showHeader = true,
  handlePlayerClick,
}) => {
  const { t } = useAppTranslation();
  return (
    <table className="w-full text-xs table-fixed border-collapse">
      {showHeader && (
        <thead>
          <tr>
            <th style={{ border: "1px solid #b96f50" }} className="p-1.5 w-1/5">
              <p>{t("rank")}</p>
            </th>
            <th style={{ border: "1px solid #b96f50" }} className="p-1.5">
              <p>{t("player")}</p>
            </th>
            <th style={{ border: "1px solid #b96f50" }} className="p-1.5 w-1/5">
              <p>{t("points")}</p>
            </th>
          </tr>
        </thead>
      )}
      <tbody>
        {rankings.map(
          ({ id, count, rank, bumpkin: clothing, username }, index) => (
            <tr
              key={index}
              className={classNames("relative", {
                "bg-[#ead4aa]": index % 2 === 0,
              })}
            >
              <td
                style={{ border: "1px solid #b96f50", height: "40px" }}
                className="p-1.5 w-1/5"
              >
                {toOrdinalSuffix(rank ?? index + 1)}
              </td>
              <td
                style={{ border: "1px solid #b96f50", height: "40px" }}
                className="p-1.5 text-left pl-8 relative truncate cursor-pointer"
                onClick={() => {
                  handlePlayerClick({
                    farmId: Number(id),
                    username,
                    clothing,
                  });
                }}
              >
                <div
                  className="absolute"
                  style={{
                    left: "4px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <NPCIcon width={24} parts={clothing} />
                </div>
                {username}

                <div
                  className="absolute h-10 w-6 flex items-center justify-center"
                  style={{
                    right: "4px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <img
                    src={SUNNYSIDE.icons.chevron_right}
                    alt="search"
                    className="w-4 h-4"
                  />
                </div>
              </td>

              <td
                style={{ border: "1px solid #b96f50", height: "40px" }}
                className="p-1.5 w-1/5"
              >
                {count}
              </td>
            </tr>
          ),
        )}
      </tbody>
    </table>
  );
};
