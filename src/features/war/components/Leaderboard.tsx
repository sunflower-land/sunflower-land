import React, { useEffect, useState } from "react";
import femaleHuman from "assets/npcs/human_female.gif";
import maleHuman from "assets/npcs/idle.gif";
import maleGoblin from "assets/npcs/goblin.gif";
import femaleGoblin from "assets/npcs/goblin_female.gif";
import sword from "assets/icons/sword.png";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { metamask } from "lib/blockchain/metamask";
import { CONFIG } from "lib/config";

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
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const getValues = async () => {
    // End of Week 1 points
    const startOfWeekPoints =
      CONFIG.NETWORK === "mainnet"
        ? {
            humans: 344445 + 317926 + 887742 + 645091 + 415252,
            goblins: 354890 + 278205 + 913198 + 622151 + 388132,
          }
        : { humans: 0, goblins: 0 };

    setLoading(true);
    const totalSupply = await metamask.getInventory().totalSupply();
    const humanWarPoints = totalSupply["Human War Point"];
    const goblinWarPoints = totalSupply["Goblin War Point"];

    if (goblinWarPoints && humanWarPoints) {
      const goblinPoints = Number(goblinWarPoints) - startOfWeekPoints.goblins;
      const humanPoints = Number(humanWarPoints) - startOfWeekPoints.humans;
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
    <div
      className={`fixed w-80 lg:w-96 z-[99999] bottom-4`}
      style={{
        transform: `translateY(${isOpen ? "9px" : "200px"}) translateX(-50%)`,
        transition: "all .3s ease-in-out",
        left: "50%",
      }}
    >
      <Button
        className={`w-12 h-6  -mt-2 absolute left-1/2 -translate-x-1/2 ${
          isOpen ? "-top-5" : "-top-7"
        } z-10`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative w-7">
          <img
            src={sword}
            alt=""
            className="absolute"
            style={{
              width: "18px",
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
              width: "18px",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%) scaleX(-1)",
            }}
          />
        </div>
      </Button>
      <Panel>
        <div className="flex justify-between w-full px-8 mb-16">
          <div className={"flex h-fit"}>
            <img
              src={femaleHuman}
              style={{
                height: `${PIXEL_SCALE * 20}px`,
              }}
              alt=""
            />
            <img
              src={maleHuman}
              alt=""
              style={{
                height: `${PIXEL_SCALE * 20}px`,
              }}
            />
          </div>
          <div className="absolute w-14 left-1/2 -translate-x-1/2 top-11">
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
                height: `${PIXEL_SCALE * 18}px`,
              }}
            />
            <img
              src={maleGoblin}
              alt=""
              style={{
                height: `${PIXEL_SCALE * 18}px`,
              }}
            />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "0",
            width: "92%",
            transform: `translateY(${
              !isOpen ? "0px" : "70px"
            }) translateX(-50%)`,
            transition: "all 0.4s ease-in-out",
            zIndex: "50",
          }}
        >
          <Panel>
            <div
              className={`flex h-fit relative ${
                !isOpen && "absolute -top-8 rounded"
              }`}
              style={{
                transition: "all 0.1s ease-in-out",
                border: !isOpen ? "1px solid black" : "",
              }}
            >
              {warPoints?.humanTeam.total > 0 && (
                <div
                  className="bg-yellow-500 flex justify-center h-7 text-xs pt-1.5"
                  style={{
                    width: `${warPoints?.humanTeam?.percentage}%`,
                  }}
                >
                  {warPoints?.humanTeam?.percentage.toFixed(1)}%
                </div>
              )}
              {warPoints?.goblinTeam.total > 0 && (
                <div
                  className="bg-green-900 flex justify-center h-7 text-xs  pt-1.5"
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
        </div>
        <div className="flex justify-between px-3">
          <div>{warPoints?.humanTeam.total}</div>
          <div>{warPoints?.goblinTeam.total}</div>
        </div>
      </Panel>
    </div>
  );
};
