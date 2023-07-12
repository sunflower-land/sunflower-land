import React, { useContext } from "react";

import { Button } from "components/ui/Button";
import { Context } from "../lib/Provider";

export const CreateWallet = () => {
  const { authService } = useContext(Context);

  const handleBack = () => {
    authService.send("BACK");
  };

  return (
    <>
      <div className="p-2">
        <p className="mb-3">Welcome to decentralized gaming!</p>
        <p className="text-sm text-white mb-2">
          {`In Sunflower Land you will craft and collect rare NFTs. To keep these secure you'll need a Web3 wallet.`}
        </p>
        <p className="text-sm text-white mt-2 mb-2">
          {`Setting up a wallet is easy - you can manage one yourself or
          set up with email.`}
        </p>
      </div>
      <Button
        onClick={() => {
          authService.send("CONTINUE");
        }}
      >{`Let's go`}</Button>
    </>
  );
};
