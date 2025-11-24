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

const _farmId = (state: MachineState) => state.context.farmId;
export const LeagueResults: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const farmId = useSelector(gameService, _farmId);
  const [leaguesData, setLeaguesData] = useState<
    LeaguesLeaderboard | null | undefined
  >(undefined);
  useEffect(() => {
    gameService.send("SAVE");

    const fetchLeaderboards = async () => {
      try {
        const data = await getFinalisedLeaguesLeaderboard({
          farmId,
          finalisedDate: new Date().toISOString().split("T")[0],
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

  return (
    <>
      <LeagueLeaderboard isLoading={isLoading} data={leaguesData ?? null} />
      {!isLoading && <Button onClick={onClick}>{t("close")}</Button>}
    </>
  );
};
