import React, { useContext, useEffect, useState } from "react";
import token from "assets/icons/flower_token.webp";

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
  const { gameService } = useContext(Context);
  const [maticBalance, setMaticBalance] = useState<Decimal>(new Decimal(0));
  const [isLoading, setIsLoading] = useState(true);
  const [maticAmount, setMaticAmount] = useState(new Decimal(0));
  const [SFLAmount, setSFLAmount] = useState(new Decimal(0));
  const { t } = useAppTranslation();

  const amountOutMin = SFLAmount.mul(0.99);

  useEffect(() => {
    const fetchMaticBalance = async () => {
      setIsLoading(true);
      const balance = await wallet.getMaticBalance();

      setMaticBalance(new Decimal(balance));
      setIsLoading(false);
    };

    fetchMaticBalance();
  }, []);

  const getSFLForMaticAmount = async (maticAmount: Decimal) => {
    const sfl = await wallet.getSFLForMatic(toWei(maticAmount.toString()));
    setSFLAmount(sfl);
  };

  const handleMaticAmountChange = (value: Decimal) => {
    setMaticAmount(value);

    if (value.eq(0)) {
      setSFLAmount(new Decimal(0));
    } else {
      getSFLForMaticAmount(value);
    }
  };

  const getMaticForSFLAmount = async (sflAmount: Decimal) => {
    const matic = await wallet.getMaticForSFL(toWei(sflAmount.toString()));
    setMaticAmount(matic);
  };

  const handleSFLAmountChange = (value: Decimal) => {
    setSFLAmount(value);

    if (value.eq(0)) {
      setMaticAmount(new Decimal(0));
    } else {
      getMaticForSFLAmount(value);
    }
  };

  const handleAddSFL = () => {
    gameService.send({
      type: "BUY_SFL",
      maticAmount: toWei(maticAmount.toString()),
      amountOutMin: toWei(amountOutMin.toString()),
    });
  };

  const formattedMaticBalance = formatNumber(
    new Decimal(fromWei(toBN(maticBalance.toString()))),
    {
      decimalPlaces: 4,
    },
  );

  const invalidMaticAmount =
    toBN(toWei(maticAmount.toString())).gt(toBN(maticBalance.toString())) ||
    maticAmount.lte(0);

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
                value={maticAmount}
                maxDecimalPlaces={4}
                isOutOfRange={invalidMaticAmount}
                onValueChange={handleMaticAmountChange}
              />
              <span className="text-xxs absolute top-1/2 -translate-y-1/2 right-2">
                {`${t("balance")}: ${formattedMaticBalance}`}
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
                value={SFLAmount}
                maxDecimalPlaces={4}
                onValueChange={handleSFLAmountChange}
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
        disabled={invalidMaticAmount}
        className="whitespace-nowrap"
      >
        {t("addSFL")}
      </Button>
    </>
  );
};
