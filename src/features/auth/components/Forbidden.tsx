import React, { useContext } from "react";

import * as Auth from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";
import suspiciousGoblin from "assets/npcs/suspicious_goblin.gif";

export const Forbidden: React.FC = () => {
  const { authService } = useContext(Auth.Context);

  const goHome = () => {
    authService.send("RETURN");
  };

  return (
    <div className="flex flex-col items-center text-center p-2">
      <span>Forbidden !</span>
      <img src={suspiciousGoblin} alt="Warning" className="w-16 m-2" />
      <span className="text-xs mt-2 mb-2">
        You are not allowed to visit Goblin Village!
      </span>
      <Button className="mt-2" onClick={goHome}>
        Back
      </Button>
    </div>
  );
};
