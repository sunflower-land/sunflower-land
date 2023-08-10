import React, { useEffect, useState } from "react";
import { TicketTable } from "./TicketTable";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";

import crowFeather from "assets/icons/crow_feather.webp";
import { getRelativeTime } from "lib/utils/time";
import { Leaderboards } from "./actions/cache";
import { LeaderboardButton } from "./LeaderboardButton";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { Modal } from "react-bootstrap";
import { fetchLeaderboardData } from "./actions/leaderboard";
import { MazeTable } from "./MazeTable";

interface Props {
  farmId: number;
}

export const Leaderboard: React.FC<Props> = ({ farmId }) => {
  const [data, setData] = useState<Leaderboards | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardTab, setLeaderboardTab] = useState(0);

  useEffect(() => {
    setLoading(true);

    const fetchLeaderboards = async () => {
      try {
        const data = await fetchLeaderboardData(farmId);
        setData(data);
        setLoading(false);
      } catch (e) {
        console.error("Error loading leaderboards", e);
      }
    };

    fetchLeaderboards();
  }, []);

  const handleOpen = () => {
    setShowLeaderboard(true);
  };

  const handleClose = () => {
    setShowLeaderboard(false);
  };

  return (
    <>
      <LeaderboardButton
        loaded={!loading}
        onClick={data ? handleOpen : undefined}
      />
      {data && (
        <Modal show={showLeaderboard} onHide={handleClose} centered>
          <CloseButtonPanel
            onClose={handleClose}
            tabs={[
              { icon: crowFeather, name: "Feathers" },
              { icon: CROP_LIFECYCLE.Corn.crop, name: "Maze" },
            ]}
            currentTab={leaderboardTab}
            setCurrentTab={setLeaderboardTab}
          >
            {leaderboardTab === 0 && (
              <div>
                <div className="p-1 mb-1 space-y-1">
                  <p className="text-sm">Tickets Leaderboard</p>
                  <p className="text-[12px]">
                    Last updated: {getRelativeTime(data.lastUpdated)}
                  </p>
                </div>
                {data.tickets.topTen && (
                  <TicketTable
                    rankings={data.tickets.topTen}
                    farmId={Number(farmId)}
                  />
                )}
                {data.tickets.farmRankingDetails && (
                  <>
                    <div className="flex justify-center items-center">
                      <p className="mb-[13px]">...</p>
                    </div>
                    <TicketTable
                      showHeader={false}
                      rankings={data.tickets.farmRankingDetails}
                      farmId={Number(farmId)}
                    />
                  </>
                )}
              </div>
            )}
            {leaderboardTab === 1 && (
              <div>
                <div className="p-1 mb-1 space-y-1 text-sm">
                  <p>Maze Run Leaderboard</p>
                  <p className="text-xs">
                    Weekly SFL Burned: {data.maze.weeklySflBurned}
                  </p>
                  <p className="text-[12px]">
                    Last updated: {getRelativeTime(data.lastUpdated)}
                  </p>
                </div>
                <MazeTable
                  rankings={data.maze.topTen}
                  farmId={Number(farmId)}
                />
              </div>
            )}
          </CloseButtonPanel>
        </Modal>
      )}
    </>
  );
};
