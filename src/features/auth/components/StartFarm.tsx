import React, { useContext } from "react";
import { Button } from "components/ui/Button";

import * as Auth from "features/auth/lib/Provider";
import { shortAddress } from "features/hud/components/Address";
import { Farm } from "./Welcome";

interface Props {
  farm: Farm;
}

export const StartFarm: React.FC<Props> = ({ farm }) => {
  const { authService } = useContext(Auth.Context);

  const start = () => {
    authService.send("START", {
      farmId: farm?.id,
      sessionId: farm?.sessionId,
    });
  };

  return (
    <>
      <p className="text-shadow text-xs mb-2 px-1">
        Farm Address: {shortAddress(farm?.address)}
      </p>
      <Button onClick={start} className="overflow-hidden mb-2">
        Lets go!
      </Button>
      <Button onClick={() => {}} disabled className="overflow-hidden">
        Explore a friend's farm
      </Button>
    </>
  );
};
