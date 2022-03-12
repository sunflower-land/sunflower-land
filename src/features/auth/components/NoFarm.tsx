import React, { useContext } from "react";

import * as Auth from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";
import { useActor } from "@xstate/react";

export const NoFarm: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const [authState] = useActor(authService);

  const explore = () => {
    authService.send("EXPLORE");
  };

  const create = () => {
    authService.send("CREATE_FARM");
  };

  const connect = () => {
    authService.send("CONNECT_TO_DISCORD");
  };

  return (
    <>
      {authState.context.token ? (
        <Button onClick={create} className="overflow-hidden mb-2">
          Create Farm
        </Button>
      ) : (
        <Button onClick={connect} className="overflow-hidden mb-2">
          Connect to Discord to start
        </Button>
      )}

      <Button onClick={explore} className="overflow-hidden">
        {`Explore a friend's farm`}
      </Button>
    </>
  );
};
