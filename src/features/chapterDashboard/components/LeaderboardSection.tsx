import React from "react";
import useSWR from "swr";

import { InnerPanel } from "components/ui/Panel";
import { SectionHeader } from "./SectionHeader";
import trophy from "assets/icons/trophy.png";
import { TicketsLeaderboard } from "features/island/hud/components/codex/pages/TicketsLeaderboard";
import { Leaderboards } from "features/game/expansion/components/leaderboard/actions/cache";
import { fetchLeaderboardData } from "features/game/expansion/components/leaderboard/actions/leaderboard";

type Props = {
  farmId: number;
  token: string;
};

export const LeaderboardSection: React.FC<Props> = ({ farmId, token }) => {
  const { data, isLoading } = useSWR<Leaderboards | null>(
    farmId && token ? ["chapter-leaderboards", farmId, token] : null,
    async ([, id, authToken]: [string, number, string]) => {
      try {
        return await fetchLeaderboardData(id, authToken);
      } catch {
        return null;
      }
    },
    { revalidateOnFocus: false },
  );

  return (
    <InnerPanel className="mb-2">
      <div className="p-1 space-y-2">
        <SectionHeader title="Leaderboard" labelType="chill" icon={trophy} />
        <TicketsLeaderboard isLoading={isLoading} data={data?.tickets ?? null} />
      </div>
    </InnerPanel>
  );
};

