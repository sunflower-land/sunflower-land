import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Decimal from "decimal.js-light";

import token from "assets/icons/token.gif";
import { Panel } from "components/ui/Panel";
import { Button } from "components/ui/Button";

const INCREMENT_AMOUNTS = [1, 10, 50, 100];

export interface Props {
  open: boolean;
  onClose: () => void;
  onSell: (amount: number) => void;
  cropAmount: Decimal;
  cropName: string;
  cropImage: string;
  cropSellPrice: Decimal;
}

export const CustomSellModal = ({
  open,
  onClose,
  onSell,
  cropAmount,
  cropName,
  cropImage,
  cropSellPrice,
}: Props) => {
  const [sellAmount, setSellAmount] = useState(cropAmount);

  useEffect(() => {
    setSellAmount(cropAmount);
  }, [open]);

  const handleSell = () => onSell(sellAmount.toNumber());

  const incrementSellAmount = (amount: number) => {
    const newAmount = sellAmount.plus(amount);
    setSellAmount(newAmount.greaterThan(cropAmount) ? cropAmount : newAmount);
  };

  const decrementSellAmount = (amount: number) => {
    const newAmount = sellAmount.minus(amount);
    setSellAmount(newAmount.lessThan(1) ? new Decimal(1) : newAmount);
  };

  const noCrop = cropAmount.equals(0);

  return (
    <Modal centered show={open} onHide={onClose}>
      <Panel className="md:w-4/5 m-auto">
        <div className="m-auto flex flex-col items-center">
          <span className="text-sm text-center text-shadow">
            How much of your {cropName} would you like to sell?
          </span>
          <div className="flex justify-center mt-3 mb-2">
            <span className="text-lg text-center text-shadow mr-1">
              {sellAmount.toNumber()}
            </span>
            <img src={cropImage} className="h-6" />
          </div>
          <div className="flex justify-center items-end mb-2">
            <span className="text-xs text-shadow text-center mt-2 ">+</span>
            <img src={token} className="h-5 mx-1" />
            <span className="text-xs text-shadow text-center mt-2 ">
              {`$${cropSellPrice.mul(sellAmount)}`}
            </span>
          </div>
          <div className="flex items-center justify-center mt-1 mb-2 p-1">
            {INCREMENT_AMOUNTS.map(
              (amount) =>
                cropAmount.greaterThan(amount) && (
                  <div key={amount} className="mr-1">
                    <Button
                      disabled={cropAmount.minus(sellAmount).lessThan(amount)}
                      className="text-xs mb-1"
                      onClick={() => incrementSellAmount(amount)}
                    >
                      +{amount}
                    </Button>
                    <Button
                      disabled={sellAmount.lessThanOrEqualTo(amount)}
                      className="text-xs"
                      onClick={() => decrementSellAmount(amount)}
                    >
                      -{amount}
                    </Button>
                  </div>
                )
            )}
            <div className="min-w-50">
              <Button
                disabled={cropAmount.equals(sellAmount)}
                className="text-xs mb-1 bg-brown-600"
                onClick={() => setSellAmount(cropAmount)}
              >
                Max
              </Button>
              <Button
                disabled={sellAmount.lessThanOrEqualTo(1)}
                className="text-xs bg-brown-600"
                onClick={() => setSellAmount(new Decimal(1))}
              >
                Min
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-content-around p-1">
          <Button disabled={noCrop} className="text-xs" onClick={handleSell}>
            Sell
          </Button>
          <Button disabled={noCrop} className="text-xs ml-2" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Panel>
    </Modal>
  );
};
