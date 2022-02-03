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

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type WithdrawState = "input" | "withdrawing" | "success" | "error";

export const Withdraw: React.FC<Props> = ({ isOpen, onClose }) => {
  const { authService } = useContext(Auth.Context);
  const { gameService } = useContext(Context);
  const [game] = useActor(gameService);
  const inventory = game.context.state.inventory;

  const [state, setState] = useState<WithdrawState>("input");
  const [selected, setSelected] = useState<InventoryItemName[]>([]);
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
      await metamask.getSunflowerLand().withdraw({
        farmId: game.context.state.id,
        amounts: selected.map(
          (itemName) => new Decimal(inventory[itemName] || 0)
        ),
        ids: selected.map((itemName) => KNOWN_IDS[itemName]),
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

  const toggle = (item: InventoryItemName) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  const Content = () => {
    if (state === "input") {
      return (
        <>
          <h1 className="text-shadow">Save your farm first!</h1>

          <h1 className="text-shadow mt-4">
            Which resources would you like to withdraw?
          </h1>

          <div className="w-3/5 flex flex-wrap  h-fit mt-2">
            {validItems.length === 0 && (
              <span className="text-white text-shadow">
                You have no items in your inventory.
              </span>
            )}
            {validItems.map((itemName) => (
              <Box
                count={inventory[itemName]}
                isSelected={selected.includes(itemName)}
                key={itemName}
                onClick={() => toggle(itemName)}
                image={ITEM_DETAILS[itemName].image}
              />
            ))}
          </div>

          <h1 className="text-shadow mt-4">
            Tokens: {amount.toDecimalPlaces(2, Decimal.ROUND_DOWN).toString()}
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
