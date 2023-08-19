import React, { useContext } from "react";

import { Context } from "../GameProvider";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";

export const Traded: React.FC = () => {
  const { gameService } = useContext(Context);

  function onAcknowledge() {
    gameService.send("CONTINUE");
  }

  return (
    <div className="p-2">
      <img src={SUNNYSIDE.icons.confirm} className="mx-auto w-1/5 my-2" />
      <p className="text-sm mb-2 text-center">
        Congratulations, your trade was successful
      </p>
      <Button onClick={onAcknowledge}>Continue</Button>
    </div>
  );
};
