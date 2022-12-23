import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import classNames from "classnames";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "react-bootstrap";
import token from "assets/icons/token_2.png";

import matic from "assets/icons/polygon-token.png";
import { Button } from "components/ui/Button";
import { wallet } from "lib/blockchain/wallet";
import { fromWei, toBN, toWei } from "web3-utils";
import Decimal from "decimal.js-light";
import { setPrecision } from "lib/utils/formatNumber";
import { Context } from "features/game/GameProvider";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const VALID_NUMBER = new RegExp(/^\d*\.?\d*$/);
const INPUT_MAX_CHAR = 10;

export const AddSFL: React.FC<Props> = ({ isOpen, onClose }) => {
  const { gameService } = useContext(Context);
  const [maticBalance, setMaticBalance] = useState(0);
  const [maticAmount, setMaticAmount] = useState(0);
  const [SFLAmount, setSFLAmount] = useState(0);
  const [maticInputError, setMaticInputError] = useState<string | null>(null);
  const [SFLInputError, setSFLInputError] = useState<string | null>(null);

  const minAmountOut = SFLAmount * 0.99;

  useEffect(() => {
    const fetchMaticBalance = async () => {
      const balance = await wallet.getMaticBalance();

      setMaticBalance(balance);
    };

    fetchMaticBalance();
  }, []);

  const getSFLForMaticAmount = async (amount: number) => {
    try {
      const sfl = await wallet.getSFLForMatic(toWei(amount.toString()));

      if (sfl) {
        setMaticInputError(null);
        setSFLInputError(null);
      }

      setSFLAmount(sfl);
    } catch (error: any) {
      if (error.message.includes("INSUFFICIENT_INPUT_AMOUNT")) {
        setMaticInputError("Insufficient input amount");
      }
    }
  };

  const getMaticForSFLAmount = async (amount: number) => {
    try {
      const matic = await wallet.getMaticForSFL(toWei(amount.toString()));

      if (matic) {
        setMaticInputError(null);
        setSFLInputError(null);
      }

      setMaticAmount(matic);
    } catch (error: any) {
      if (error.message.includes("INSUFFICIENT_INPUT_AMOUNT")) {
        setSFLInputError("Insufficient output amount");
      }
    }
  };

  const handleMaticAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (VALID_NUMBER.test(e.target.value)) {
      const input = Number(e.target.value.slice(0, INPUT_MAX_CHAR));

      setMaticAmount(input);

      if (input === 0) {
        setSFLAmount(0);
      }

      getSFLForMaticAmount(input);
    }
  };

  const handleSFLAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (VALID_NUMBER.test(e.target.value)) {
      const input = Number(e.target.value.slice(0, INPUT_MAX_CHAR));

      setSFLAmount(Number(e.target.value.slice(0, INPUT_MAX_CHAR)));

      if (input === 0) {
        setMaticAmount(0);
      }

      getMaticForSFLAmount(input);
    }
  };

  const handleAddSFL = () => {
    gameService.send({ type: "BUY_SFL", maticAmount, SFLAmount: minAmountOut });
  };

  const maticBalString = fromWei(toBN(maticBalance));
  const formattedMaticBalance = setPrecision(new Decimal(maticBalString));

  const amountGreaterThanBalance = toBN(toWei(maticAmount.toString())).gt(
    toBN(maticBalance)
  );

  return (
    <Modal show={isOpen} centered onHide={onClose}>
      <CloseButtonPanel title="Add SFL" onClose={onClose}>
        <div className="p-2 pt-0">
          <p className="mb-2 text-xs sm:text-sm">
            Sunflower Land provides a way to swap Matic for SFL via Quickswap.
          </p>
          <p className="mb-2 text-xs sm:text-sm">
            Sunflower Land takes a 5% referral fee to complete this transaction.
          </p>
          <div className="flex flex-col">
            <h1 className="mb-2">Swap Details</h1>
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
                <span className="text-xxs absolute top-1/2 -translate-y-1/2 right-2">{`Balance: ${formattedMaticBalance}`}</span>
              </div>
              <div className="w-[10%] flex self-center justify-center">
                <img src={matic} alt="selected item" className="w-6" />
              </div>
            </div>
            <div className="relative">
              {maticInputError && (
                <p className="absolute text-error text-xxs font-error">
                  {maticInputError}
                </p>
              )}
              <div className="text-left w-full my-4">for</div>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="relative w-full mr-4">
                <input
                  type="number"
                  name="sflAmount"
                  value={SFLAmount}
                  disabled={false}
                  onChange={handleSFLAmountChange}
                  className={classNames(
                    "text-shadow shadow-inner shadow-black bg-brown-200 w-full p-2",
                    {
                      "text-error": false,
                    }
                  )}
                />
              </div>
              <div className="w-[10%] flex self-center justify-center">
                <img className="w-6" src={token} alt="sfl token" />
              </div>
            </div>
            <div className="relative">
              {SFLInputError && (
                <p className="absolute text-error text-xxs font-error">
                  {SFLInputError}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-2 w-full">
          <Button
            onClick={handleAddSFL}
            disabled={amountGreaterThanBalance}
            className="whitespace-nowrap"
          >
            Add SFL
          </Button>
        </div>
      </CloseButtonPanel>
    </Modal>
  );
};
