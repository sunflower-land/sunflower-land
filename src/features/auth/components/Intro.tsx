import React, { useContext } from "react";

import * as Auth from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";
import { hasTrialFarm } from "../lib/trial";

export const Intro: React.FC = () => {
  console.log("INTOD");
  const { authService } = useContext(Auth.Context);

  const signIn = () => {
    authService.send("SKIP");
  };

  const trial = () => {
    authService.send("TRIAL");
  };

  return (
    <>
      <Button onClick={signIn}>Connect a Web3 Wallet</Button>

      <Button className="mt-2" onClick={trial}>
        {hasTrialFarm() ? "Continue farming" : "Start a new game"}
      </Button>
    </>
  );
};
