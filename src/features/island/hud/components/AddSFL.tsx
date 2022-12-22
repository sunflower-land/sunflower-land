import React, { ChangeEvent, useEffect, useState } from "react";
import classNames from "classnames";
import { CloseButtonPanel } from "features/game/components/CloseablePanel";
import { Modal } from "react-bootstrap";
import token from "assets/icons/token_2.png";

import matic from "assets/icons/polygon-token.png";
import { Button } from "components/ui/Button";
import { wallet } from "lib/blockchain/wallet";
import { fromWei, toBN, toBN, toWei } from "web3-utils";
import Decimal from "decimal.js-light";
import { setPrecision } from "lib/utils/formatNumber";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const VALID_NUMBER = new RegExp(/^\d*\.?\d*$/);
const INPUT_MAX_CHAR = 10;

export const AddSFL: React.FC<Props> = ({ isOpen, onClose }) => {
  const [maticBalance, setMaticBalance] = useState(0);
  const [maticAmount, setMaticAmount] = useState(0);
  const [SFLAmount, setSFLAmount] = useState(0);

  useEffect(() => {
    const fetchMaticBalance = async () => {
      const balance = await wallet.getMaticBalance();

      setMaticBalance(balance);
    };

    fetchMaticBalance();
  }, []);

  const getSFLAmount = async () => {
    const sfl = await wallet.getSFLForMatic(
      toWei(toBN(maticAmount)).toString()
    );

    console.log({ sfl });

    setSFLAmount(sfl);
  };

  const handleMaticAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (VALID_NUMBER.test(e.target.value)) {
      setMaticAmount(Number(e.target.value.slice(0, INPUT_MAX_CHAR)));
    }

    getSFLAmount();
  };

  const handleSFLAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (VALID_NUMBER.test(e.target.value)) {
      setSFLAmount(Number(e.target.value.slice(0, INPUT_MAX_CHAR)));
    }
  };

  const handleAddSFL = () => {
    console.log("adding sfl");
  };

  const maticBalString = fromWei(toBN(maticBalance));
  const formattedMaticBalance = setPrecision(new Decimal(maticBalString));

  return (
    <Modal show={isOpen} centered onHide={onClose}>
      <CloseButtonPanel title="Add SFL" onClose={onClose}>
        <div className="p-2 pt-0">
          <p className="mb-2 text-xs sm:text-sm">
            Sunflower Land provides a way to swap Matic for SFL via quickswap.
            Sunflower Land takes a 5% fee to complete this transaction.
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
                  onChange={handleMaticAmountChange}
                  className={classNames(
                    "text-shadow shadow-inner shadow-black bg-brown-200 w-full p-2",
                    {
                      "text-error": false,
                    }
                  )}
                />
                <span className="text-xxs absolute top-1/2 -translate-y-1/2 right-2">{`Balance: ${formattedMaticBalance}`}</span>
              </div>
              <div className="w-[10%] flex self-center justify-center">
                <img src={matic} alt="selected item" className="w-6" />
              </div>
            </div>
            <div className="text-left w-full mb-2">for</div>
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
          </div>
        </div>
        <div className="flex space-x-2 w-full">
          <Button
            onClick={handleAddSFL}
            disabled={false}
            className="whitespace-nowrap"
          >
            Add SFL
          </Button>
        </div>
      </CloseButtonPanel>
    </Modal>
  );
};
