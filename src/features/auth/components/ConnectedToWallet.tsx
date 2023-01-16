import React, { useContext } from "react";

import * as Auth from "features/auth/lib/Provider";

import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";

export const ConnectedToWallet: React.FC = () => {
  const { authService } = useContext(Auth.Context);

  const signIn = () => {
    authService.send("SIGN");
  };

  return (
    <>
      <div className="flex flex-col items-center text-center p-2">
        <span>Wallet Connected!</span>
        <img src={SUNNYSIDE.npcs.idle} alt="Warning" className="w-8 m-2" />
        <span className="text-sm mt-2 mb-2">
          Your wallet has been successfully connected!
          <br />
          <br />
          Use your wallet to sign in to Sunflower Land.
        </span>
      </div>
      <Button className="mt-2" onClick={signIn}>
        Sign In
      </Button>
    </>
  );
};
