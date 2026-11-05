import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import type { AuctionResults } from "features/game/lib/auctionMachine";
import { getKeys } from "lib/object";
import { ITEM_DETAILS } from "features/game/types/images";
import sflIcon from "assets/icons/flower_token.webp";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { playerModalManager } from "features/social/lib/playerModalManager";
import {
  getAscensionDisplayText,
  getAscensionLevel,
} from "features/game/lib/level";

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

// Collapsed borders scroll away from a sticky header, so draw them as a shadow.
const HEADER_STYLE: React.CSSProperties = {
  boxShadow: "inset 0 0 0 1px #b96f50",
  textAlign: "left",
};

export const AuctionLeaderboardTable: React.FC<{
  leaderboard: AuctionResults["leaderboard"];
  showHeader: boolean;
  farmId: number;
  status: AuctionResults["status"];
}> = ({ farmId, leaderboard, showHeader = true, status }) => {
  const { t } = useAppTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRowRef = useRef<HTMLTableRowElement>(null);

  // The full winner list can be long - bring the player's own row into view
  // without scrolling the surrounding modal (which scrollIntoView would do).
  useEffect(() => {
    const container = containerRef.current;
    const row = playerRowRef.current;
    if (!container || !row) return;

    const offset =
      row.getBoundingClientRect().top - container.getBoundingClientRect().top;
    container.scrollTop += offset - container.clientHeight / 2;
  }, [leaderboard, farmId]);

  return (
    <div
      ref={containerRef}
      className="w-full max-h-64 overflow-y-auto scrollable"
    >
      <table className="w-full text-xs table-fixed border-collapse">
        {showHeader && (
          <thead className="sticky top-0 z-10 bg-[#e4a672]">
            <tr>
              <th style={HEADER_STYLE} className="p-1.5 w-1/5">
                <p>{t("rank")}</p>
              </th>
              <th style={HEADER_STYLE} className="p-1.5">
                <p>{t("player")}</p>
              </th>
              <th style={HEADER_STYLE} className="p-1.5 w-2/5">
                <p>{t("bid")}</p>
              </th>
            </tr>
          </thead>
        )}
        <tbody>
          {leaderboard.map((result, index) => (
            <tr
              key={index}
              ref={result.farmId === farmId ? playerRowRef : undefined}
              className={classNames("cursor-pointer", {
                "bg-green-500": status === "winner" && result.farmId === farmId,
                "bg-red-500":
                  (status === "loser" || status === "tiebreaker") &&
                  result.farmId === farmId,
              })}
              onClick={() =>
                playerModalManager.open({
                  farmId: result.farmId,
                  username: result.username,
                })
              }
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
                {/* Older API responses omit the ascension; without it the level
                    would read as a pre-ascension level, so hide it instead. */}
                {result.ascensionLevel !== undefined && (
                  <p className="text-xxs">
                    {getAscensionDisplayText({
                      ascension: getAscensionLevel({
                        experience: result.experience,
                        ascensionLevel: result.ascensionLevel,
                      }),
                      length: "short",
                    })}
                  </p>
                )}
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
    </div>
  );
};
