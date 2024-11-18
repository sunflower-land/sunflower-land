import React, { useContext, useEffect, useState } from "react";
import { GameWallet } from "features/wallet/Wallet";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Label } from "components/ui/Label";

import creditCard from "assets/icons/credit_card.png";
import whaleIcon from "assets/icons/whale.webp";
import { Button } from "components/ui/Button";
import { ButtonPanel } from "components/ui/Panel";
import classNames from "classnames";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { Loading } from "features/auth/components";
import { SquareIcon } from "components/ui/SquareIcon";
import { Context } from "features/game/GameProvider";
import { useSelector } from "@xstate/react";
import { MachineState } from "features/game/lib/gameMachine";
import { secondsToString } from "lib/utils/time";
import { ITEM_DETAILS } from "features/game/types/images";

export interface Price {
  amount: number;
  usd: number;
}

const PRICES: Price[] = [
  { amount: 100, usd: 0.99 },
  { amount: 650, usd: 4.99 },
  { amount: 1350, usd: 9.99 },
  { amount: 2800, usd: 19.99 },
  { amount: 7400, usd: 49.99 },
  { amount: 15500, usd: 99.99 },
  { amount: 200000, usd: 999.99 },
];

const _starterOfferSecondsLeft = (state: MachineState) => {
  const hasPurchased = state.context.purchases.length > 0;

  if (hasPurchased) return 0;

  return (
    (new Date(state.context.state.createdAt).getTime() +
      24 * 60 * 60 * 1000 -
      Date.now()) /
    1000
  );
};

interface Props {
  isSaving: boolean;
  price?: { usd: number; amount: number };
  setPrice: (price?: { usd: number; amount: number }) => void;
  onMaticBuy: () => void;
  onCreditCardBuy: () => void;
  onHideBuyBBLabel: (hide: boolean) => void;
}

export const BuyGems: React.FC<Props> = ({
  isSaving,
  price,
  setPrice,
  onMaticBuy,
  onCreditCardBuy,
  onHideBuyBBLabel,
}) => {
  const { gameService } = useContext(Context);
  const startOfferSecondsLeft = useSelector(
    gameService,
    _starterOfferSecondsLeft,
  );

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
        <Label icon={ITEM_DETAILS.Gem.image} type="default" className="ml-2">
          {`${t("transaction.buy.gems")}`}
        </Label>
        <div className="py-2">
          <img
            src={SUNNYSIDE.icons.arrow_left}
            className="h-6 w-6 ml-2 cursor-pointer"
            onClick={() => setPrice(undefined)}
          />
        </div>
        <p className="text-xxs italic mt-1">{t("transaction.excludeFees")}</p>
        <div className="flex flex-col w-full items-center mb-2 px-2 text-sm">
          <div className="flex w-full py-3 items-center text-sm justify-between">
            <div className="flex items-center space-x-2">
              <span>
                {t("item")} {price.amount} {"x"}
              </span>
              <img src={ITEM_DETAILS.Gem.image} className="w-6" />
            </div>
            <span>{`${t("total")}: US$${price.usd}`}</span>
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
        <Loading />
      </div>
    );
  }

  if (price) {
    return (
      <>
        <div className="px-1">
          <div className="flex items-center sm:text-sm justify-between mt-2 mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs">
                {t("item")} {price.amount} {"x"}
              </span>
              <img src={ITEM_DETAILS.Gem.image} className="w-6" />
            </div>
            <span className="text-xs">{`${t("total")}: US$${price.usd}`}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <ButtonPanel
              onClick={price.amount > 1 ? onCreditCardBuy : undefined}
              className={classNames(
                "flex relative flex-col flex-1 items-center p-2",
                {
                  "opacity-60 cursor-not-allowed": price.amount === 1,
                  "cursor-pointer": price.amount > 1,
                },
              )}
            >
              <span className="mb-2 text-xs">{t("card.cash")}</span>
              <div className="flex flex-col flex-1 justify-center items-center mb-6 w-full">
                <img src={creditCard} className="w-1/5 sm:w-1/5" />
                {price.amount === 1 && (
                  <span className="text-xs italic">
                    {`*${t("minimum")} 500 Gems`}
                  </span>
                )}
              </div>

              <Label
                type={price.amount === 1 ? "danger" : "warning"}
                className="absolute -bottom-2 h-8"
                style={{
                  left: `${PIXEL_SCALE * -3}px`,
                  right: `${PIXEL_SCALE * -3}px`,
                  width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
                }}
              >
                {t("transaction.payCash")}
              </Label>
            </ButtonPanel>
            <ButtonPanel
              onClick={() => setShowMaticConfirm(true)}
              className="flex relative flex-col flex-1 items-center p-2 cursor-pointer"
            >
              <span className="mb-2 text-xs">{"MATIC"}</span>
              <div className="flex flex-col flex-1 justify-center items-center mb-6 w-full">
                <img
                  src={SUNNYSIDE.icons.polygonIcon}
                  className="w-1/5 sm:w-1/5"
                />
              </div>
              <Label
                type="warning"
                className="absolute h-8 -bottom-2"
                style={{
                  left: `${PIXEL_SCALE * -3}px`,
                  right: `${PIXEL_SCALE * -3}px`,
                  width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
                }}
              >
                {t("transaction.payPol")}
              </Label>
            </ButtonPanel>
          </div>
          <p className="text-xxs italic mb-2">{t("transaction.excludeFees")}</p>
        </div>
        <Button onClick={() => setPrice(undefined)}>{t("back")}</Button>
      </>
    );
  }

  const isLifetime =
    !!gameService.getSnapshot().context.state.inventory[
      "Lifetime Farmer Banner"
    ];

  return (
    <>
      <div className="flex flex-col w-full p-1">
        {startOfferSecondsLeft > 0 && (
          <ButtonPanel
            onClick={() => setPrice({ amount: 300, usd: 0.99 })}
            className="w-full mb-1"
          >
            <div className="flex justify-between">
              <Label type="vibrant">{t("transaction.starterOffer")}</Label>
              <Label icon={SUNNYSIDE.icons.stopwatch} type="info">
                {`${secondsToString(startOfferSecondsLeft, {
                  length: "short",
                })} left`}
              </Label>
            </div>
            <div className="flex w-full">
              <div>
                <div className="flex items-center">
                  <SquareIcon icon={ITEM_DETAILS.Gem.image} width={10} />
                  <span className="ml-1 text-sm">{`300 x Gems`}</span>
                </div>
              </div>
              <div className="flex flex-col justify-end flex-1 items-end">
                <span className="text-sm mb-1 line-through">{`$2.99`}</span>
                <Label type="warning">{`US$0.99`}</Label>
              </div>
            </div>
          </ButtonPanel>
        )}

        <div className="grid grid-cols-3 gap-1 gap-y-2  sm:text-sm sm:gap-2">
          {PRICES.map((price, index) => {
            if (index === PRICES.length - 1 && !isLifetime) return null;

            // Compare price to base package
            const gemsPerDollar = 100 / 0.99;
            const expected = gemsPerDollar * price.usd;
            const bonus = 100 * (price.amount / expected - 1);

            return (
              <ButtonPanel
                key={JSON.stringify(price)}
                className="flex flex-col items-center relative cursor-pointer hover:bg-brown-300"
                onClick={() => setPrice(price)}
              >
                {!!bonus && (
                  <Label type="success" className="absolute -right-2 -top-5">
                    {`+${bonus.toFixed(0)}%`}
                  </Label>
                )}

                {index === PRICES.length - 1 && (
                  <img
                    src={whaleIcon}
                    className="h-6 absolute -left-4 -top-4"
                  />
                )}

                <span className="whitespace-nowrap mb-2 mt-0.5">{`${price.amount} x`}</span>
                <div className="flex flex-1 justify-center items-center mb-6 w-full">
                  <img
                    src={ITEM_DETAILS.Gem.image}
                    className="w-2/5 sm:w-1/4"
                  />
                </div>
                <Label
                  type="warning"
                  iconWidth={11}
                  className="absolute h-7  -bottom-2"
                  style={{
                    left: `${PIXEL_SCALE * -3}px`,
                    right: `${PIXEL_SCALE * -3}px`,
                    width: `calc(100% + ${PIXEL_SCALE * 6}px)`,
                  }}
                >
                  {`US$${price.usd}`}
                </Label>
              </ButtonPanel>
            );
          })}
        </div>
      </div>
    </>
  );
};
