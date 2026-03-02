import React, { useContext, useEffect, useState } from "react";
import {
  getLeaguesLeaderboard,
  LeaguesLeaderboard,
} from "./leaderboard/actions/leaderboard";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { Button } from "components/ui/Button";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";
import { LeagueLeaderboard } from "features/island/hud/components/codex/pages/LeaguesLeaderboard";
import * as AuthProvider from "features/auth/lib/Provider";
import { AuthMachineState } from "features/auth/lib/authMachine";

const _farmId = (state: MachineState) => state.context.farmId;
const _leagues = (state: MachineState) =>
  state.context.state.prototypes?.leagues;

const _username = (state: MachineState) => state.context.state.username;
const _token = (state: AuthMachineState) =>
  state.context.user.rawToken as string;

export const LeagueResults: React.FC = () => {
  const { gameService } = useContext(Context);
  const { t } = useAppTranslation();
  const farmId = useSelector(gameService, _farmId);
  const leagues = useSelector(gameService, _leagues);
  const username = useSelector(gameService, _username);
  const { authService } = useContext(AuthProvider.Context);
  const token = useSelector(authService, _token);
  const [leaguesData, setLeaguesData] = useState<
    LeaguesLeaderboard | null | undefined
  >(undefined);

  useEffect(() => {
    if (!leagues?.id) {
      return;
    }

    const leagueId = leagues.id;
    gameService.send({ type: "SAVE" });

    const fetchLeaderboards = async () => {
      try {
        const data = await getLeaguesLeaderboard({
          farmId,
          leagueId,
          token,
        });

        setLeaguesData(data ?? null);
      } catch (e) {
        setLeaguesData(null);
      }
    };

    fetchLeaderboards();
  }, [farmId, gameService, leagues?.id]);

  const onClick = () => {
    gameService.send("leagues.updated", {
      effect: { type: "leagues.updated" },
    });
  };
  const isLoading = leaguesData === undefined;

  // If the league has not started yet, show the enter the league button
  if (!leagues?.id) {
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
    <div className="flex flex-col gap-2">
      <LeagueLeaderboard
        isLoading={isLoading}
        data={leaguesData ?? null}
        username={username}
        farmId={farmId}
      />
      {!isLoading && <Button onClick={onClick}>{t("close")}</Button>}
    </div>
  );
};
