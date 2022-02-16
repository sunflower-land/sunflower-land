import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import * as Auth from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";

export const StartFarm: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const [authState, send] = useActor(authService);

  const start = () => {
    send("START_GAME");
  };

  const explore = async () => {
    send("EXPLORE");
  };

  // We can only ever show this state if the address is not undefin
  const farmId = authState.context.farmId!;

  return (
    <>
      <p className="text-shadow text-small mb-2 px-1">Farm ID: {farmId}</p>
      <Button onClick={start} className="overflow-hidden mb-2">
        Lets go!
      </Button>
      <Button onClick={explore} className="overflow-hidden">
        {`Explore a friend's farm`}
      </Button>
    </>
  );
};
