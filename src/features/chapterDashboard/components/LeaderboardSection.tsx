import React from "react";
import useSWR from "swr";

import { InnerPanel } from "components/ui/Panel";
import { TicketsLeaderboard } from "features/island/hud/components/codex/pages/TicketsLeaderboard";
import {
  getLeaderboard,
  TicketLeaderboard,
} from "features/game/expansion/components/leaderboard/actions/leaderboard";
import { CONFIG } from "lib/config";
import { Loading } from "features/auth/components";
import { PlayerModal } from "features/social/PlayerModal";

type Props = {
  farmId: number;
  token: string;
};

export const LeaderboardSection: React.FC<Props> = ({ farmId, token }) => {
  const isOffline = !CONFIG.API_URL;

  const { data, isLoading } = useSWR<TicketLeaderboard | null>(
    farmId
      ? ["chapter-ticket-leaderboard", farmId, isOffline ? "offline" : "online"]
      : null,
    async ([, id]): Promise<TicketLeaderboard | null> => {
      const leaderboards = await getLeaderboard<TicketLeaderboard>({
        farmId: Number(id),
        leaderboardName: "tickets",
      });
      return leaderboards ?? null;
    },
    { revalidateOnFocus: false },
  );

  if (isLoading) {
    return (
      <InnerPanel className="mb-2">
        <div className="p-1 space-y-2">
          <Loading />
        </div>
      </InnerPanel>
    );
  }

  return (
    <>
      <PlayerModal
        loggedInFarmId={farmId}
        token={token}
        hasAirdropAccess={false}
      />
      <InnerPanel className="mb-2">
        <div className="p-1 space-y-2">
          <TicketsLeaderboard isLoading={isLoading} data={data ?? null} />
        </div>
      </InnerPanel>
    </>
  );
};
