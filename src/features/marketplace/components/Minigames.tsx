import { Loading } from "features/auth/components";
import React, { useContext } from "react";
import useSWR from "swr";
import { CONFIG } from "lib/config";
import * as Auth from "features/auth/lib/Provider";
import { useActor, useSelector } from "@xstate/react";
import { InnerPanel } from "components/ui/Panel";
import { Context } from "features/game/GameProvider";
import { MachineState } from "features/game/lib/gameMachine";
import { hasFeatureAccess } from "lib/flags";
import { MinigamesLeaderboard } from "./MinigamesLeaderboard";
import { EconomyMinigamesPlayerLeaderboard } from "./EconomyMinigamesPlayerLeaderboard";
import {
  marketplaceEconomiesPageFetcher,
  marketplaceEconomiesPageSwrKey,
} from "../actions/loadEconomiesMarketplaceData";
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

  const swrKey =
    playerEconomiesAllowed && CONFIG.API_URL
      ? marketplaceEconomiesPageSwrKey(token)
      : null;

  const { data, isLoading, error } = useSWR(
    swrKey,
    marketplaceEconomiesPageFetcher,
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

  const items = data?.items ?? [];
  const minigameRanks = data?.economyMinigameRanks ?? [];

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="flex min-h-0 flex-1 flex-col gap-1">
        <p className="shrink-0 px-1 text-xs font-medium text-brown-800">
          {t("marketplace.economies.tradingSectionTitle")}
        </p>
        <div className="min-h-0 flex-1">
          <MinigamesLeaderboard
            items={items}
            panelClassName="h-full max-h-full"
          />
        </div>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-1">
        <p className="shrink-0 px-1 text-xs font-medium text-brown-800">
          {t("marketplace.economies.minigamesSectionTitle")}
        </p>
        <div className="min-h-0 flex-1">
          <EconomyMinigamesPlayerLeaderboard
            ranks={minigameRanks}
            panelClassName="h-full max-h-full"
          />
        </div>
      </div>
    </div>
  );
};
