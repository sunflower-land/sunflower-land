import React, { useEffect, useState } from "react";
import { GameWallet } from "features/wallet/Wallet";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";

import creditCard from "assets/icons/credit_card.png";
import blockBucksIcon from "assets/icons/block_buck.png";
import matic from "assets/icons/polygon-token.png";
import { Button } from "components/ui/Button";
import { OuterPanel } from "components/ui/Panel";
import classNames from "classnames";

export interface Price {
  amount: number;
  usd: number;
}

const PRICES: Price[] = [
  {
    amount: 1,
    usd: 0.25, // $0.25 each
  },
  {
    amount: 5,
    usd: 0.99, // $0.198 each
  },
  {
    amount: 10,
    usd: 1.75, // $0.175 each
  },
  {
    amount: 20,
    usd: 2.99, // $0.1495 each
  },
  {
    amount: 100,
    usd: 14.5, // $0.145 each
  },
  {
    amount: 500,
    usd: 65, // $0.13 each
  },
  {
    amount: 1000,
    usd: 125, // $0.125 each
  },
  {
    amount: 10000,
    usd: 1000, // $0.10 each
  },
];

interface Props {
  isSaving: boolean;
  price?: { usd: number; amount: number };
  setPrice: (price?: { usd: number; amount: number }) => void;
  onMaticBuy: () => void;
  onCreditCardBuy: () => void;
  onHideBuyBBLabel: (hide: boolean) => void;
}

export const BuyBlockBucks: React.FC<Props> = ({
  isSaving,
  price,
  setPrice,
  onMaticBuy,
  onCreditCardBuy,
  onHideBuyBBLabel,
}) => {
  const [showMaticConfirm, setShowMaticConfirm] = useState(false);
  const { t } = useAppTranslation();

  useEffect(() => {
    if (showMaticConfirm) {
      onHideBuyBBLabel(true);
    } else {
      onHideBuyBBLabel(false);
    }
  }, [showMaticConfirm, onHideBuyBBLabel]);

  if (!!price && showMaticConfirm) {
    return (
      <GameWallet action="purchase">
        <Label icon={blockBucksIcon} type="default" className="ml-2">
          {`${t("transaction.buy.BlockBucks")}`}
        </Label>
        <p className="text-xxs italic mt-1">{t("transaction.excludeFees")}</p>
        <div className="flex flex-col w-full items-center mb-2 px-2 text-sm">
          <div className="flex w-full py-3 items-center text-sm justify-between">
            <div className="flex items-center space-x-2">
              <span>
                {t("item")} {price.amount} {"x"}
              </span>
              <img src={blockBucksIcon} className="w-6" />
            </div>
            <span>{`${t("total")} ${price.usd} USD`}</span>
          </div>

          {/* <p className="mr-2 mb-1">{`${t("total")}: ${price.usd} USD`}</p> */}
        </div>

        <Button onClick={() => onMaticBuy()}>{t("confirm")}</Button>
      </GameWallet>
    );
  }

  if (isSaving) {
    return (
      <div className="flex justify-center">
        <p className="loading text-center">{t("loading")}</p>
      </div>
    );
  }

  if (price) {
    return (
      <>
        <div className="px-1">
          <div className="flex items-center text-[14px] sm:text-sm justify-between mt-2 mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs">
                {t("item")} {price.amount} {"x"}
              </span>
              <img src={blockBucksIcon} className="w-6" />
            </div>
            <span className="text-xs">{`${t("total")} ${price.usd} USD`}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <OuterPanel
              onClick={price.amount > 1 ? onCreditCardBuy : undefined}
              className={classNames(
                "flex relative flex-col flex-1 items-center p-2",
                {
                  "opacity-60 cursor-not-allowed": price.amount === 1,
                  "cursor-pointer": price.amount > 1,
                }
              )}
            >
              <span className="mb-2 text-xs">{t("card.cash")}</span>
              <div className="flex flex-col flex-1 justify-center items-center mb-6 w-full">
                <img src={creditCard} className="w-1/5 sm:w-1/5" />
                {price.amount === 1 && (
                  <span className="text-[12px] italic">
                    {`*${t("minimum")} 5 Block Bucks`}
                  </span>
                )}
              </div>

              <Label
                type={price.amount === 1 ? "danger" : "warning"}
                className="absolute w-[108%] sm:w-[105%] -bottom-2 h-8"
              >
                {t("transaction.payCash")}
              </Label>
            </OuterPanel>
            <OuterPanel
              onClick={() => setShowMaticConfirm(true)}
              className="flex relative flex-col flex-1 items-center p-2"
            >
              <span className="mb-2 text-xs">{"MATIC"}</span>
              <div className="flex flex-col flex-1 justify-center items-center mb-6 w-full">
                <img src={matic} className="w-1/5 sm:w-1/5" />
              </div>
              <Label
                type="warning"
                className="absolute h-8 w-[108%] sm:w-[105%] -bottom-2"
              >
                {t("transaction.payMatic")}
              </Label>
            </OuterPanel>
          </div>
          <p className="text-xxs italic mb-2">{t("transaction.excludeFees")}</p>
        </div>
        <Button onClick={() => setPrice(undefined)}>{t("back")}</Button>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col w-full p-1">
        <p className="text-xxs italic pb-2">{t("transaction.excludeFees")}</p>
        <div className="grid grid-cols-3 gap-1 gap-y-2 text-[14px] sm:text-sm sm:gap-2">
          {PRICES.map((price) => (
            <OuterPanel
              key={JSON.stringify(price)}
              className="flex flex-col items-center relative cursor-pointer hover:bg-brown-300"
              onClick={() => setPrice(price)}
            >
              <span className="whitespace-nowrap mb-2">{`${price.amount} x`}</span>
              <div className="flex flex-1 justify-center items-center mb-6 w-full">
                <img src={blockBucksIcon} className="w-2/5 sm:w-1/4" />
              </div>
              <Label
                type="warning"
                iconWidth={11}
                className="absolute h-7 w-[110%] sm:w-[108%] -bottom-1"
              >
                {`$${price.usd} USD`}
              </Label>
            </OuterPanel>
          ))}
        </div>
      </div>
    </>
  );
};
