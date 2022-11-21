import React, { useContext } from "react";
import lightningAnimation from "assets/npcs/human_death.gif";
import { CONFIG } from "lib/config";
import { Button } from "components/ui/Button";
import { Context } from "features/game/GameProvider";

export const ConnectingError: React.FC = () => {
  const { gameService } = useContext(Context);
  const onAcknowledge = () => {
    gameService.send("REFRESH");
  };
  return (
    <div className="flex flex-col text-center items-center p-2">
      <span>Something went wrong!</span>
      <img src={lightningAnimation} className="h-20 my-2" />
      <span className="text-xs mt-2 mb-1">
        Looks like we were unable to connect. Please refresh and try again.
      </span>
      {CONFIG.NETWORK === "mumbai" && (
        <Button onClick={onAcknowledge}>Refresh</Button>
      )}
    </div>
  );
};
