import React, { useContext, useEffect, useState } from "react";
import { Label } from "components/ui/Label";
import { Modal } from "components/ui/Modal";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";

import blockBucksIcon from "assets/icons/block_buck.png";
import exchangeIcon from "assets/icons/exchange.png";
import coinsIcon from "assets/icons/coins.webp";
import coinsStack from "assets/icons/coins_stack.webp";
import coinsScattered from "assets/icons/coins_scattered.webp";
import sflIcon from "assets/icons/sfl.webp";
import { SFL_TO_COIN_PACKAGES } from "features/game/events/landExpansion/exchangeSFLtoCoins";
import { OuterPanel } from "components/ui/Panel";
import { useTranslation } from "react-i18next";
import * as AuthProvider from "features/auth/lib/Provider";
import { XsollaLoading } from "features/game/components/modal/components/XsollaLoading";
import { XsollaIFrame } from "features/game/components/modal/components/XsollaIFrame";
import { Context } from "features/game/GameProvider";
import { AuthMachineState } from "features/auth/lib/authMachine";
import { MachineState } from "features/game/lib/gameMachine";
import { useSelector } from "@xstate/react";
import { onboardingAnalytics } from "lib/onboardingAnalytics";
import { randomID } from "lib/utils/random";
import { buyBlockBucksXsolla } from "features/game/actions/buyBlockBucks";
import {
  BuyBlockBucks,
  Price,
} from "features/game/components/modal/components/BuyBlockBucks";
import { Button } from "components/ui/Button";

const COIN_IMAGES = [coinsIcon, coinsScattered, coinsStack];

type Props = {
  show: boolean;
  onClose: () => void;
};

const _token = (state: AuthMachineState) =>
  state.context.user.rawToken as string;
const _farmId = (state: MachineState) => state.context.farmId;
const _autosaving = (state: MachineState) => state.matches("autosaving");

export const BuyCurrenciesModal: React.FC<Props> = ({ show, onClose }) => {
  const { authService } = useContext(AuthProvider.Context);
  const { gameService } = useContext(Context);
  const [tab, setTab] = useState(0);

  const { t } = useTranslation();
  // Block bucks
  const [showXsolla, setShowXsolla] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState<Price>();
  const [hideBuyBBLabel, setHideBuyBBLabel] = useState(false);

  // SFL to Coins
  const [exchangePackageId, setExchangePackageId] = useState<number>();

  const token = useSelector(authService, _token);
  const farmId = useSelector(gameService, _farmId);
  const autosaving = useSelector(gameService, _autosaving);

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
    gameService.send("BUY_BLOCK_BUCKS", {
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

      const { url } = await buyBlockBucksXsolla({
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
    gameService.send("UPDATE_BLOCK_BUCKS", { amount: price?.amount });
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
            { icon: blockBucksIcon, name: `Buy` },
            { icon: exchangeIcon, name: `SFL/Coins` },
          ]}
        >
          {tab === 0 && (
            <div className="flex flex-col space-y-1">
              {!hideBuyBBLabel && (
                <div className="flex justify-between pt-2 px-1">
                  <Label icon={blockBucksIcon} type="default" className="ml-2">
                    {`${t("transaction.buy.BlockBucks")}`}
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
              <BuyBlockBucks
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
                <div className="flex px-1 pb-2 justify-between gap-1 text-[14px] sm:text-sm sm:gap-2">
                  {Object.keys(SFL_TO_COIN_PACKAGES).map((packageId, index) => {
                    const option = SFL_TO_COIN_PACKAGES[Number(packageId)];

                    return (
                      <OuterPanel
                        key={JSON.stringify(option)}
                        className="flex relative flex-col flex-1 items-center p-2 cursor-pointer hover:bg-brown-300"
                        onClick={() => setExchangePackageId(Number(packageId))}
                      >
                        <span className="whitespace-nowrap mb-2">{`${option.coins} coins`}</span>
                        <div className="flex flex-1 justify-center items-center mb-6 w-full relative">
                          <img
                            src={COIN_IMAGES[index]}
                            alt="Coins"
                            className="w-2/5 sm:w-1/4"
                          />
                        </div>
                        <Label
                          icon={sflIcon}
                          type="warning"
                          iconWidth={11}
                          className="absolute h-7"
                          style={{
                            width: "106%",
                            bottom: "-8px",
                            left: "-2px",
                          }}
                        >
                          {`${option.sfl} SFL`}
                        </Label>
                      </OuterPanel>
                    );
                  })}
                </div>
              )}
              {/* Exchange confirmation */}
              {!!exchangePackageId && (
                <div className="flex flex-col space-y-1">
                  <div className="flex px-1 py-2 w-full items-center text-sm justify-between">
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
                  <div className="flex space-x-1">
                    <Button onClick={() => setExchangePackageId(undefined)}>
                      {t("cancel")}
                    </Button>
                    <Button
                      onClick={() =>
                        handleSFLtoCoinsExchange(exchangePackageId)
                      }
                    >
                      {t("confirm")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CloseButtonPanel>
      )}
    </Modal>
  );
};
