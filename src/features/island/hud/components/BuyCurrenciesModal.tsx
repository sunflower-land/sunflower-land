import React, { useContext, useEffect, useState } from "react";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

import vipIcon from "assets/icons/vip.webp";
import exchangeIcon from "assets/icons/exchange.png";
import coinsIcon from "assets/icons/coins.webp";
import coinsStack from "assets/icons/coins_stack.webp";
import coinsScattered from "assets/icons/coins_scattered.webp";
import sflIcon from "assets/icons/sfl.webp";
import { SFL_TO_COIN_PACKAGES } from "features/game/events/landExpansion/exchangeSFLtoCoins";
import { ButtonPanel } from "components/ui/Panel";
import * as AuthProvider from "features/auth/lib/Provider";
import { XsollaLoading } from "features/game/components/modal/components/XsollaLoading";
import { XsollaIFrame } from "features/game/components/modal/components/XsollaIFrame";
import { Context } from "features/game/GameProvider";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { onboardingAnalytics } from "lib/onboardingAnalytics";
import { randomID } from "lib/utils/random";
import { buyBlockBucksXsolla as buyGemsXsolla } from "features/game/actions/buyGems";
import {
  BuyGems,
  Price,
} from "features/game/components/modal/components/BuyGems";
import { Button } from "components/ui/Button";
import { SUNNYSIDE } from "assets/sunnyside";
import { SquareIcon } from "components/ui/SquareIcon";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { VIPItems } from "../../../game/components/modal/components/VIPItems";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";
import { isMobile } from "mobile-device-detect";

const COIN_IMAGES = [coinsScattered, coinsIcon, coinsStack];

type Props = {
  initialTab?: number;
  show: boolean;
  onClose: () => void;
};

const _token = (state: AuthMachineState) =>
  state.context.user.rawToken as string;
const _farmId = (state: MachineState) => state.context.farmId;
const _balance = (state: MachineState) => state.context.state.balance;
const _autosaving = (state: MachineState) => state.matches("autosaving");

export const BuyCurrenciesModal: React.FC<Props> = ({
  show,
  onClose,
  initialTab = 0,
}) => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);
  const [tab, setTab] = useState(initialTab);

  const { t } = useAppTranslation();

  // Block bucks
  const [showXsolla, setShowXsolla] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<Price>();
  const [hideBuyBBLabel, setHideBuyBBLabel] = useState(false);

  // SFL to Coins
  const [exchangePackageId, setExchangePackageId] = useState<number>();

  const token = useSelector(authService, _token);
  const farmId = useSelector(gameService, _farmId);
  const balance = useSelector(gameService, _balance);
  const autosaving = useSelector(gameService, _autosaving);

  const enoughSfl =
    !!exchangePackageId &&
    balance.greaterThanOrEqualTo(
      SFL_TO_COIN_PACKAGES[Number(exchangePackageId)].sfl,
    );

  useEffect(() => {
    // Trigger an autosave in case they have changes so user can sync right away
    gameService.send("SAVE");

    onboardingAnalytics.logEvent("begin_checkout");
  }, []);

  const handleSFLtoCoinsExchange = (packageId: number) => {
    gameService.send("sfl.exchanged", { packageId });
    setExchangePackageId(undefined);
    onClose();
  };

  const onMaticBuy = async () => {
    gameService.send("BUY_GEMS", {
      currency: "MATIC",
      amount: price?.amount,
    });
    onClose();
  };

  const handleExited = () => {
    setShowXsolla(undefined);
    setPrice(undefined);
    setLoading(false);
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
    gameService.send("UPDATE_GEMS", { amount: price?.amount });
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
        <CloseButtonPanel
          onBack={price ? () => setPrice(undefined) : undefined}
          currentTab={tab}
          setCurrentTab={(tab) => {
            setTab(tab);
          }}
          onClose={onClose}
          tabs={[
            { icon: ITEM_DETAILS.Gem.image, name: `Gems` },
            { icon: exchangeIcon, name: `${t("sfl/coins")}` },
            { icon: vipIcon, name: "VIP" },
          ]}
        >
          {tab === 0 && (
            <div className="flex flex-col space-y-1">
              {!hideBuyBBLabel && (
                <div className="flex justify-between pt-2 px-1">
                  <Label
                    icon={ITEM_DETAILS.Gem.image}
                    type="default"
                    className="ml-2"
                  >
                    {`${t("transaction.buy.gems")}`}
                  </Label>
                  <a
                    href="https://docs.sunflower-land.com/fundamentals/blockchain-fundamentals#block-bucks"
                    className="text-xxs underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("read.more")}
                  </a>
                </div>
              )}
              <BuyGems
                isSaving={autosaving}
                price={price}
                setPrice={setPrice}
                onMaticBuy={onMaticBuy}
                onCreditCardBuy={handleCreditCardBuy}
                onHideBuyBBLabel={(hide) => setHideBuyBBLabel(hide)}
              />
            </div>
          )}
          {tab === 1 && (
            <div className="flex flex-col space-y-2">
              <Label icon={exchangeIcon} type="default" className="mt-2 ml-1">
                {`${t("exchange")} SFL ${t("for")} Coins`}
              </Label>
              {/* Exchange packages */}
              {!exchangePackageId && (
                <div className="flex px-1 pb-1 justify-between gap-1  sm:text-sm sm:gap-2">
                  {Object.keys(SFL_TO_COIN_PACKAGES).map((packageId, index) => {
                    const option = SFL_TO_COIN_PACKAGES[Number(packageId)];

                    return (
                      <ButtonPanel
                        key={JSON.stringify(option)}
                        className="flex relative flex-col flex-1 items-center p-2 cursor-pointer hover:bg-brown-300"
                        onClick={() => setExchangePackageId(Number(packageId))}
                      >
                        <span className="whitespace-nowrap mb-2">{`${option.coins} x`}</span>
                        <div className="flex flex-1 justify-center items-center mb-6 w-full relative">
                          <SquareIcon
                            width={isMobile ? 18 : 22}
                            icon={COIN_IMAGES[index]}
                          />
                        </div>
                        <Label
                          icon={sflIcon}
                          type="warning"
                          iconWidth={13}
                          className="absolute h-7  -bottom-2"
                          style={{
                            left: `${PIXEL_SCALE * -3}px`,
                            right: `${PIXEL_SCALE * -3}px`,
                            width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
                          }}
                        >
                          <span className="pl-1 sm:pl-0">{`${option.sfl} SFL`}</span>
                        </Label>
                      </ButtonPanel>
                    );
                  })}
                </div>
              )}
              {/* Exchange confirmation */}
              {!!exchangePackageId && (
                <div className="flex flex-col space-y-1">
                  <div className="py-1">
                    <img
                      src={SUNNYSIDE.icons.arrow_left}
                      className="ml-2 cursor-pointer"
                      style={{
                        width: `${PIXEL_SCALE * 11}px`,
                      }}
                      onClick={() => setExchangePackageId(undefined)}
                    />
                  </div>
                  <div className="flex px-1 pb-1 w-full items-center text-sm justify-between">
                    <div className="flex items-center space-x-2">
                      <span>
                        {t("item")}{" "}
                        {SFL_TO_COIN_PACKAGES[Number(exchangePackageId)].coins}{" "}
                        {"x"}
                      </span>
                      <img src={coinsIcon} className="w-6" />
                    </div>
                    <span>{`${t("total")} ${
                      SFL_TO_COIN_PACKAGES[Number(exchangePackageId)].sfl
                    } SFL`}</span>
                  </div>
                  {!enoughSfl && (
                    <Label type="danger" icon={sflIcon} className="mb-2">
                      {t("not.enough.sfl")}
                    </Label>
                  )}
                  <Button
                    disabled={!enoughSfl}
                    onClick={() => handleSFLtoCoinsExchange(exchangePackageId)}
                  >
                    {t("confirm")}
                  </Button>
                </div>
              )}
            </div>
          )}
          {tab === 2 && <VIPItems onClose={onClose} />}
        </CloseButtonPanel>
      )}
    </Modal>
  );
};
