import { LeagueLeaderboard } from "features/island/hud/components/codex/pages/LeaguesLeaderboard";
import React, { useContext, useEffect, useState } from "react";
import {
  getFinalisedLeaguesLeaderboard,
  LeaguesLeaderboard,
} from "./leaderboard/actions/leaderboard";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";

const _farmId = (state: MachineState) => state.context.farmId;
const _leagues = (state: MachineState) =>
  state.context.state.prototypes?.leagues;

export const LeagueResults: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const farmId = useSelector(gameService, _farmId);
  const leagues = useSelector(gameService, _leagues);
  const [leaguesData, setLeaguesData] = useState<
    LeaguesLeaderboard | null | undefined
  >(undefined);

  useEffect(() => {
    gameService.send("SAVE");

    const fetchLeaderboards = async () => {
      try {
        if (!leagues?.currentLeagueStartDate) return;
        const data = await getFinalisedLeaguesLeaderboard({
          farmId,
          finalisedDate: leagues.currentLeagueStartDate,
        });
        setLeaguesData(data);
      } catch (e) {
        if (!leaguesData) setLeaguesData(null);
      }
    };

    fetchLeaderboards();
  }, []);

  const onClick = () => {
    gameService.send("leagues.updated", {
      effect: { type: "leagues.updated" },
    });
  };
  const isLoading = leaguesData === undefined;

  // If the league has not started yet, show the enter the league button
  if (!leagues?.currentLeagueStartDate) {
    return (
      <>
        <div className="m-1 flex flex-col gap-2 justify-center">
          <Label type="vibrant">{`Enter the League!`}</Label>
          <p className="text-xs">{`Ready to start your league journey?`}</p>
          <p className="text-xs">{`Enter the league to start earning points and climb the ranks!`}</p>
        </div>
        <Button onClick={onClick}>{`Enter the League`}</Button>
      </>
    );
  }

  return (
    <>
      <LeagueLeaderboard isLoading={isLoading} data={leaguesData ?? null} />
      {!isLoading && <Button onClick={onClick}>{t("close")}</Button>}
    </>
  );
};
