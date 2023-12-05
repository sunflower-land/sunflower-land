import React, { useContext, useState } from "react";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Context as AuthContext } from "features/auth/lib/Provider";
import { Context as GameContext } from "features/game/GameProvider";
import { CROP_LIFECYCLE } from "features/island/plots/lib/plant";
import { login } from "features/auth/actions/login";
import { wallet } from "lib/blockchain/wallet";
import { Web3SupportedProviders } from "lib/web3SupportedProviders";
import { useSelector } from "@xstate/react";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "react-bootstrap";
import { Button } from "components/ui/Button";

import walletIcon from "src/assets/icons/wallet.png";
import { web3ConnectStrategyFactory } from "features/auth/lib/web3-connect-strategy/web3ConnectStrategy.factory";
import { SEQUENCE_ICON } from "features/auth/components/SignIn";

type Step = 1 | 2 | 3;

type ModalContent = {
  title: string;
  icon: React.ReactNode;
  text: React.ReactNode;
  buttonText: string;
  loadingText: string;
};

export const WalletOnboarding: React.FC = () => {
  const { authService } = useContext(AuthContext);
  const { gameService } = useContext(GameContext);

  const bumpkin = useSelector(
    gameService,
    (state) => state.context.state.bumpkin
  );

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  if (!bumpkin) {
    throw new Error("Bumpkin is not defined");
  }

  const onClose = () => gameService.send("CLOSE");

  const STEPS: Record<Step, ModalContent> = {
    1: {
      title: "Setting up your wallet",
      icon: (
        <img
          src={SEQUENCE_ICON}
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
            onClick={() => authService.send("SIGN_IN")}
            className="underline text-xxs pb-1 pt-2 hover:text-blue-500 cursor-pointer"
          >
            I already have a wallet
          </a>
        </>
      ),
      buttonText: `Create wallet`,
      loadingText: "Signing in...",
    },
    2: {
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
      loadingText: "Accepting terms...",
    },
    3: {
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
      loadingText: `Let's do this!`,
    },
  };

  const { title, text, icon, buttonText, loadingText } = STEPS[currentStep];

  const initSequence = async () => {
    setLoading(true);
    const sequenceStrategy = web3ConnectStrategyFactory(
      Web3SupportedProviders.SEQUENCE
    );

    await sequenceStrategy.initialize();

    authService.send("SET_WALLET", {
      data: {
        web3: {
          provider: sequenceStrategy.getProvider(),
          wallet: Web3SupportedProviders.SEQUENCE,
        },
      },
    });
    setLoading(false);
    setCurrentStep(2);
  };

  const initLogin = async () => {
    if (wallet.myAccount) {
      setLoading(true);
      try {
        const { token } = await login(
          authService.state.context.transactionId as string,
          wallet.myAccount
        );
        authService.send("SET_TOKEN", {
          data: { account: wallet.myAccount, token },
        });
        setCurrentStep(3);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
      setLoading(false);
      return;
    }
  };

  const handleOnClick = () => {
    if (currentStep === 1) {
      initSequence();
      return;
    }

    if (currentStep === 2) {
      initLogin();
      return;
    }

    if (currentStep === 3) {
      authService.send("BUY_FULL_ACCOUNT");
    }
  };

  return (
    <Modal show={true} onHide={onClose} centered>
      <CloseButtonPanel
        bumpkinParts={bumpkin.equipped}
        title={title}
        onClose={onClose}
      >
        <>
          <div className="p-2 pt-0 text-sm mb-2 space-y-2">
            {icon}
            {text}
          </div>
          <Button onClick={handleOnClick} disabled={loading}>
            {loading ? loadingText : buttonText}
          </Button>
        </>
      </CloseButtonPanel>
    </Modal>
  );
};
