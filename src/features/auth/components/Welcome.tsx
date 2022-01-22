import React, { useContext, useEffect, useState } from "react";
import { useActor } from "@xstate/react";

import * as Auth from "features/auth/lib/Provider";

import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";
import { metamask } from "lib/blockchain/metamask";

type Farm = {
  id: number;
  sessionId: string;
  address: string;
};

export const Welcome: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const [authState, send] = useActor(authService);

  const [isLoading, setIsLoading] = useState(true);
  const [farm, setFarm] = useState<Farm>();

  useEffect(() => {
    const load = async () => {
      const farmAccounts = await metamask.getFarm()?.getFarms();
      if (farmAccounts?.length === 0) {
        setIsLoading(false);
        return;
      }

      // V1 just support 1 farm per account - in future let them choose between the NFTs they hold
      const farmAccount = farmAccounts[0];

      const sessionId = await metamask
        .getSunflowerLand()
        .getSessionId(farmAccount.tokenId);

      setIsLoading(false);
      setFarm({
        id: farmAccount.tokenId,
        sessionId,
        address: farmAccount.account,
      });
    };

    load();
  }, []);

  const start = () => {
    console.log({ farm });
    authService.send("START", {
      farmId: farm?.id,
      sessionId: farm?.sessionId,
    });
  };

  const create = () => {
    send("CREATE_FARM");
  };

  return (
    <Panel>
      {isLoading && <span className="text-shadow">Loading your farms...</span>}
      {!isLoading && (
        <>
          {farm ? (
            <>
              <span className="text-shadow text-xs">{farm?.address}</span>
              <Button onClick={start} className="overflow-hidden">
                Lets go!
              </Button>
            </>
          ) : (
            <>
              <Button onClick={create} disabled className="overflow-hidden">
                Create a farm
              </Button>
            </>
          )}
          <Button onClick={() => {}} disabled className="overflow-hidden">
            Explore a friend's farm
          </Button>
        </>
      )}
    </Panel>
  );
};
