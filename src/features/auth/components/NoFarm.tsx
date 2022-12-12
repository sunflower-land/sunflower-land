import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import * as Auth from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";

export const NoFarm: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);

  const explore = () => {
    authService.send("EXPLORE");
  };

  const create = () => {
    authService.send("CHOOSE_CHARITY");
  };

  const connect = () => {
    authService.send("CONNECT_TO_DISCORD");
  };

  return (
    <>
      <Button onClick={create} className="overflow-hidden mb-2">
        Create Farm
      </Button>

      <Button onClick={explore} className="overflow-hidden">
        {`Explore a friend's farm`}
      </Button>
    </>
  );
};
