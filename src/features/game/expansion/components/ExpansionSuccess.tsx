import { Button } from "components/ui/Button";
import React, { useContext } from "react";

import { Context } from "features/game/GameProvider";
import { SUNNYSIDE } from "assets/sunnyside";

export const ExpansionSuccess: React.FC = () => {
  const { gameService } = useContext(Context);

  return (
    <div className="flex flex-col items-center">
      <img src={SUNNYSIDE.npcs.goblin_hammering} className="w-1/2 mb-3" />
      <span className="text-center mb-2">
        Woohoo! Your expansion is being built!
      </span>
      <Button onClick={() => gameService.send("REFRESH")}>Continue</Button>
    </div>
  );
};
