import React, { useContext } from "react";

import { Button } from "components/ui/Button";
import { Context } from "../lib/Provider";
import { OfferItems } from "./Offer";
import { SUNNYSIDE } from "assets/sunnyside";

export const CreateWallet = () => {
  const { authService } = useContext(Context);

  const handleBack = () => {
    authService.send("BACK");
  };

  return (
    <>
      <div className="p-2">
        <div className="flex">
          <img
            src={SUNNYSIDE.icons.arrow_left}
            className="h-5 mr-2 cursor-pointer"
            onClick={handleBack}
          />
          <div className="flex items-center mb-2">
            <img src={SUNNYSIDE.ui.green_bar_2} className="h-5 mr-2" />
            <span className="text-xs">Step 1/3</span>
          </div>
        </div>
        <p className="mb-3">Welcome to decentralized gaming!</p>
        <p className="text-sm text-white mb-2">
          {`In your travels, you will earn rare NFTs that need to be protected. To keep these secure you'll need a Web3 wallet.`}
        </p>
        <p className="text-sm text-white mt-2 mb-2">
          {`To begin your journey, your wallet will receive:`}
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
