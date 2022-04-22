import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import suspicious from "assets/npcs/suspicious_goblin.gif";
import idle from "assets/npcs/idle.gif";
import questionMark from "assets/icons/expression_confused.png";

import * as Auth from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";

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
      {!!authState.context.token?.userAccess.createFarm ||
      !!authState.context.token?.discordId ? (
        <Button onClick={create} className="overflow-hidden mb-2">
          Create Farm
        </Button>
      ) : (
        <div className="flex flex-col items-center">
          <div className="flex items-center mt-4 -mb-4 relative">
            <img src={suspicious} className="w-12" />
            <img
              src={idle}
              className="w-12 relative bottom-1"
              style={{ transform: "scaleX(-1)" }}
            />
            <img
              src={questionMark}
              className="absolute z-10 animate-float"
              style={{
                right: "18px",
                width: "13px",
                top: "-27px",
              }}
            />
          </div>
          <span className="text-sm text-shadow p-2 text-center mb-4">
            Beta is currently open for testers on Discord.
          </span>
          <span className="text-sm text-shadow p-2 text-center mb-2">
            Only 100,000 spots available!
          </span>
          <Button onClick={connect} className="overflow-hidden mb-2">
            Connect to Discord
          </Button>
        </div>
      )}

      <Button onClick={explore} className="overflow-hidden">
        {`Explore a friend's farm`}
      </Button>
    </>
  );
};
