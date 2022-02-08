import { useActor } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Decimal from "decimal.js-light";

import { Context } from "features/game/GameProvider";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import * as Auth from "features/auth/lib/Provider";
import { KNOWN_IDS } from "features/game/types";
import { Crop, SEEDS } from "features/game/types/crops";
import { Craftable, FOODS, TOOLS, NFTs } from "features/game/types/craftables";
import { Panel } from "components/ui/Panel";
import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { metamask } from "lib/blockchain/metamask";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

type SelectedItem = {
  item: InventoryItemName;
  amount: Decimal;
}

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
  const [amount, setAmount] = useState(new Decimal(0));

  const items = Object.keys(inventory) as InventoryItemName[];
  const validItems = items.filter((itemName) => !!inventory[itemName]);

  // Reset the input on open
  useEffect(() => {
    if (isOpen) {
      setState("input");
      setSelected([]);
      setTo(metamask.myAccount as string);
      setAmount(new Decimal(0));
    }

  }, [isOpen]);

  const onWithdraw = async () => {
    setState("withdrawing");

    try {
      await metamask.getSunflowerLand().withdraw({
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

  const toggle = (itemName: InventoryItemName, type: string) => {
    let itemInfo: any = undefined;
    Object.values(FOODS).forEach((item) => {
      if (item.name == itemName) {
        itemInfo = item;
      }
    });
    Object.values(TOOLS).forEach((item) => {
      if (item.name == itemName) {
        itemInfo = item;
      }
    });
    Object.values(SEEDS).forEach((item) => {
      if (item.name == itemName) {
        itemInfo = item;
      }
    });
    Object.values(NFTs).forEach((item) => {
      if (item.name == itemName) {
        itemInfo = item;
      }
    });
    const itemIndex = selected.findIndex(inv => inv.item === itemName);
    if (itemIndex > -1) {
      if (type == 'plus')
        selected[itemIndex].amount = selected[itemIndex].amount.plus(1);
      else if (type == 'minus')
        selected[itemIndex].amount = selected[itemIndex].amount.minus(1);

      if (type == 'plus')
        inventory[itemName] = inventory[itemName]?.minus(1);
      else if (type == 'minus')
        inventory[itemName] = inventory[itemName]?.plus(1);
      if (selected[itemIndex]?.amount.toNumber() == 0)
        selected.splice(itemIndex, 1);
      setSelected([...selected]);
    } else {
      setSelected([...selected, {item:itemName, amount:new Decimal(1)}]);
      inventory[itemName] = inventory[itemName]?.minus(1);
    }
    if (type == 'plus') {
      if (itemInfo.price) {
        setAmount(amount?.plus(itemInfo.price));
      }
    } else if (type == 'minus') {
      if (itemInfo.price) {
        setAmount(amount?.minus(itemInfo.price));
      }
    }
  };

  const Content = () => {
    if (state === "input") {
      return (
        <>
          <h1 className="text-shadow">Save your farm first!</h1>

          <h1 className="text-shadow mt-4">
            Resources available to withdraw:
          </h1>

          <div className="flex flex-wrap  h-fit mt-2">
            {validItems.length === 0 && (
              <span className="text-white text-shadow">
                You have no items in your inventory.
              </span>
            )}
            {validItems.map((itemName) => {
              if (inventory[itemName]!.toNumber() > 0)
                return <Box
                  count={inventory[itemName]}
                  // isSelected={selected.includes(itemName)}
                  key={itemName}
                  onClick={() => toggle(itemName, 'plus')}
                  image={ITEM_DETAILS[itemName].image}
                />
            })}
          </div>

          <h1 className="text-shadow mt-4">
            Resources you will withdraw:
          </h1>

          <div className="flex flex-wrap  h-fit mt-2">
          {selected.map((item) => (
            <Box
              count={item.amount}
              // isSelected={selected.includes(itemName)}
              key={item.item}
              onClick={() => toggle(item.item, 'minus')}
              image={ITEM_DETAILS[item.item].image}
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
