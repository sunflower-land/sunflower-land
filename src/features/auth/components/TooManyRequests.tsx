import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import { Button } from "components/ui/Button";

import humanDeath from "assets/npcs/human_death.gif";
import { Context } from "features/game/GameProvider";
import * as AuthProvider from "features/auth/lib/Provider";

export const TooManyRequests: React.FC = () => {
  const { gameService } = useContext(Context);
  const { authService } = useContext(AuthProvider.Context);
  const [authState] = useActor(authService);

  return (
    <div className="flex flex-col text-center text-shadow items-center p-1">
      <div className="flex mb-3 items-center ml-8">
        <img src={humanDeath} alt="Warning" className="w-full" />
      </div>
      <p className="text-center mb-3">Too many requests!</p>

      <p className="text-center mb-4 text-xs">
        {`Looks like you have been busy! Please try again later.`}
      </p>
      {/* {
        // Only show when playing
        authState.matches({ connected: "authorised" }) &&  (
          <Button onClick={() => gameService.send("CONTINUE")}>
            Keep playing
          </Button>
        )
      } */}
    </div>
  );
};
