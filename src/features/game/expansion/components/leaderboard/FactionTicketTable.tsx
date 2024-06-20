import React from "react";
import classNames from "classnames";
import { RankData } from "./actions/leaderboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { FACTION_EMBLEM_ICONS } from "features/world/ui/factions/components/ClaimEmblems";
import { RANKS } from "features/world/ui/factions/emblemTrading/Emblems";
import { FactionName } from "features/game/types/game";

interface Props {
  rankings: RankData[];
  showHeader?: boolean;
  id: string;
  factionName: FactionName;
}

export const FactionTicketsTable: React.FC<Props> = ({
  rankings,
  id: playerId,
  factionName: faction,
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
            <th style={{ border: "1px solid #b96f50" }} className="p-1.5 w-1/4">
              <p>{t("total")}</p>
            </th>
          </tr>
        </thead>
      )}
      <tbody className="text-xxs sm:text-xs">
        {rankings.map(({ id, count, rank }, index) => {
          const playerRank = [...RANKS[faction]]
            .reverse()
            .find((r) => count >= r.emblemsRequired);

          return (
            <tr
              key={index}
              className={classNames({ "bg-[#ead4aa]": id === playerId })}
            >
              <td style={{ border: "1px solid #b96f50" }} className="p-1">
                {rank ?? index + 1}
              </td>
              <td style={{ border: "1px solid #b96f50" }} className="truncate">
                <div className="flex items-center">
                  {playerRank && <img src={playerRank.icon} className="mx-2" />}
                  <p className="p-1">{id}</p>
                </div>
              </td>
              <td style={{ border: "1px solid #b96f50" }}>
                <div>
                  <div className="flex items-center p-1">
                    <span>{count}</span>
                    <img src={FACTION_EMBLEM_ICONS[faction]} className="h-4" />
                  </div>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
