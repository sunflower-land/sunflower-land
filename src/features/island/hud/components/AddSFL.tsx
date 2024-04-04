import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import classNames from "classnames";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "components/ui/Modal";
import token from "assets/icons/sfl.webp";

import matic from "assets/icons/polygon-token.png";
import { Button } from "components/ui/Button";
import { wallet } from "lib/blockchain/wallet";
import { fromWei, toBN, toWei } from "web3-utils";
import Decimal from "decimal.js-light";
import { setPrecision } from "lib/utils/formatNumber";
import { Context } from "features/game/GameProvider";
import { GameWallet } from "features/wallet/Wallet";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { translate } from "lib/i18n/translate";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const VALID_NUMBER = new RegExp(/^\d*\.?\d*$/);
export const INPUT_MAX_CHAR = 10;

export const AddSFL: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <Modal show={isOpen} onHide={onClose}>
      <CloseButtonPanel title={translate("addSFL")} onClose={onClose}>
        <GameWallet action="purchase">
          <AddSFLOptions isOpen={isOpen} onClose={onClose} />
        </GameWallet>
      </CloseButtonPanel>
    </Modal>
  );
};

const AddSFLOptions: React.FC<Props> = ({ isOpen, onClose }) => {
  const { gameService } = useContext(Context);
  const [maticBalance, setMaticBalance] = useState<Decimal>(new Decimal(0));
  const [isLoading, setIsLoading] = useState(true);
  const [maticAmount, setMaticAmount] = useState(0);
  const [SFLAmount, setSFLAmount] = useState(0);
  const [maticInputError, setMaticInputError] = useState<string | null>(null);
  const { t } = useAppTranslation();

  const amountOutMin = SFLAmount * 0.99;

  useEffect(() => {
    const fetchMaticBalance = async () => {
      setIsLoading(true);
      const balance = await wallet.getMaticBalance();

      setMaticBalance(balance);
      setIsLoading(false);
    };

    if (isOpen) {
      fetchMaticBalance();
    }
  }, [isOpen]);

  const getSFLForMaticAmount = async (amount: number) => {
    try {
      const sfl = await wallet.getSFLForMatic(toWei(amount.toString()));

      if (sfl) {
        setMaticInputError(null);
      }

      setSFLAmount(sfl);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error(error.message);
    }
  };

  const handleMaticAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Strip the leading zero from numbers
    if (/^0+(?!\.)/.test(e.target.value) && e.target.value.length > 1) {
      e.target.value = e.target.value.replace(/^0/, "");
    }

    if (VALID_NUMBER.test(e.target.value)) {
      const input = Number(e.target.value.slice(0, INPUT_MAX_CHAR));

      setMaticAmount(input);

      if (input === 0) {
        setSFLAmount(0);
      } else {
        getSFLForMaticAmount(input);
      }
    }
  };

  const handleAddSFL = () => {
    gameService.send({
      type: "BUY_SFL",
      maticAmount: toWei(maticAmount.toString()),
      amountOutMin: toWei(amountOutMin.toString()),
    });
    onClose();
  };

  const maticBalString = fromWei(toBN(maticBalance.toString()));
  const formattedMaticBalance = setPrecision(
    new Decimal(maticBalString)
  ).toString();

  const amountGreaterThanBalance = toBN(toWei(maticAmount.toString())).gt(
    toBN(maticBalance.toString())
  );

  const Content = () => {
    if (isLoading) {
      return <span className="loading">{t("loading")}</span>;
    }

    return (
      <>
        <div className="p-2 pt-1 mb-2">
          <p className="mb-2 text-xs sm:text-sm">
            {t("addSFL.swapDetails")}
            <a
              className="underline hover:text-white"
              href="https://quickswap.exchange/#/swap?swapIndex=0&currency0=ETH&currency1=0xD1f9c58e33933a993A3891F8acFe05a68E1afC05"
              target="_blank"
              rel="noreferrer"
            >
              {"Quickswap"}
            </a>
            {"."}
          </p>
          <p className="mb-2 text-xs sm:text-sm">{t("addSFL.referralFee")}</p>
          <div className="flex flex-col mt-3">
            <h1 className="mb-2">{t("addSFL.swapTitle")}</h1>
            <div className="flex items-start justify-between mb-2">
              <div className="relative w-full mr-4">
                <input
                  type="number"
                  name="resourceAmount"
                  value={maticAmount}
                  disabled={false}
                  onInput={handleMaticAmountChange}
                  className={classNames(
                    "text-shadow shadow-inner shadow-black bg-brown-200 w-full p-2",
                    {
                      "text-error": amountGreaterThanBalance,
                    }
                  )}
                />
                <span className="text-xxs absolute top-1/2 -translate-y-1/2 right-2">
                  {t("balance")}
                  {formattedMaticBalance}
                </span>
              </div>
              <div className="w-[10%] flex self-center justify-center">
                <img src={matic} alt="selected item" className="w-6" />
              </div>
            </div>
            <div className="relative">
              {maticInputError && (
                <p className="absolute -top-1 text-error text-[11px] font-error">
                  {t("error.wentWrong")}
                </p>
              )}
              <div className="text-left w-full mt-3 mb-4">{t("for")}</div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="relative w-full mr-4">
                <input
                  type="number"
                  name="sflAmount"
                  value={SFLAmount}
                  readOnly
                  className="text-shadow shadow-inner shadow-black bg-brown-200 w-full p-2"
                />
              </div>
              <div className="w-[10%] flex self-center justify-center">
                <img className="w-6" src={token} alt="sfl token" />
              </div>
            </div>
            <div className="relative h-3">
              {!!amountOutMin && (
                <p className="text-xxs">
                  {t("addSFL.minimumReceived")}
                  {setPrecision(new Decimal(amountOutMin)).toNumber()}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-2 w-full">
          <Button
            onClick={handleAddSFL}
            disabled={amountGreaterThanBalance || !!maticInputError}
            className="whitespace-nowrap"
          >
            {t("addSFL")}
          </Button>
        </div>
      </>
    );
  };
  return <>{Content()}</>;
};
