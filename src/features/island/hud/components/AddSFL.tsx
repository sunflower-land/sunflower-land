import React, { useContext, useEffect, useState } from "react";
import token from "assets/icons/sfl.webp";

import { SUNNYSIDE } from "assets/sunnyside";
import { Button } from "components/ui/Button";
import { wallet } from "lib/blockchain/wallet";
import { fromWei, toBN, toWei } from "web3-utils";
import Decimal from "decimal.js-light";
import { formatNumber } from "lib/utils/formatNumber";
import { Context } from "features/game/GameProvider";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Loading } from "features/auth/components";
import { NumberInput } from "components/ui/NumberInput";
import { PIXEL_SCALE } from "features/game/lib/constants";

export const AddSFL: React.FC = () => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const [polBalance, setPolBalance] = useState<Decimal>(new Decimal(0));
  const [isLoading, setIsLoading] = useState(true);
  const [polAmount, setPolAmount] = useState(new Decimal(0));
  const [sflAmount, setSflAmount] = useState(new Decimal(0));
  const [focusedInput, setFocusedInput] = useState<"pol" | "sfl">();

  const amountOutMin = sflAmount.mul(0.99);

  useEffect(() => {
    const fetchPolBalance = async () => {
      setIsLoading(true);
      const balance = await wallet.getPolBalance();

      setPolBalance(new Decimal(balance));
      setIsLoading(false);
    };

    fetchPolBalance();
  }, []);

  const getSFLForPolAmount = async (polAmount: Decimal) => {
    const sfl = await wallet.getSFLForPol(toWei(polAmount.toString()));
    setSflAmount(sfl);
  };

  const handlePolAmountChange = (value: Decimal) => {
    setPolAmount(value);

    if (value.eq(0)) {
      setSflAmount(new Decimal(0));
    } else if (focusedInput === "pol") {
      getSFLForPolAmount(value);
    }
  };

  const getPolForSFLAmount = async (sflAmount: Decimal) => {
    const pol = await wallet.getPolForSFL(toWei(sflAmount.toString()));
    setPolAmount(pol);
  };

  const handleSFLAmountChange = (value: Decimal) => {
    setSflAmount(value);

    if (value.eq(0)) {
      setPolAmount(new Decimal(0));
    } else if (focusedInput === "sfl") {
      getPolForSFLAmount(value);
    }
  };

  const handleAddSFL = () => {
    gameService.send({
      type: "BUY_SFL",
      maticAmount: toWei(polAmount.toString()),
      amountOutMin: toWei(amountOutMin.toString()),
    });
  };

  const formattedPolBalance = formatNumber(
    new Decimal(fromWei(toBN(polBalance.toString()))),
    {
      decimalPlaces: 4,
    },
  );

  const invalidPolAmount =
    toBN(toWei(polAmount.toString())).gt(toBN(polBalance.toString())) ||
    polAmount.lte(0);

  if (isLoading) {
    return <Loading text={t("loading")} />;
  }

  return (
    <>
      <div className="p-2 pt-1 mb-2">
        <p className="mb-2 text-xs sm:text-sm">{t("addSFL.swapDetails")}</p>
        <p className="mb-2 text-xs sm:text-sm">{t("addSFL.referralFee")}</p>
        <div className="flex flex-col mt-3">
          <h1 className="mb-2">{t("addSFL.swapTitle")}</h1>
          <div className="flex items-center justify-between mb-2">
            <div className="relative w-full mr-3">
              <NumberInput
                value={polAmount}
                maxDecimalPlaces={4}
                isOutOfRange={invalidPolAmount}
                onValueChange={handlePolAmountChange}
                onFocus={() => setFocusedInput("pol")}
                onBlur={() => setFocusedInput(undefined)}
              />
              <span className="text-xxs absolute top-1/2 -translate-y-1/2 right-2">
                {`${t("balance")}: ${formattedPolBalance}`}
              </span>
            </div>
            <img
              src={SUNNYSIDE.icons.polygonIcon}
              alt="MATIC"
              style={{
                width: `${PIXEL_SCALE * 11}px`,
                height: `${PIXEL_SCALE * 11}px`,
              }}
            />
          </div>
          <div className="relative">
            <div className="text-left w-full mt-3 mb-4">{t("for")}</div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <div className="relative w-full mr-3">
              <NumberInput
                value={sflAmount}
                maxDecimalPlaces={4}
                onValueChange={handleSFLAmountChange}
                onFocus={() => setFocusedInput("sfl")}
                onBlur={() => setFocusedInput(undefined)}
              />
            </div>
            <img
              src={token}
              alt="sfl token"
              style={{
                width: `${PIXEL_SCALE * 11}px`,
                height: `${PIXEL_SCALE * 11}px`,
              }}
            />
          </div>
          <div className="relative h-3">
            {!!amountOutMin && (
              <p className="text-xxs">
                {t("addSFL.minimumReceived", {
                  sflReceived: formatNumber(amountOutMin, { decimalPlaces: 4 }),
                })}
              </p>
            )}
          </div>
        </div>
      </div>
      <Button
        onClick={handleAddSFL}
        disabled={invalidPolAmount}
        className="whitespace-nowrap"
      >
        {t("addSFL")}
      </Button>
    </>
  );
};
