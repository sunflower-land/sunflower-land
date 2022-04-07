import { useActor } from "@xstate/react";
import React, { useContext, useState } from "react";
import Decimal from "decimal.js-light";
import { toWei } from "web3-utils";

import { Context } from "features/game/GameProvider";

import { shortAddress } from "features/hud/components/Address";

import { Button } from "components/ui/Button";

import { metamask } from "lib/blockchain/metamask";

import token from "assets/icons/token.gif";
import upArrow from "assets/icons/arrow_up.png";
import downArrow from "assets/icons/arrow_down.png";

import { getTax } from "lib/utils/tax";

interface Props {
  onWithdraw: (sfl: string) => void;
}
export const WithdrawTokens: React.FC<Props> = ({ onWithdraw }) => {
  const { gameService } = useContext(Context);
  const [game] = useActor(gameService);

  const [amount, setAmount] = useState<Decimal | string>(new Decimal(0));

  // In order to be able to type into the input box amount needs to be able to be a string
  // for when the user deletes the 0. safeAmount is a getter that will return amount as a Decimal
  const safeAmount = (value: Decimal | string): Decimal => {
    return typeof value !== "string" ? value : new Decimal(0);
  };

  const withdraw = () => {
    onWithdraw(toWei(amount.toString()));
  };
  const onWithdrawChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "") {
      setAmount("");
    } else {
      setAmount(new Decimal(Number(e.target.value)));
    }
  };

  const setMax = () => {
    setAmount(game.context.state.balance);
  };

  const incrementWithdraw = () => {
    if (
      safeAmount(amount).plus(0.1).toNumber() <
      game.context.state.balance.toDecimalPlaces(2, 1).toNumber()
    )
      setAmount((prevState) => safeAmount(prevState).plus(0.1));
  };

  const decrementWithdraw = () => {
    if (safeAmount(amount).toNumber() > 0.01) {
      if (safeAmount(amount).minus(0.1).toNumber() >= 0)
        setAmount((prevState) => safeAmount(prevState).minus(0.1));
    }
  };

  // Use base 1000
  const tax = getTax(typeof amount !== "string" ? amount : new Decimal(0)) / 10;

  return (
    <>
      <div className="flex flex-wrap mt-4">
        <span className="text-shadow  underline">Tokens:</span>
      </div>

      <div className="flex items-center mb-2 mt-2">
        <div className="relative mr-4">
          <input
            type="number"
            className="text-shadow shadow-inner shadow-black bg-brown-200 w-32 p-2 text-center"
            step="0.1"
            min={0}
            value={
              typeof amount === "string"
                ? ""
                : amount.toDecimalPlaces(2, Decimal.ROUND_DOWN).toNumber()
            }
            onChange={onWithdrawChange}
          />
          <img
            src={upArrow}
            alt="increment donation value"
            className="cursor-pointer absolute -right-4 top-0"
            onClick={incrementWithdraw}
          />
          <img
            src={downArrow}
            alt="decrement donation value"
            className="cursor-pointer absolute -right-4 bottom-0"
            onClick={decrementWithdraw}
          />
        </div>
        <Button className="w-24 ml-6" onClick={setMax}>
          Max
        </Button>
      </div>
      <div className="flex items-center">
        <a
          className="text-xs underline"
          href="https://docs.sunflower-land.com/fundamentals/withdrawing"
          target="_blank"
          rel="noreferrer"
        >
          {tax}% fee
        </a>
      </div>
      <div className="flex items-center">
        <span className="text-xs">
          {`You will receive: ${safeAmount(amount)
            .mul((100 - tax) / 100)
            .toFixed(1)}`}
        </span>
        <img src={token} className="w-4 ml-2 img-highlight" />
      </div>

      <h1 className="text-shadow text-sm mt-4 mb-2">
        Your address: {shortAddress(metamask.myAccount || "XXXX")}
      </h1>

      <Button
        onClick={withdraw}
        disabled={safeAmount(amount).gte(game.context.state.balance)}
      >
        Withdraw
      </Button>
      <span className="text-xs underline">
        <a
          href="https://docs.sunflower-land.com/fundamentals/withdrawing"
          target="_blank"
          rel="noreferrer"
        >
          Read more
        </a>
      </span>
    </>
  );
};
