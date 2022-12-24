import React, { useContext } from "react";

import * as Auth from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";

export const Intro: React.FC = () => {
  console.log("INTOD");
  const { authService } = useContext(Auth.Context);

  const signIn = () => {
    authService.send("SKIP");
  };

  const startTrial = () => {
    authService.send("TRIAL");
  };

  return (
    <>
      <Button onClick={signIn}>Sign In</Button>
      <Button className="mt-2" onClick={startTrial}>
        Start a new game
      </Button>
    </>
  );
};
