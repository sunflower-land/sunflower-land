import React, { useEffect, useState } from "react";
import femaleHuman from "assets/npcs/human_female.gif";
import maleHuman from "assets/npcs/idle.gif";
import maleGoblin from "assets/npcs/goblin.gif";
import femaleGoblin from "assets/npcs/goblin_female.gif";
import sword from "assets/icons/sword.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Panel } from "components/ui/Panel";

interface Points {
  goblinTeam: { total: number; percentage: number };
  humanTeam: { total: number; percentage: number };
}

export const Leaderboard: React.FC = () => {
  const [warPoints, setWarPoints] = useState<Points>({
    goblinTeam: { total: 0, percentage: 0 },
    humanTeam: { total: 0, percentage: 0 },
  });
  const [loading, setLoading] = useState<boolean>(false);
  const getValues = async () => {
    setLoading(true);
    const response = await window.fetch(
      "https://api.sacul.cloud/sfl/war/stats",
      {
        method: "GET",
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      }
    );

    const {
      data: { goblinWarPoints, humanWarPoints },
    } = await response.json();

    if (goblinWarPoints && humanWarPoints) {
      const goblinPoints = Number(goblinWarPoints);
      const humanPoints = Number(humanWarPoints);
      const total = humanPoints + goblinPoints;
      setWarPoints({
        humanTeam: {
          total: humanPoints,
          percentage: (humanPoints / total) * 100,
        },
        goblinTeam: {
          total: goblinPoints,
          percentage: (goblinPoints / total) * 100,
        },
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    getValues();
  }, []);

  return (
    <>
      <div className="flex justify-between w-full px-8">
        <div className={"flex h-fit"}>
          <img
            src={femaleHuman}
            style={{
              width: `${PIXEL_SCALE * 13}px`,
              height: `${PIXEL_SCALE * 20}px`,
            }}
            alt=""
          />
          <img
            src={maleHuman}
            alt=""
            style={{
              width: `${PIXEL_SCALE * 13}px`,
              height: `${PIXEL_SCALE * 20}px`,
            }}
          />
        </div>
        <div className="relative w-14">
          <img
            src={sword}
            alt=""
            className="absolute"
            style={{
              width: "36px",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
          <img
            src={sword}
            alt=""
            className="absolute left-1/2 -translate-x-1/2 top-1"
            style={{
              width: "36px",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%) scaleX(-1)",
            }}
          />
        </div>
        <div
          className="flex items-end"
          style={{
            transform: "scaleX(-1)",
          }}
        >
          <img
            src={femaleGoblin}
            alt=""
            style={{
              width: `${PIXEL_SCALE * 16}px`,
              height: `${PIXEL_SCALE * 18}px`,
            }}
          />
          <img
            src={maleGoblin}
            alt=""
            style={{
              width: `${PIXEL_SCALE * 16}px`,
              height: `${PIXEL_SCALE * 18}px`,
            }}
          />
        </div>
      </div>
      <Panel>
        <div className="flex">
          {warPoints?.humanTeam.total > 0 && (
            <div
              className="bg-yellow-500 flex justify-center text-xs h-7 min-h-7 pt-1.5"
              style={{
                width: `${warPoints?.humanTeam?.percentage}%`,
              }}
            >
              {warPoints?.humanTeam?.percentage.toFixed(1)}%
            </div>
          )}
          {warPoints?.goblinTeam.total > 0 && (
            <div
              className="bg-green-900 flex justify-center text-xs h-7 min-h-7 pt-1.5"
              style={{
                width: `${warPoints?.goblinTeam?.percentage}%`,
              }}
            >
              {warPoints?.goblinTeam?.percentage.toFixed(1)}%
            </div>
          )}
          {loading && (
            <div className={"loading w-full text-center"}>Loading</div>
          )}
        </div>
      </Panel>
      <div className="flex justify-between px-3">
        <div>{warPoints?.humanTeam.total}</div>
        <div>{warPoints?.goblinTeam.total}</div>
      </div>
    </>
  );
};
