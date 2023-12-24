import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { LeaderboardButton } from "features/game/expansion/components/leaderboard/LeaderboardButton";
import { TicketTable } from "features/game/expansion/components/leaderboard/TicketTable";
import { RankData } from "features/game/expansion/components/leaderboard/actions/leaderboard";
import trophy from "assets/icons/trophy.png";

interface Props {
  farmId: number;
}

interface LeaderboardData {
  topTen: RankData[];
  farmRankingDetails?: RankData[];
}

export const Leaderboard: React.FC<Props> = ({ farmId }) => {
  const [data, setData] = useState<LeaderboardData>();
  const [loading, setLoading] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardTab, setLeaderboardTab] = useState(0);

  useEffect(() => {
    // TODO load leaderboard data
    // setLoading(true);
    // const fetchLeaderboards = async () => {
    //   try {
    //     const data = await fetchLeaderboardData(farmId);
    //     setData(data);
    //     setLoading(false);
    //   } catch (e) {
    //     // eslint-disable-next-line no-console
    //     console.error("Error loading leaderboards", e);
    //   }
    // };
    // fetchLeaderboards();
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
              {
                icon: trophy,
                name: "Leaderboard",
              },
            ]}
            currentTab={leaderboardTab}
            setCurrentTab={setLeaderboardTab}
          >
            {leaderboardTab === 0 && (
              <div>
                {data.topTen && (
                  <TicketTable rankings={data.topTen} farmId={farmId} />
                )}
                {data.farmRankingDetails && (
                  <>
                    <div className="flex justify-center items-center">
                      <p className="mb-[13px]">...</p>
                    </div>
                    <TicketTable
                      showHeader={false}
                      rankings={data.farmRankingDetails}
                      farmId={farmId}
                    />
                  </>
                )}
              </div>
            )}
          </CloseButtonPanel>
        </Modal>
      )}
    </>
  );
};
