import { useActor } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Decimal from "decimal.js-light";

import { Context } from "features/game/GameProvider";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import * as Auth from "features/auth/lib/Provider";
import { KNOWN_IDS } from "features/game/types";
import { Panel } from "components/ui/Panel";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { metamask } from "lib/blockchain/metamask";
import upArrow from "assets/icons/arrow_up.png";
import downArrow from "assets/icons/arrow_down.png";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type SelectedItem = {
  item: InventoryItemName;
  amount: Decimal;
};

type WithdrawState = "input" | "withdrawing" | "success" | "error";

export const Withdraw: React.FC<Props> = ({ isOpen, onClose }) => {
  const { authService } = useContext(Auth.Context);
  const { gameService } = useContext(Context);
  const [game] = useActor(gameService);
  const inventory = game.context.state.inventory;

  const [state, setState] = useState<WithdrawState>("input");
  const [selected, setSelected] = useState<SelectedItem[]>([]);
  const [to, setTo] = useState(metamask.myAccount as string);
  // TODO: add a way to let them specify the amount to withdraw
  const [amount, setAmount] = useState(game.context.state.balance);

  const items = Object.keys(inventory) as InventoryItemName[];
  const validItems = items.filter((itemName) => !!inventory[itemName]);

  // Reset the input on open
  useEffect(() => {
    if (isOpen) {
      setState("input");
      setSelected([]);
      setTo(metamask.myAccount as string);
      setAmount(game.context.state.balance);
    }
  }, [isOpen]);

  const onWithdraw = async () => {
    setState("withdrawing");

    try {
      await metamask.getSessionManager().withdraw({
        farmId: game.context.state.id,
        amounts: selected.map((item) => item.amount),
        ids: selected.map((itemName) => KNOWN_IDS[itemName.item]),
        to,
        tokens: amount,
      });

      setState("success");
    } catch {
      setState("error");
      // TODO: handle error
    }
  };

  const onKeepPlaying = () => {
    authService.send("REFRESH");
  };

  const toggle = (itemName: InventoryItemName, type: "plus" | "minus") => {
    const itemIndex = selected.findIndex((inv) => inv.item === itemName);
    if (itemIndex > -1) {
      if (type === "plus") {
        selected[itemIndex].amount = selected[itemIndex].amount.plus(1);
        inventory[itemName] = inventory[itemName]?.minus(1);
      } else if (type === "minus") {
        selected[itemIndex].amount = selected[itemIndex].amount.minus(1);
        inventory[itemName] = inventory[itemName]?.plus(1);
      }

      if (selected[itemIndex]?.amount.toNumber() == 0)
        selected.splice(itemIndex, 1);
      setSelected([...selected]);
    } else {
      setSelected([...selected, { item: itemName, amount: new Decimal(1) }]);
      inventory[itemName] = inventory[itemName]?.minus(1);
    }
  };
  const roundToOneDecimal = (number: number) => Math.round(number * 10) / 10;

  const onWithdrawChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.valueAsNumber > 0) {
      if (
        e.target.valueAsNumber <
        game.context.state.balance.toDecimalPlaces(2).toNumber()
      )
        setAmount(new Decimal(e.target.valueAsNumber));
    }
  };

  const setMax = () => {
    setAmount(game.context.state.balance);
  };

  const incrementWithdraw = () => {
    if (
      amount.plus(0.1).toNumber() <
      game.context.state.balance.toDecimalPlaces(2, 1).toNumber()
    )
      setAmount((prevState) => prevState.plus(0.1));
  };

  const decrementWithdraw = () => {
    if (amount.toNumber() > 0.01) {
      if (amount.minus(0.1).toNumber() >= 0)
        setAmount((prevState) => prevState.minus(0.1));
    }
  };

  const Content = () => {
    if (state === "input") {
      return (
        <>
          <h1 className="text-shadow">Save your farm first!</h1>

          <h1 className="text-shadow mt-4">Resources available to withdraw:</h1>

          <div className="flex flex-wrap  h-fit mt-2">
            {validItems.length === 0 && (
              <span className="text-white text-shadow">
                You have no items in your inventory.
              </span>
            )}
            {validItems.map(
              (itemName) =>
                inventory[itemName]!.toNumber() > 0 && (
                  <Box
                    count={inventory[itemName]}
                    // isSelected={selected.includes(itemName)}
                    key={itemName}
                    onClick={() => toggle(itemName, "plus")}
                    image={ITEM_DETAILS[itemName].image}
                  />
                )
            )}
          </div>

          <h1 className="text-shadow mt-4">Resources you will withdraw:</h1>

          <div className="flex flex-wrap  h-fit mt-2">
            {selected.map((item) => (
              <Box
                count={item.amount}
                // isSelected={selected.includes(itemName)}
                key={item.item}
                onClick={() => toggle(item.item, "minus")}
                image={ITEM_DETAILS[item.item].image}
              />
            ))}
          </div>

          <h1 className="text-shadow mt-4">
            <div className="flex items-center mb-3">
              <div className="relative mr-4">
                Tokens:
                <input
                  type="number"
                  className="text-shadow shadow-inner shadow-black bg-brown-200 w-24 p-2 text-center"
                  step="0.1"
                  min={0}
                  value={amount
                    .toDecimalPlaces(2, Decimal.ROUND_DOWN)
                    .toNumber()}
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
          </h1>

          <h1 className="text-shadow mt-4">Your address: {to}</h1>
          <span className="text-xs">TODO: disclaimer</span>
          <Button onClick={onWithdraw}>Withdraw</Button>
        </>
      );
    }

    if (state === "withdrawing") {
      return <span>Withdrawing...</span>;
    }

    if (state === "success") {
      return (
        <>
          <span>Congratulations, your tokens have been send to X</span>
          <Button onClick={onKeepPlaying}>Keep playing</Button>
        </>
      );
    }

    return <span>Something went wrong :(</span>;
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Panel>{Content()}</Panel>
    </Modal>
  );
};
