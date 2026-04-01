import { Loading } from "features/auth/components";
import React, { useContext } from "react";
import { collectionFetcher } from "./Collection";
import useSWR from "swr";
import { CONFIG } from "lib/config";
import * as Auth from "features/auth/lib/Provider";
import { useActor, useSelector } from "@xstate/react";
import { InnerPanel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { hasFeatureAccess } from "lib/flags";
import { MinigamesLeaderboard } from "./MinigamesLeaderboard";
import type { Tradeable } from "features/game/types/marketplace";
import { useTranslation } from "react-i18next";

const _state = (state: MachineState) => state.context.state;

export const Minigames: React.FC = () => {
  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);
  const playerEconomiesAllowed = hasFeatureAccess(state, "PLAYER_ECONOMIES");
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);
  const { t } = useTranslation();
  const token = authState.context.user.rawToken as string;

  const { data, isLoading, error } = useSWR(
    playerEconomiesAllowed && CONFIG.API_URL ? ["economies", token] : null,
    collectionFetcher,
  );

  if (!playerEconomiesAllowed) {
    return (
      <InnerPanel className="h-full flex items-center justify-center p-4">
        <p className="text-sm text-center">
          {t("marketplace.minigames.notAvailable")}
        </p>
      </InnerPanel>
    );
  }

  if (error) throw error;

  if (isLoading) {
    return (
      <InnerPanel className="h-full flex ">
        <Loading />
      </InnerPanel>
    );
  }

  const items = (data?.items ?? []).filter(
    (i): i is Extract<Tradeable, { collection: "economies" }> =>
      i.collection === "economies",
  );

  return <MinigamesLeaderboard items={items} />;
};
