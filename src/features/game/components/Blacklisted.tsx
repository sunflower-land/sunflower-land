import React, { useContext, useState } from "react";

import alert from "assets/icons/expression_alerted.png";
import suspiciousGoblin from "assets/npcs/suspicious_goblin.gif";
import { Button } from "components/ui/Button";

import * as AuthProvider from "features/auth/lib/Provider";

interface Props {
  verificationUrl?: string;
}
export const Blacklisted: React.FC<Props> = ({ verificationUrl }) => {
  const { authService } = useContext(AuthProvider.Context);
  const [showWarning, setShowWarning] = useState(false);

  if (showWarning) {
    return (
      <div className="flex flex-col items-center p-2">
        <span className="text-center">Proof of Humanity</span>
        <img src={alert} className="w-6 mt-2" />
        <span className="text-sm mt-2 mb-2">
          You will be redirected to a 3rd party service to take a quick selfie.
          Never share any personal information or crypto data.
        </span>

        <span className="text-sm mt-2 mb-2">
          While your humanity is being verified, some actions will be
          restricted.
        </span>

        <div className="flex w-full">
          <Button className="mr-2" onClick={() => authService.send("SKIP")}>
            Skip
          </Button>
          <Button
            onClick={() => {
              window.location.href = verificationUrl as string;
            }}
          >
            Verify
          </Button>
        </div>
      </div>
    );
  }

  if (verificationUrl) {
    return (
      <div className="flex flex-col items-center p-2">
        <span className="text-center">Uh oh!</span>
        <img src={suspiciousGoblin} className="w-16 mt-2" />
        <span className="text-sm mt-2 mb-2">
          The anti-bot and multi-account detection system has picked up strange
          behaviour.
        </span>
        <Button onClick={() => setShowWarning(true)}>Continue</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-center">This farm is banned</span>
      <img src={suspiciousGoblin} className="w-16 mt-2" />
      <span className="text-sm mt-2 mb-2">
        The anti-bot and multi-account detection system has picked up strange
        behaviour. Actions have been restricted.
      </span>
      <a
        href={`https://sunflowerland.freshdesk.com/support/tickets/new`}
        className="underline text-center text-sm hover:text-blue-500 mt-1 mb-2 block"
        target="_blank"
        rel="noopener noreferrer"
      >
        Please submit a ticket with details and we will get back to you.
      </a>
    </div>
  );
};
