import React from "react";
import classNames from "classnames";
import { RankData } from "./actions/leaderboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { toOrdinalSuffix } from "features/retreat/components/auctioneer/AuctionLeaderboardTable";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { getBumpkinLevel } from "features/game/lib/level";
import { playerModalManager } from "features/social/lib/playerModalManager";

interface Props {
  rankings: RankData[];
  showHeader?: boolean;
}

export const TicketTable: React.FC<Props> = ({
  rankings,
  showHeader = true,
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
              <p>{t("total")}</p>
            </th>
          </tr>
        </thead>
      )}
      <tbody>
        {rankings.map(
          ({ id, count, rank, bumpkin, experience, farmId }, index) => {
            const level = getBumpkinLevel(experience ?? 0);
            return (
              <tr
                key={index}
                className={classNames("relative", {
                  "bg-[#ead4aa]": index % 2 === 0,
                  "cursor-pointer": !!farmId,
                })}
                onClick={() => {
                  if (farmId) {
                    playerModalManager.open({
                      farmId,
                      username: id,
                      clothing: bumpkin,
                    });
                  }
                }}
              >
                <td
                  style={{ border: "1px solid #b96f50" }}
                  className="p-1.5 w-1/5"
                >
                  {toOrdinalSuffix(rank ?? index + 1)}
                </td>
                <td
                  style={{ border: "1px solid #b96f50" }}
                  className="p-1.5 text-left pl-8 relative truncate"
                >
                  <div className="absolute" style={{ left: "4px", top: "1px" }}>
                    <NPCIcon width={24} parts={bumpkin} />
                  </div>
                  {`${id} - ${t("auction.raffle.levelShort", { level })}`}
                </td>
                <td
                  style={{ border: "1px solid #b96f50" }}
                  className="p-1.5 w-1/5"
                >
                  {count}
                </td>
              </tr>
            );
          },
        )}
      </tbody>
    </table>
  );
};
