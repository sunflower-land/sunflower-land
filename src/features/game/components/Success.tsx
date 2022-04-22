import { Button } from "components/ui/Button";
import React, { useContext } from "react";

import secure from "assets/npcs/synced.gif";
import { Context } from "../GameProvider";

export const Success: React.FC = () => {
  const { gameService } = useContext(Context);

  return (
    <div className="flex flex-col items-center">
      <img src={secure} className="w-16 my-4" />
      <span className="text-center mb-2">
        Woohoo! Your items are secured on the Blockchain!
      </span>
      <Button onClick={() => gameService.send("REFRESH")}>Continue</Button>
    </div>
  );
};
