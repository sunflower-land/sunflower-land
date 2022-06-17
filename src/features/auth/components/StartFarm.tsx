import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import * as Auth from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";
import { CONFIG } from "lib/config";
import { Screen } from "features/auth/lib/authMachine";

export const StartFarm: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);

  const start = (screen: Screen) => {
    authService.send("START_GAME", { screen });
  };

  const explore = async () => {
    authService.send("EXPLORE");
  };

  // We can only ever show this state if the address is not undefin
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const farmId = authState.context.farmId!;

  return (
    <>
      <p className="text-shadow text-small mb-2 px-1">Farm ID: {farmId}</p>
      <Button onClick={() => start("farm")} className="overflow-hidden mb-2">
        {`Let's farm!`}
      </Button>
      {CONFIG.NETWORK === "mumbai" && (
        <Button onClick={() => start("land")} className="overflow-hidden mb-2">
          {`Land Expansion!`}
        </Button>
      )}
      <Button onClick={explore} className="overflow-hidden">
        {`Explore a friend's farm`}
      </Button>
    </>
  );
};
