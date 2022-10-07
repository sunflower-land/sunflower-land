import React, { useContext, useState } from "react";

import alert from "assets/icons/expression_alerted.png";
import suspiciousGoblin from "assets/npcs/suspicious_goblin.gif";
import { Button } from "components/ui/Button";

import * as AuthProvider from "features/auth/lib/Provider";

interface Props {
  verificationUrl?: string;
  blacklistStatus?: "OK" | "VERIFY" | "PENDING" | "REJECTED";
}

export const Blacklisted: React.FC<Props> = ({
  verificationUrl,
  blacklistStatus,
}) => {
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

        <div className="flex w-full">
          <Button
            onClick={() => {
              window.location.href = verificationUrl as string;
            }}
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  if (blacklistStatus === "REJECTED") {
    return (
      <div className="flex flex-col items-center p-2">
        <span className="text-center">Uh oh!</span>
        <img src={suspiciousGoblin} className="w-16 mt-2" />
        <span className="text-sm mt-2 mb-2">
          You failed the Jigger Proof of Humanity.
        </span>
        <span className="text-sm mt-2 mb-2">
          You can continue playing, but some actions will be restricted while
          you are being verified.
        </span>
        <span className="text-sm mt-2 mb-2">
          Please reach out to support@usejigger.com if you beleive this was a
          mistake.
        </span>
        <div className="flex w-full">
          <Button className="mr-2" onClick={() => authService.send("SKIP")}>
            Skip
          </Button>
        </div>
      </div>
    );
  }

  if (blacklistStatus === "PENDING") {
    return (
      <div className="flex flex-col items-center p-2">
        <span className="text-center">Uh oh!</span>
        <img src={suspiciousGoblin} className="w-16 mt-2" />
        <span className="text-sm mt-2 mb-2">
          Your proof of humanity is still being processed by Jigger. This can
          take up to 2 hours.
        </span>
        <span className="text-sm mt-2 mb-2">
          You can continue playing, but some actions will be restricted while
          you are being verified.
        </span>
        <span className="text-sm mt-2 mb-2">Thank you for your patience.</span>
        <div className="flex w-full">
          <Button className="mr-2" onClick={() => authService.send("SKIP")}>
            Skip
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
          The multi-account detection system has picked up strange behaviour.
        </span>
        <span className="text-sm mt-2 mb-2">
          You can continue playing, but some actions will be restricted while
          you are being verified.
        </span>
        <div className="flex w-full">
          <Button className="mr-2" onClick={() => authService.send("SKIP")}>
            Skip
          </Button>
          <Button onClick={() => setShowWarning(true)}>Verify</Button>
        </div>
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
