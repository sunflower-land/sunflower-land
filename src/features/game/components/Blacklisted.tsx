import React, { useContext } from "react";

import * as AuthProvider from "features/auth/lib/Provider";

import suspiciousGoblin from "assets/npcs/suspicious_goblin.gif";
import { Button } from "components/ui/Button";

export const Blacklisted: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);

  const continuePlaying = () => {
    authService.send("CONTINUE");
  };

  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-shadow text-center">Something strange!</span>
      <img src={suspiciousGoblin} className="w-1/4 mt-2" />
      <span className="text-shadow text-xs text-center mt-2 mb-2">
        The anti-bot detection system is relatively new and has picked up some
        strange behaviour. Some actions may be temporarily restricted.
      </span>
      <a
        href={`https://forms.gle/ajhNS6kr3c6U3YLT9`}
        className="underline text-center text-xs hover:text-blue-500 mt-1 mb-2 block"
        target="_blank"
        rel="noopener noreferrer"
      >
        Share details to help us improve our system
      </a>
      <Button onClick={continuePlaying}>Continue Playing</Button>
    </div>
  );
};
