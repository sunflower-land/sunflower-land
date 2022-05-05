import { Button } from "components/ui/Button";
import React, { useContext } from "react";

import secure from "assets/npcs/synced.gif";
import { Context } from "../GoblinProvider";

export const Minted: React.FC = () => {
  const { goblinService } = useContext(Context);

  return (
    <div className="flex flex-col items-center">
      <img src={secure} className="w-16 my-4" />
      <span className="text-center mb-2">
        Your item is under construction...
      </span>
      <Button onClick={() => goblinService.send("REFRESH")}>Continue</Button>
    </div>
  );
};
