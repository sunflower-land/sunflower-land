import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import * as Auth from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";
import { shortAddress } from "features/hud/components/Address";

export const StartFarm: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const [authState, send] = useActor(authService);

  const start = () => {
    send("START_GAME");
  };

  // We can only ever show this state if the address is not undefin
  const farmAddress = authState.context.address!;

  return (
    <>
      <p className="text-shadow text-small mb-2 px-1">
        Farm: {shortAddress(farmAddress)}
      </p>
      <Button onClick={start} className="overflow-hidden mb-2">
        Lets go!
      </Button>
      <Button onClick={() => {}} disabled className="overflow-hidden">
        Explore a friend's farm
      </Button>
    </>
  );
};
