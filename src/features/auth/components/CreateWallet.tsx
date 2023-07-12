import React, { useContext } from "react";

import { Button } from "components/ui/Button";
import { Context } from "../lib/Provider";
import { OfferItems } from "./Offer";

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
          {`In your travels, you will earn rare NFTs that need to be protected. To keep these secure you'll need a Web3 wallet.`}
        </p>
        <p className="text-sm text-white mt-2 mb-2">
          {`To begin your journey, you will receive`}
        </p>
        <OfferItems />
      </div>
      <Button
        onClick={() => {
          authService.send("CONTINUE");
        }}
      >{`Let's go`}</Button>
    </>
  );
};
