import React, { useContext } from "react";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { Context } from "../lib/Provider";

export const Web3Missing: React.FC<{ wallet?: "PHANTOM" | "CRYPTO_COM" }> = ({
  wallet,
}) => {
  const { authService } = useContext(Context);

  const goToMetamaskSetupDocs = () => {
    window.open(
      "https://docs.sunflower-land.com/guides/getting-setup#metamask-setup",
      "_blank"
    );
  };

  const goToPhantomSetupDocs = () => {
    window.open("https://phantom.app/", "_blank");
  };

  const goToCryptoComSetupDocs = () => {
    window.open(
      "https://help.crypto.com/en/articles/5484125-wallet-extension",
      "_blank"
    );
  };

  const handleClick = () => {
    if (wallet === "PHANTOM") return goToPhantomSetupDocs();
    if (wallet === "CRYPTO_COM") return goToCryptoComSetupDocs();
    return goToMetamaskSetupDocs();
  };

  return (
    <>
      <div className="flex flex-col text-center items-center p-1">
        <div className="flex mb-3 items-center">
          <img
            src={SUNNYSIDE.icons.expression_alerted}
            alt="Warning"
            className="w-3 mr-3"
          />
        </div>
        <p className="text-center mb-3">Web3 Not Found</p>

        <p className="text-center mb-3 text-xs">
          Check out this guide to help you get started.
        </p>
      </div>
      <div className="flex space-x-1">
        <Button
          onClick={() => authService.send("REFRESH")}
          className="overflow-hidden"
        >
          <span>Go back</span>
        </Button>
        <Button onClick={handleClick} className="overflow-hidden">
          <span>Go to setup guide</span>
        </Button>
      </div>
    </>
  );
};
