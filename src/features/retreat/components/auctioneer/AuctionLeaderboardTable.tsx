import React from "react";
import classNames from "classnames";
import { AuctionResults } from "features/game/lib/auctionMachine";
import { getKeys } from "features/game/types/craftables";
import { ITEM_DETAILS } from "features/game/types/images";
import sflIcon from "assets/icons/flower_token.webp";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

// https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-122.php
export const toOrdinalSuffix = (num: number) => {
  const int = num,
    digits = [int % 10, int % 100],
    ordinals = ["st", "nd", "rd", "th"],
    oPattern = [1, 2, 3, 4],
    tPattern = [11, 12, 13, 14, 15, 16, 17, 18, 19];
  return oPattern.includes(digits[0]) && !tPattern.includes(digits[1])
    ? int + ordinals[digits[0] - 1]
    : int + ordinals[3];
};

export const AuctionLeaderboardTable: React.FC<{
  leaderboard: AuctionResults["leaderboard"];
  showHeader: boolean;
  farmId: number;
  status: AuctionResults["status"];
}> = ({ farmId, leaderboard, showHeader = true, status }) => {
  const { t } = useAppTranslation();

  return (
    <>
      <table className="w-full text-xs table-fixed border-collapse p-">
        {showHeader && (
          <thead>
            <tr>
              <th
                style={{ border: "1px solid #b96f50", textAlign: "left" }}
                className="p-1.5 w-1/5"
              >
                <p>{t("rank")}</p>
              </th>
              <th
                style={{ border: "1px solid #b96f50", textAlign: "left" }}
                className="p-1.5"
              >
                <p>{t("player")}</p>
              </th>
              <th
                style={{ border: "1px solid #b96f50", textAlign: "left" }}
                className="p-1.5 w-2/5"
              >
                <p>{t("bid")}</p>
              </th>
            </tr>
          </thead>
        )}
        <tbody>
          {leaderboard.map((result, index) => (
            <tr
              key={index}
              className={classNames({
                "bg-green-500": status === "winner" && result.farmId === farmId,
                "bg-red-500":
                  (status === "loser" || status === "tiebreaker") &&
                  result.farmId === farmId,
              })}
            >
              <td
                style={{ border: "1px solid #b96f50" }}
                className="p-1.5 w-1/5 relative"
              >
                {toOrdinalSuffix(result.rank)}
              </td>
              <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
                <div className="flex flex-wrap">
                  {result.username ?? result.farmId}
                </div>
              </td>
              <td
                style={{ border: "1px solid #b96f50" }}
                className="p-1.5 w-2/5"
              >
                <div className="flex space-x-1 flex-wrap space-y-1">
                  {result.sfl > 0 && (
                    <div className="flex w-16 items-center">
                      <img src={sflIcon} className="h-4 mr-0.5" />
                      <span className="text-xs">{result.sfl}</span>
                    </div>
                  )}
                  {getKeys(result.items).map((name) => (
                    <div className="flex w-16 items-center" key={name}>
                      <img
                        src={ITEM_DETAILS[name].image}
                        className="h-4 mr-0.5"
                      />
                      <span className="text-xs">{result.items[name]}</span>
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
