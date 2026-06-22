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
import { SwapSFLForCoins } from "./SwapSFLForCoins";
import * as AuthProvider from "features/auth/lib/Provider";
import { XsollaLoading } from "features/game/components/modal/components/XsollaLoading";
import { XsollaIFrame } from "features/game/components/modal/components/XsollaIFrame";
import {
  BuyGems,
  type Price,
  STARTER_PACK,
  STARTER_PACK_COINS,
  STARTER_PACK_GEMS,
} from "features/game/components/modal/components/BuyGems";
import { randomID } from "lib/utils/random";
import { onboardingAnalytics } from "lib/onboardingAnalytics";
import type { AuthMachineState } from "features/auth/lib/authMachine";
import type { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { buyBlockBucksXsolla as buyGemsXsolla } from "features/game/actions/buyGems";
import { useNavigate } from "react-router";
import { useSound } from "lib/utils/hooks/useSound";
import {
  getAscensionLevel,
  meetsLevelRequirement,
} from "features/game/lib/level";
import { GOBLIN_RETREAT_LEVEL } from "./settings-menu/blockchain-settings/BlockchainSettings";

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
const _experience = (state: MachineState) =>
  state.context.state.bumpkin?.experience ?? 0;
const _ascensionLevel = (state: MachineState) =>
  state.context.state.island.ascensionLevel ?? 0;

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
  const experience = useSelector(gameService, _experience);
  const ascensionLevel = useSelector(gameService, _ascensionLevel);

  const navigate = useNavigate();
  const travel = useSound("travel");

  const canAccessRetreat = meetsLevelRequirement(
    getAscensionLevel({ experience, ascensionLevel }),
    { ascension: 0, level: GOBLIN_RETREAT_LEVEL },
  );

  const goToGoblinRetreat = () => {
    travel.play();
    navigate("/world/retreat");
    onClose();
  };

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
    gameService.send("SAVE");

    onboardingAnalytics.logEvent("begin_checkout");
  }, []);

  const onFlowerBuy = async (
    quote: number,
    bundle: number | typeof STARTER_PACK,
  ) => {
    gameService.send("gems.bought", {
      effect: {
        type: "gems.bought",
        quote,
        bundle,
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
        amount: amount as number,
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
    const isStarterPack = price?.amount === STARTER_PACK;
    gameService.send("UPDATE_GEMS", {
      amount: isStarterPack
        ? STARTER_PACK_GEMS
        : ((price?.amount as number) ?? 0),
      ...(isStarterPack ? { coins: STARTER_PACK_COINS } : {}),
    });
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
              <>
                <div className="flex flex-col gap-2 p-1">
                  <div className="flex items-center">
                    <img
                      src={SUNNYSIDE.icons.arrow_left}
                      className="w-6 cursor-pointer mr-2"
                      alt={t("back")}
                      onClick={() => setPage("menu")}
                    />
                    <Label type="default" icon={flowerIcon}>
                      {t("deposit.flower")}
                    </Label>
                  </div>
                  <p className="text-sm p-1">
                    {t("deposit.flower.movedToBank")}
                  </p>
                </div>
                <Button
                  onClick={goToGoblinRetreat}
                  disabled={!canAccessRetreat}
                >
                  <div className="flex items-center justify-center">
                    {!canAccessRetreat && (
                      <img src={SUNNYSIDE.icons.lock} className="h-4 mr-1" />
                    )}
                    {canAccessRetreat
                      ? t("gameOptions.blockchainSettings.goToBank")
                      : t("world.lvl.requirement", {
                          lvl: GOBLIN_RETREAT_LEVEL,
                        })}
                  </div>
                </Button>
              </>
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
