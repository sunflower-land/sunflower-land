import React from "react";
import classNames from "classnames";
import { MazeAttemptStat } from "./actions/leaderboard";
import { SUNNYSIDE } from "assets/sunnyside";

interface Props {
  rankings: MazeAttemptStat[];
  farmId: number;
}

export const MazeTable: React.FC<Props> = ({ rankings, farmId }) => {
  return (
    <table className="w-full text-xs table-fixed border-collapse p-">
      <thead>
        <tr>
          <th style={{ border: "1px solid #b96f50" }} className="p-1.5 ">
            <p>Rank</p>
          </th>
          <th style={{ border: "1px solid #b96f50" }} className="p-1.5">
            <p>Farm</p>
          </th>
          <th style={{ border: "1px solid #b96f50" }} className="p-1.5">
            <p>Time</p>
          </th>
          <th style={{ border: "1px solid #b96f50" }} className="p-1.5">
            <p>Health</p>
          </th>
        </tr>
      </thead>
      <tbody>
        {rankings.map(({ id, rank, time, health }, index) => (
          <tr
            key={index}
            className={classNames({ "text-green-400": Number(id) === farmId })}
          >
            <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
              {rank}
            </td>
            <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
              {id}
            </td>
            <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
              {time}
            </td>
            <td style={{ border: "1px solid #b96f50" }} className="p-1.5">
              <div className="flex space-x-1 items-center">
                {Array.from({ length: health }).map((_, index) => (
                  <img
                    key={index}
                    src={SUNNYSIDE.icons.heart}
                    className="w-4"
                  />
                ))}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
