import React, { useContext } from "react";
import lightningAnimation from "assets/npcs/human_death.gif";
import discord from "src/assets/skills/discord.png";
import token from "src/assets/icons/token.png";

import * as Auth from "features/auth/lib/Provider";

import { CONFIG } from "lib/config";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";

export const ConnectingError: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const { gameService } = useContext(Context);
  const [
    {
      context: {
        transactionId,
        errorCode,
        state: { id: landId },
      },
    },
  ] = useActor(gameService);

  const onAcknowledge = () => {
    // If we get a connecting error before the game has loaded then try to connect again via the authService
    if (gameService) {
      gameService.send("REFRESH");
    } else {
      authService.send("REFRESH");
    }
  };
  return (
    <div className="flex flex-col text-center items-center p-2">
      <span>Something went wrong!</span>
      <img src={lightningAnimation} className="h-20 my-2" />
      <span className="text-xs mt-2 mb-1">
        Looks like we were unable to connect. Please refresh and try again.
      </span>

      <div className="flex flex-col w-full text-left mt-8 mb-2">
        {/* <span className="mb-4">Need Help?</span> */}

        <div className="flex items-center">
          <img src={token} className="w-6 mr-2" />
          <div className="flex justify-between w-full">
            <span className="text-xs">Get Support</span>
            <a
              className="text-xs underline"
              href="https://sunflowerland.freshdesk.com"
            >
              sunflowerland.freshdesk.com
            </a>
          </div>
        </div>

        <div className="flex items-center mt-1">
          <img src={discord} className="w-6 mr-2" />
          <div className="flex justify-between w-full">
            <span className="text-xs">Discord Community</span>
            <a
              className="text-xs underline"
              href="https://discord.gg/sunflowerland"
            >
              discord.gg/sunflowerland
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full text-left mb-2 mt-4">
        {landId && <span className="text-xxs mb-1">Land: {landId}</span>}
        {errorCode && <span className="text-xxs mb-1">Error: {errorCode}</span>}
        {transactionId && (
          <span className="text-xxs mb-1">Transaction ID: {transactionId}</span>
        )}
        <span className="text-xxs mb-1">Date: {new Date().toISOString()}</span>
      </div>
      {CONFIG.NETWORK === "mumbai" && (
        <Button onClick={onAcknowledge}>Refresh</Button>
      )}
    </div>
  );
};
