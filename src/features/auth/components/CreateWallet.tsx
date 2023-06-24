import React, { useContext, useState } from "react";
import MetaMaskOnboarding from "@metamask/onboarding";

import { Button } from "components/ui/Button";
import { Context } from "../lib/Provider";
import { metamaskIcon } from "./WalletIcons";

import walletIcon from "src/assets/icons/wallet.png";
import { OtherWallets } from "./SignIn";

export const CreateWallet = () => {
  const { authService } = useContext(Context);
  const [page, setPage] = useState<"home" | "other">("home");

  const [showIntro, setShowIntro] = useState(true);

  const handleBack = () => {
    authService.send("BACK");
  };

  const onboarding = React.useRef<MetaMaskOnboarding>();

  React.useEffect(() => {
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  const connectToMetaMask = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      authService.send("CONNECT_TO_METAMASK");
    } else {
      onboarding.current?.startOnboarding();
    }
  };

  const MainWallets = () => {
    return (
      <>
        <Button
          className="mb-2 py-2 text-sm relative"
          onClick={connectToMetaMask}
        >
          <div className="px-8">
            {metamaskIcon}
            Metamask
          </div>
        </Button>

        <div className="bg-white b-1 w-full h-[1px] my-4" />
        <div className="flex justify-center relative pb-1">
          <span className="text-xs text-center bg-[#c28669] px-2 absolute top-[-34px] italic ">
            Or
          </span>
        </div>
        <Button
          className="mb-2 py-2 text-sm relative"
          onClick={() => authService.send("CONNECT_TO_SEQUENCE")}
        >
          <div className="px-8">
            <img
              src="https://sequence.app/static/images/sequence-logo.7c854742a6b8b4969004.svg"
              className="w-7 h-7 mobile:w-6 mobile:h-6  ml-2 mr-6 absolute left-0 top-1"
            />
            Connect with email
          </div>
        </Button>
        <Button
          className="mb-2 py-2 text-sm relative"
          onClick={() => setPage("other")}
        >
          <div className="px-8">
            <img
              src={walletIcon}
              className="h-7 mobile:h-6 ml-2.5 mr-6 absolute left-0 top-1"
            />
            Other wallets
          </div>
        </Button>
      </>
    );
  };

  if (showIntro) {
    return (
      <>
        <p className="text-center mb-3">Welcome to decentralized gaming!</p>
        <p className="text-sm text-white mb-2 text-center">
          {`To ensure the security of your valuable NFTs, it's essential to create
          a Web3 wallet.`}
        </p>
        <p className="text-sm text-white mt-2 mb-2 text-center">
          {`Setting up a wallet is easy - you can either manage your own wallet or
          quickly set one up with your email.`}
        </p>
        <Button onClick={() => setShowIntro(false)}>{`Let's go`}</Button>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col text-center items-center mt-2 mb-3">
        <p className="text-xs text-whitetext-center italic leading-3">
          Connect your own wallet
        </p>
      </div>
      {page === "home" && <MainWallets />}
      {page === "other" && <OtherWallets />}
    </>
  );
};
