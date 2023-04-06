import React, { useState } from "react";
import { sequence } from "0xsequence";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { SEQUENCE_CONNECT_OPTIONS } from "features/auth/lib/sequence";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Equipped } from "features/game/types/bumpkin";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";

import wallet from "assets/icons/wallet.png";

interface Props {
  bumpkinParts: Equipped;
  onClose: () => void;
}

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type ModalContent = {
  title: string;
  icon: React.ReactNode;
  text: React.ReactNode;
  buttonText: string;
};

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
      </>
    ),
    buttonText: `Create wallet`,
  },
  3: {
    title: "Buy your farm!",
    icon: (
      <img src={wallet} width={16 * PIXEL_SCALE} className="mx-auto mb-3" />
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

export const WalletOnboarding: React.FC<Props> = ({
  bumpkinParts,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const { title, text, icon, buttonText } = STEPS[currentStep];

  const initSequence = async () => {
    const network = CONFIG.NETWORK === "mainnet" ? "polygon" : "mumbai";

    const sequenceWallet = await sequence.initWallet(network);
    await sequenceWallet.connect(SEQUENCE_CONNECT_OPTIONS);

    if (!sequenceWallet.isConnected()) {
      throw Error(ERRORS.SEQUENCE_NOT_CONNECTED);
    }

    const provider = sequenceWallet.getProvider();
    console.log({ web3: { wallet: "SEQUENCE", provider } });
    setCurrentStep(3);
  };

  const handleOnClick = () => {
    if (currentStep == 1) {
      setCurrentStep(2);
    }

    if (currentStep === 2) {
      initSequence();
      return;
    }

    // Initialize the buying of wallet
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
