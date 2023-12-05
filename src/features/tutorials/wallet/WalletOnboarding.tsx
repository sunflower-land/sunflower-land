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
import { useAppTranslation } from "lib/i18n/useAppTranslations";

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
  const { t } = useAppTranslation();
  if (!bumpkin) {
    throw new Error(t("error.noBumpkin"));
  }

  const onClose = () => gameService.send("CLOSE");

  const STEPS: Record<Step, ModalContent> = {
    1: {
      title: t("onboarding.settingWallet"),
      icon: (
        <img
          src={SEQUENCE_ICON}
          width={16 * PIXEL_SCALE}
          className="mx-auto mb-3"
        />
      ),
      text: (
        <>
          <p>{t("onboarding.wallet.one")}</p>

          <p>{t("onboarding.wallet.two")}</p>

          <a
            onClick={() => authService.send("SIGN_IN")}
            className="underline text-xxs pb-1 pt-2 hover:text-blue-500 cursor-pointer"
          >
            I already have a wallet
          </a>
        </>
      ),
      buttonText: t("onboarding.wallet.createButton"),
      loadingText: t("welcome.signingIn"),
    },
    2: {
      title: t("transaction.termsOfService"),
      icon: (
        <img
          src={CROP_LIFECYCLE.Sunflower.crop}
          width={16 * PIXEL_SCALE}
          className="mx-auto mb-3"
        />
      ),
      text: (
        <>
          <p>{t("transaction.termsOfService.one")}</p>

          <p>{t("transaction.termsOfService.two")}</p>
        </>
      ),
      buttonText: t("transaction.termsOfService"),
      loadingText: t("transaction.termsOfService.accepting"),
    },
    3: {
      title: t("onboarding.buyFarm.title"),
      icon: (
        <img
          src={walletIcon}
          width={16 * PIXEL_SCALE}
          className="mx-auto mb-3"
        />
      ),
      text: (
        <>
          <p>{t("onboarding.buyFarm.one")}</p>

          <p>{t("onboarding.buyFarm.two")}</p>
        </>
      ),
      buttonText: t("let'sDoThis"),
      loadingText: t("let'sDoThis"),
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
