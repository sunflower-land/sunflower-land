import React, { useContext } from "react";

import * as Auth from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";

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
    <div className="w-2/3 m-auto py-2 flex flex-col items-center">
      <Button className="mb-2" onClick={trial}>
        Play now
      </Button>

      <p className="text-xs mb-2">Or</p>
      <p className="text-xs center underline cursor-pointer">
        Connect to Web3 Account
      </p>
    </div>
  );
};
