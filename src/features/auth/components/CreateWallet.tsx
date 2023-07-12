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
      <p className="mb-3 text-center">Welcome to decentralized gaming!</p>
      <p className="text-sm text-white mb-2">
        {`To ensure the security of your valuable NFTs, it's essential to create
          a Web3 wallet.`}
      </p>
      <p className="text-sm text-white mt-2 mb-2">
        {`Setting up a wallet is easy - you can either manage your own wallet or
          quickly set one up with your email.`}
      </p>
      <Button
        onClick={() => {
          authService.send("CONTINUE");
        }}
      >{`Let's go`}</Button>
    </>
  );
};
