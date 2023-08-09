import React, { useState } from "react";
import { LeaderboardTable } from "./LeaderboardTable";

import { CloseButtonPanel } from "features/game/components/CloseablePanel";

import lanternIcon from "assets/icons/lantern.webp";
import dawnbreakerTicket from "assets/icons/dawn_breaker_ticket.png";
import { getRelativeTime } from "lib/utils/time";
import { LeaderboardType } from "./actions/cache";

interface Props {
  farmId: number;
  leaderboard?: LeaderboardType;
  onClose: () => void;
}

export const Leaderboard: React.FC<Props> = ({
  farmId,
  leaderboard,
  onClose,
}) => {
  const [leaderboardTab, setLeaderboardTab] = useState(0);

  if (!leaderboard)
    return (
      <CloseButtonPanel onClose={onClose}>
        <div className="p-2 text-sm">
          <p>Leaderboard coming soon..</p>
        </div>
      </CloseButtonPanel>
    );

  const { lanterns, tickets, lastUpdated } = leaderboard;

  return (
    <CloseButtonPanel
      onClose={onClose}
      tabs={[
        { icon: lanternIcon, name: "Lanterns" },
        { icon: dawnbreakerTicket, name: "Tickets" },
      ]}
      currentTab={leaderboardTab}
      setCurrentTab={setLeaderboardTab}
    >
      {leaderboardTab === 0 && (
        <div>
          <div className="p-1 mb-1 space-y-1">
            <p className="text-sm">Lanterns Leaderboard</p>
            <p className="text-[12px]">
              Last updated: {getRelativeTime(lastUpdated)}
            </p>
          </div>
          {lanterns?.topTen && (
            <LeaderboardTable
              rankings={lanterns.topTen}
              farmId={Number(farmId)}
            />
          )}
          {lanterns?.farmRankingDetails && (
            <>
              <div className="flex justify-center items-center">
                <p className="mb-[13px]">...</p>
              </div>
              <LeaderboardTable
                showHeader={false}
                rankings={lanterns.farmRankingDetails}
                farmId={Number(farmId)}
              />
            </>
          )}
        </div>
      )}
      {leaderboardTab === 1 && (
        <div>
          <div className="p-1 mb-1 space-y-1">
            <p className="text-sm">Tickets Leaderboard</p>
            <p className="text-[12px]">
              Last updated: {getRelativeTime(lastUpdated)}
            </p>
          </div>
          {tickets?.topTen && (
            <LeaderboardTable
              rankings={tickets.topTen}
              farmId={Number(farmId)}
            />
          )}
          {tickets?.farmRankingDetails && (
            <>
              <div className="flex justify-center items-center">
                <p className="mb-[13px]">...</p>
              </div>
              <LeaderboardTable
                showHeader={false}
                rankings={tickets.farmRankingDetails}
                farmId={Number(farmId)}
              />
            </>
          )}
        </div>
      )}
    </CloseButtonPanel>
  );
};
