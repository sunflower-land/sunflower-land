import React from "react";
import classNames from "classnames";
import { RankData } from "./actions/leaderboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { toOrdinalSuffix } from "features/retreat/components/auctioneer/AuctionLeaderboardTable";
import { NPCIcon } from "features/island/bumpkin/components/NPC";
import { Label } from "components/ui/Label";
import arrowUp from "assets/icons/level_up.png";
import arrowDown from "assets/icons/decrease_arrow.png";

interface Props {
  rankings: RankData[];
  showHeader?: boolean;
  promotionRank: number | undefined;
  demotionRank: number | undefined;
  username?: string;
  farmId: number;
}

export const LeaguesTable: React.FC<Props> = ({
  rankings,
  showHeader = true,
  promotionRank,
  demotionRank,
  username,
  farmId,
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
        {rankings.map(({ id, count, rank, bumpkin }, index) => {
          const previous = rankings[index - 1];
          const currentRank = rank ?? index + 1;
          const previousRank = previous?.rank ?? currentRank - 1;
          return (
            <React.Fragment key={id}>
              {previousRank !== currentRank - 1 && (
                <tr>
                  <td colSpan={3} style={{ border: "1px solid #b96f50" }}>
                    <div className="flex justify-center items-center">
                      <p className="mb-[10px]">{"..."}</p>
                    </div>
                  </td>
                </tr>
              )}

              {currentRank === demotionRank && (
                <tr>
                  <td colSpan={3} style={{ border: "1px solid #b96f50" }}>
                    <div className="flex justify-center items-center py-1">
                      <Label type="danger" secondaryIcon={arrowDown}>
                        {`Demotion Zone`}
                      </Label>
                    </div>
                  </td>
                </tr>
              )}
              <tr
                className={classNames("relative", {
                  "bg-[#ead4aa]":
                    index % 2 === 0 ||
                    id === username ||
                    String(id) === String(farmId),
                })}
              >
                <td
                  style={{ border: "1px solid #b96f50" }}
                  className="p-1.5 w-1/5"
                >
                  <div className="flex items-center gap-2">
                    {!!promotionRank && currentRank <= promotionRank ? (
                      <img src={arrowUp} className="w-4 h-4" />
                    ) : !!demotionRank && currentRank >= demotionRank ? (
                      <img src={arrowDown} className="w-4 h-4" />
                    ) : (
                      // empty div to align the text
                      <div className="w-4 h-4" />
                    )}
                    {toOrdinalSuffix(currentRank)}
                  </div>
                </td>
                <td
                  style={{ border: "1px solid #b96f50" }}
                  className="p-1.5 text-left pl-8 relative truncate"
                >
                  <div className="absolute" style={{ left: "4px", top: "1px" }}>
                    <NPCIcon width={24} parts={bumpkin} />
                  </div>
                  {`${id} ${id === username || String(id) === String(farmId) ? " (You)" : ""}`}
                </td>
                <td
                  style={{ border: "1px solid #b96f50" }}
                  className="p-1.5 w-1/5"
                >
                  {count}
                </td>
              </tr>
              {currentRank === promotionRank && (
                <tr>
                  <td colSpan={3} style={{ border: "1px solid #b96f50" }}>
                    <div className="flex justify-center items-center">
                      <Label type="success" secondaryIcon={arrowUp}>
                        {`Promotion Zone`}
                      </Label>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};
