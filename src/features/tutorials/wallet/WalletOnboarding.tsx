import React, { useContext, useState } from "react";
import { sequence } from "0xsequence";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { SEQUENCE_CONNECT_OPTIONS } from "features/auth/lib/sequence";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Equipped } from "features/game/types/bumpkin";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { Context as AuthContext } from "features/auth/lib/Provider";

import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { login } from "features/auth/actions/login";
import { wallet } from "lib/blockchain/wallet";

interface Props {
  bumpkinParts: Equipped;
  onClose: () => void;
}

type Step = 1 | 2 | 3 | 4;

type ModalContent = {
  title: string;
  icon: React.ReactNode;
  text: React.ReactNode;
  buttonText: string;
};

export const WalletOnboarding: React.FC<Props> = ({
  bumpkinParts,
  onClose,
}) => {
  const { authService } = useContext(AuthContext);

  const [currentStep, setCurrentStep] = useState<Step>(1);

  const STEPS: Record<Step, ModalContent> = {
    1: {
      title: "Ready to expand?",
      icon: (
        <img
          src={SUNNYSIDE.icons.expand}
          width={16 * PIXEL_SCALE}
          className="mx-auto mb-3"
        />
      ),
      text: (
        <>
          <p>
            {`Amazing progress! It looks like you're having a great time working on
            this piece of land. But did you know that you can actually own this
            farm and everything on it?`}
          </p>

          <p>
            In order to continue your progress you will need to create a full
            account by setting up a wallet and buying your farm.
          </p>
        </>
      ),
      buttonText: `Let's get started!`,
    },
    2: {
      title: "Setting up your wallet",
      icon: (
        <img
          src="https://sequence.app/static/images/sequence-logo.7c854742a6b8b4969004.svg"
          width={16 * PIXEL_SCALE}
          className="mx-auto mb-3"
        />
      ),
      text: (
        <>
          <p>
            {`There are many wallet providers out there, but we've partnered with Sequence because they're easy to use and secure.`}
          </p>

          <p>
            {`Select a sign-up method in the pop-up window and you're good to go. I'll see you back here in just a minute!`}
          </p>

          <a
            onClick={() => authService.send("RETURN")}
            className="underline text-xxs pb-1 pt-0.5 hover:text-blue-500 cursor-pointer"
          >
            I already have a wallet
          </a>
        </>
      ),
      buttonText: `Create wallet`,
    },
    3: {
      title: "Accept the terms of service",
      icon: (
        <img
          src={CROP_LIFECYCLE.Sunflower.crop}
          width={16 * PIXEL_SCALE}
          className="mx-auto mb-3"
        />
      ),
      text: (
        <>
          <p>{`In order to buy your farm you will need to accept the Sunflower Land terms of service.`}</p>

          <p>
            {`This step will take you back to your new sequence wallet to accept the terms of service.`}
          </p>
        </>
      ),
      buttonText: `Accept terms of service`,
    },
    4: {
      title: "Buy your farm!",
      icon: (
        <img
          src={walletIcon}
          width={16 * PIXEL_SCALE}
          className="mx-auto mb-3"
        />
      ),
      text: (
        <>
          <p>
            {`Now that your wallet is all set up, it's time to get your very own farm NFT! `}
          </p>

          <p>
            {`This NFT will securely store all your progress in Sunflower Land and allow you to keep coming back to tend to your farm.`}
          </p>
        </>
      ),
      buttonText: `Let's do this!`,
    },
  };

  const { title, text, icon, buttonText } = STEPS[currentStep];

  const initSequence = async () => {
    const network = CONFIG.NETWORK === "mainnet" ? "polygon" : "mumbai";

    const sequenceWallet = await sequence.initWallet(network);
    await sequenceWallet.connect(SEQUENCE_CONNECT_OPTIONS);

    if (!sequenceWallet.isConnected()) {
      throw Error(ERRORS.SEQUENCE_NOT_CONNECTED);
    }

    const provider = sequenceWallet.getProvider();

    await wallet.initialise(provider, "SEQUENCE");

    authService.send("SET_WALLET", {
      data: { web3: provider, wallet: "SEQUENCE" },
    });

    setCurrentStep(3);
  };

  const initLogin = async () => {
    if (authService.state.context.user.token) {
      authService.send("SET_TOKEN", {
        data: { token: authService.state.context.user.token },
      });
      setCurrentStep(4);
      return;
    }

    if (wallet.myAccount) {
      const { token } = await login(
        authService.state.context.transactionId as string,
        wallet.myAccount
      );
      authService.send("SET_TOKEN", { data: { token } });
      setCurrentStep(4);
      return;
    }
  };

  const handleOnClick = () => {
    if (currentStep == 1) {
      setCurrentStep(2);
    }

    if (currentStep === 2) {
      initSequence();
      return;
    }

    if (currentStep === 3) {
      initLogin();
      return;
    }

    if (currentStep === 4) {
      authService.send("BUY_FULL_ACCOUNT");
    }
  };

  return (
    <CloseButtonPanel
      bumpkinParts={bumpkinParts}
      title={title}
      onClose={onClose}
    >
      <>
        <div className="p-2 pt-0 text-sm mb-2 space-y-2">
          {icon}
          {text}
        </div>
        <Button onClick={handleOnClick}>{buttonText}</Button>
      </>
    </CloseButtonPanel>
  );
};
