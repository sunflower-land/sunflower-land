import React, { useContext, useEffect, useState } from "react";
import lightningAnimation from "assets/npcs/human_death.gif";

import * as Auth from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";
import { useActor } from "@xstate/react";
import { CONFIG } from "lib/config";
import { createErrorLogger } from "lib/errorLogger";

interface BoundaryErrorProps {
  farmId?: number;
  error?: string;
  stack?: string;
  transactionId?: string;
  onAcknowledge?: () => void;
}

/*
 * This component should not hook into the state machines. It is used
 * to display errors that may occur outside of the state machines.
 */
export const BoundaryError: React.FC<BoundaryErrorProps> = ({
  farmId,
  error,
  transactionId,
  onAcknowledge,
  stack,
}) => {
  const [date] = useState(new Date().toISOString());
  const [showStackTrace, setShowStackTrace] = useState(false);

  useEffect(() => {
    const errorLogger = createErrorLogger("react_error_modal", farmId ?? 0);
    errorLogger({ error, transactionId, stack, date });
  }, []);

  if (error?.includes("Returned values aren't valid")) {
    return (
      <>
        <div className="p-2">
          <h1 className="mb-1 text-lg text-center">Client RPC Error</h1>
          <div className="w-full mb-1 flex justify-center">
            <img src={lightningAnimation} className="h-20" />
          </div>
          <div className="space-y-3 text-sm mb-3">
            <p>Please try again or check your Polygon RPC settings.</p>
          </div>
        </div>
        {onAcknowledge && <Button onClick={onAcknowledge}>Refresh</Button>}
      </>
    );
  }

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
              href="https://sunflowerland.freshdesk.com"
              target="_blank"
              rel="noopener noreferrer"
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
        <div className="flex flex-col w-full text-left mb-2 text-[12px] overflow-hidden">
          {farmId && <p className="leading-3">Farm: {farmId}</p>}
          {error && (
            <p className="leading-3 whitespace-nowrap">Error: {error}</p>
          )}
          {transactionId && (
            <p className="leading-3">Transaction ID: {transactionId}</p>
          )}
          <p className="leading-3">Date: {date}</p>
          <p className="leading-3">Version: {CONFIG.RELEASE_VERSION}</p>
          {stack && showStackTrace && (
            <>
              <p className="leading-3">Details:</p>
              <pre className="leading-3 whitespace-pre-wrap text-[10px]">{`${stack}`}</pre>
            </>
          )}
        </div>
      </div>
      {stack && !showStackTrace && (
        <Button onClick={() => setShowStackTrace(true)}>
          Diagnostic Information
        </Button>
      )}
      {onAcknowledge && <Button onClick={onAcknowledge}>Refresh</Button>}
    </>
  );
};

export const SomethingWentWrong: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const { gameService } = useContext(Context);

  const { farmId } = authService.state.context.user;
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
    <BoundaryError
      farmId={farmId}
      transactionId={transactionId}
      error={errorCode}
      onAcknowledge={onAcknowledge}
    />
  );
};
