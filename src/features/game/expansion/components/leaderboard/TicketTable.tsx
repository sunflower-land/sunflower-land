import React from "react";
import classNames from "classnames";
import { RankData } from "./actions/leaderboard";

interface Props {
  rankings: RankData[];
  showHeader?: boolean;
  farmId: number;
}

export const TicketTable: React.FC<Props> = ({
  rankings,
  farmId,
  showHeader = true,
}) => {
  return (
    <table className="w-full text-xs table-fixed border-collapse p-">
      {showHeader && (
        <thead>
          <tr>
            <th style={{ border: "1px solid #b96f50" }} className="p-1.5 ">
              <p>Rank</p>
            </th>
            <th style={{ border: "1px solid #b96f50" }} className="p-1.5">
              <p>Farm</p>
            </th>
            <th style={{ border: "1px solid #b96f50" }} className="p-1.5">
              <p>Total</p>
            </th>
          </tr>
        </thead>
      )}
      <tbody>
        {rankings.map(({ id, count, rank }, index) => (
          <tr
            key={index}
            className={classNames({ "text-green-400": id === farmId })}
          >
            <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
              {rank ?? index + 1}
            </td>
            <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
              {id}
            </td>
            <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
              {count}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
