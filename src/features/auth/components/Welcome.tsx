import React, { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";

import * as Auth from "features/auth/lib/Provider";

import { Panel } from "components/ui/Panel";
import { StartFarm } from "./StartFarm";
import { CreateFarm } from "./CreateFarm";
import { metamask } from "lib/blockchain/metamask";

import jumpingGoblin from "assets/npcs/goblin_jump.gif";
import curly from "assets/npcs/curly_hair.png";

export type Farm = {
  id: number;
  sessionId: string;
  address: string;
};

export const Welcome: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const [authState, _] = useActor(authService);

  // const [isLoading, setIsLoading] = useState(true);

  const [farm, setFarm] = useState<Farm>();

  useEffect(() => {
    const load = async () => {
      authService.send("LOADING_FARMS");
      const farmAccounts = await metamask.getFarm()?.getFarms();
      if (farmAccounts?.length === 0) {
        authService.send("FARMS_LOADED");
        return;
      }

      // V1 just support 1 farm per account - in future let them choose between the NFTs they hold
      const farmAccount = farmAccounts[0];

      const sessionId = await metamask
        .getSunflowerLand()
        .getSessionId(farmAccount.tokenId);

      setFarm({
        id: farmAccount.tokenId,
        sessionId,
        address: farmAccount.account,
      });

      authService.send("FARMS_LOADED");
      // setIsLoading(false);
    };

    load();
  }, []);

  const loadingFarms = authState.value === "loadingFarms";

  if (loadingFarms) return <div className="relative w-full h-full"></div>;

  const hasFarm = !!farm && authState.value === "ready";

  return (
    <div className="relative">
      <div className="relative w-full h-full">
        <img
          id="curly"
          src={curly}
          className="absolute w-54 -top-1 right-4 -z-10 scale-[4]"
        />
      </div>
      <img src={jumpingGoblin} className="absolute w-52 -top-11 -z-10" />
      <Panel className="p-1 mt-10">
        {/* Loading Farm */}
        {loadingFarms && (
          <span className="text-shadow">Loading your farms...</span>
        )}
        {/* Farms Loaded */}
        {!loadingFarms && (
          <div className="p-1">
            {/* Already have a farm */}
            {hasFarm ? (
              <StartFarm farm={farm} />
            ) : (
              // No Farm Create
              <CreateFarm />
            )}
          </div>
        )}
      </Panel>
    </div>
  );
};
