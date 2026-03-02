import React, { useContext, useEffect, useState } from "react";
import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { Panel } from "components/ui/Panel";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { VIPItems } from "features/game/components/modal/components/VIPItems";
import { BuyGemsWidget } from "features/announcements/AnnouncementWidgets";
import { DepositFlower } from "./deposit/DepositFlower";
import { SwapSFLForCoins } from "./SwapSFLForCoins";
import * as AuthProvider from "features/auth/lib/Provider";
import { XsollaLoading } from "features/game/components/modal/components/XsollaLoading";
import { XsollaIFrame } from "features/game/components/modal/components/XsollaIFrame";
import {
  BuyGems,
  Price,
} from "features/game/components/modal/components/BuyGems";
import { randomID } from "lib/utils/random";
import { onboardingAnalytics } from "lib/onboardingAnalytics";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { buyBlockBucksXsolla as buyGemsXsolla } from "features/game/actions/buyGems";

import flowerIcon from "assets/icons/flower_token.webp";
import vipIcon from "assets/icons/vip.webp";
import gemIcon from "assets/icons/gem.webp";
import walletIcon from "assets/icons/wallet.png";
import exchangeIcon from "assets/icons/exchange.png";

type TransactionPage = "menu" | "deposit" | "vip" | "gems" | "swap";

type PageButtonOptions = {
  page: TransactionPage;
  icon: string;
  label: string;
};

const PageButton: React.FC<{
  option: PageButtonOptions;
  onClick: () => void;
}> = ({ option, onClick }) => (
  <Button onClick={onClick} className="relative">
    <div className="w-full flex justify-center items-center">
      <img
        src={option.icon}
        className="w-6 absolute left-0 top-1/2 -translate-y-1/2"
      />
      {option.label}
    </div>
  </Button>
);

type Props = {
  show: boolean;
  initialPage?: TransactionPage;
  onClose: () => void;
};

const _token = (state: AuthMachineState) =>
  state.context.user.rawToken as string;
const _farmId = (state: MachineState) => state.context.farmId;
const _autosaving = (state: MachineState) => state.matches("autosaving");

export const CurrenciesModal: React.FC<Props> = ({
  show,
  onClose,
  initialPage,
}) => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);

  const [page, setPage] = useState<TransactionPage>(initialPage ?? "menu");
  const [showXsolla, setShowXsolla] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<Price>();
  const [hideBuyBBLabel, setHideBuyBBLabel] = useState(false);

  const token = useSelector(authService, _token);
  const farmId = useSelector(gameService, _farmId);
  const autosaving = useSelector(gameService, _autosaving);

  const { t } = useAppTranslation();

  const transactionOptions: Partial<
    Record<TransactionPage, PageButtonOptions>
  > = {
    gems: {
      page: "gems",
      icon: gemIcon,
      label: t("transaction.buy.gems"),
    },
    vip: {
      page: "vip",
      icon: vipIcon,
      label: t("season.vip.purchase"),
    },
    deposit: {
      page: "deposit",
      icon: flowerIcon,
      label: t("transaction.deposit.flower"),
    },
    swap: {
      page: "swap",
      icon: exchangeIcon,
      label: t("exchange.flower.coins"),
    },
  };

  useEffect(() => {
    // Trigger an autosave in case they have changes so user can sync right away
    gameService.send({ type: "SAVE" });

    onboardingAnalytics.logEvent("begin_checkout");
  }, []);

  const onFlowerBuy = async (quote: number) => {
    gameService.send("gems.bought", {
      effect: {
        type: "gems.bought",
        quote,
        bundle: price?.amount,
      },
      authToken: token,
    });

    onClose();
  };

  const handleExited = () => {
    setShowXsolla(undefined);
    setPrice(undefined);
    setLoading(false);
    setPage("menu");
  };

  const handleCreditCardBuy = async () => {
    setLoading(true);
    try {
      const amount = price?.amount ?? 0;

      const { url } = await buyGemsXsolla({
        amount,
        farmId,
        transactionId: randomID(),
        token,
      });

      setShowXsolla(url);
      setLoading(false);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      setLoading(false);
    }
  };

  const handleCreditCardSuccess = () => {
    gameService.send({ type: "UPDATE_GEMS", amount: price?.amount });
    onClose();
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      onExited={handleExited}
      size={showXsolla ? "lg" : undefined}
    >
      {showXsolla ? (
        <div className="relative w-full h-full min-h-[65vh] min-w[65vw] px-1">
          <XsollaLoading autoClose={true} />
          <XsollaIFrame
            url={showXsolla}
            onSuccess={handleCreditCardSuccess}
            onClose={onClose}
          />
        </div>
      ) : loading ? (
        <div className="h-32 flex items-center justify-center">
          <XsollaLoading autoClose={false} />
        </div>
      ) : (
        <>
          <Panel className="w-full h-full p-2">
            {page === "menu" && (
              <div className="flex justify-between mb-1">
                <Label
                  type="default"
                  icon={walletIcon}
                  className="flex items-center gap-2 left-2.5"
                >
                  {t("transaction.menu.title")}
                </Label>

                <img
                  src={SUNNYSIDE.icons.close}
                  className="w-6 h-6 cursor-pointer"
                  onClick={onClose}
                />
              </div>
            )}
            {page === "menu" && (
              <>
                <div className="flex flex-col gap-1">
                  {Object.values(transactionOptions).map((option) => (
                    <PageButton
                      key={option.page}
                      option={option}
                      onClick={() => setPage(option.page)}
                    />
                  ))}
                </div>
              </>
            )}
            {page === "vip" && <VIPItems onBack={() => setPage("menu")} />}
            {page === "gems" && (
              <div className="flex flex-col space-y-1">
                <BuyGems
                  isSaving={autosaving}
                  price={price}
                  onFlowerBuy={onFlowerBuy}
                  setPrice={setPrice}
                  onCreditCardBuy={handleCreditCardBuy}
                  onHideBuyBBLabel={(hide) => setHideBuyBBLabel(hide)}
                  hideIntroLabel={hideBuyBBLabel}
                  onBack={() => setPage("menu")}
                />
              </div>
            )}
            {page === "deposit" && (
              <DepositFlower onClose={() => setPage("menu")} />
            )}
            {page === "swap" && (
              <SwapSFLForCoins onClose={() => setPage("menu")} />
            )}
          </Panel>
          <BuyGemsWidget />
        </>
      )}
    </Modal>
  );
};
