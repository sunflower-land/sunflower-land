import React, { useContext } from "react";
import lightningAnimation from "assets/npcs/human_death.gif";

import * as Auth from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";

export const SomethingWentWrong: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const { gameService } = useContext(Context);

  const { farmId: landId } = authService.state.context;
  // If we get a connecting error before the game has loaded then try to connect again via the authService
  const service = gameService ?? authService;

  const [
    {
      context: { transactionId, errorCode },
    },
  ] = useActor(service);

  const onAcknowledge = () => {
    service.send("REFRESH");
  };

  return (
    <>
      <div className="p-2">
        <h1 className="mb-1 text-lg text-center">Something went wrong</h1>
        <div className="w-full mb-1 flex justify-center">
          <img src={lightningAnimation} className="h-20" />
        </div>
        <div className="space-y-3 text-sm mb-3">
          <p>It looks like we were unable to complete this request.</p>
          <p>It may be a simple connection issue.</p>
          <p>You can click refresh to try again.</p>
          <p>
            If the issue remains, you can reach out for help by either
            contacting our{" "}
            <a
              className="underline"
              target="_blank"
              href="https://sunflowerland.freshdesk.com"
              rel="noreferrer"
            >
              support team{" "}
            </a>
            or jumping over to our{" "}
            <a
              className="underline"
              target="_blank"
              href="https://discord.gg/sunflowerland"
              rel="noreferrer"
            >
              discord
            </a>{" "}
            and asking our community.
          </p>
        </div>
        <div className="flex flex-col w-full text-left mb-2 text-[12px]">
          {landId && <p className="leading-3">Land: {landId}</p>}
          {errorCode && <p className="leading-3">Error: {errorCode}</p>}
          {transactionId && (
            <p className="leading-3">Transaction ID: {transactionId}</p>
          )}
          <p className="leading-3">Date: {new Date().toISOString()}</p>
        </div>
      </div>
      <Button onClick={onAcknowledge}>Refresh</Button>
    </>
  );
};
