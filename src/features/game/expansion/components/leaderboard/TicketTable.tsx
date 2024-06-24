import React from "react";
import classNames from "classnames";
import { RankData } from "./actions/leaderboard";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

interface Props {
  rankings: RankData[];
  showHeader?: boolean;
  id: string;
}

export const TicketTable: React.FC<Props> = ({
  rankings,
  id: playerId,
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
        {rankings.map(({ id, count, rank }, index) => (
          <tr
            key={index}
            className={classNames({ "bg-[#ead4aa]": id === playerId })}
          >
            <td style={{ border: "1px solid #b96f50" }} className="p-1.5 w-1/5">
              {rank ?? index + 1}
            </td>
            <td
              style={{ border: "1px solid #b96f50" }}
              className="p-1.5 truncate"
            >
              {id}
            </td>
            <td style={{ border: "1px solid #b96f50" }} className="p-1.5 w-1/5">
              {count}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
