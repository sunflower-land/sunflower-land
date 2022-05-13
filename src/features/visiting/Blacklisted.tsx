import React, { useContext } from "react";

import * as AuthProvider from "features/auth/lib/Provider";

import suspiciousGoblin from "assets/npcs/suspicious_goblin.gif";
import { Button } from "components/ui/Button";

export const Blacklisted: React.FC = () => {
  const { authService } = useContext(AuthProvider.Context);

  const goBack = () => {
    authService.send("RETURN");
  };

  return (
    <div className="flex flex-col items-center p-2">
      <span className="text-shadow text-center mb-2">Something strange!</span>
      <img src={suspiciousGoblin} className="w-[15%] mb-2" />
      <span className="text-xs text-center mb-3">
        The anti-bot detection system is relatively new and has picked up some
        strange behaviour on this land.
      </span>
      <Button onClick={goBack}>Back</Button>
    </div>
  );
};
