import React, { useContext } from "react";

import suspiciousGoblin from "assets/npcs/suspicious_goblin.gif";
import { Button } from "components/ui/Button";
import { Context } from "features/game/VisitingProvider";

export const Blacklisted: React.FC = () => {
  const { gameService } = useContext(Context);

  const continueVisiting = () => {
    gameService.send("CONTINUE");
  };

  return (
    <>
      <div className="flex flex-col items-center p-2">
        <span className="text-center">Something strange!</span>
        <img src={suspiciousGoblin} className="w-16 mt-2" />
        <span className="text-sm mt-2 mb-2">
          The anti-bot detection system is relatively new and has picked up some
          strange behaviour on this land.
        </span>
      </div>
      <Button onClick={continueVisiting}>Continue Visiting</Button>
    </>
  );
};
