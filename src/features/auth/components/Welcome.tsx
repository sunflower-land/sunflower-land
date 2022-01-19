import React, { useContext } from "react";
import { useActor } from "@xstate/react";

import * as Auth from "features/auth/lib/Provider";

import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

export const Welcome: React.FC = () => {
  const { authService } = useContext(Auth.Context);
  const [authState, send] = useActor(authService);

  const start = () => {
    send("SIGN");
  };

  return (
    <Panel>
      <Button onClick={start}>Let's go!</Button>
    </Panel>
  );
};
