import { useActor } from "@xstate/react";
import React, { useContext, useState } from "react";
import Decimal from "decimal.js-light";
import { toWei } from "web3-utils";

import { Context } from "features/game/GameProvider";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import * as Auth from "features/auth/lib/Provider";
import { KNOWN_IDS } from "features/game/types";
import { shortAddress } from "features/hud/components/Address";
import { LimitedItems, TOOLS } from "features/game/types/craftables";
import { RESOURCES } from "features/game/types/resources";

import { Button } from "components/ui/Button";

import { metamask } from "lib/blockchain/metamask";

import token from "assets/icons/token.gif";
import upArrow from "assets/icons/arrow_up.png";
import downArrow from "assets/icons/arrow_down.png";

import { getTax } from "lib/utils/tax";
import { getItemUnit } from "features/game/lib/conversion";
import { Box } from "components/ui/Box";
import { canWithdraw } from "features/game/lib/whitelist";

type SelectedItem = {
  item: InventoryItemName;
  amount: Decimal;
};

const WITHDRAWABLE_ITEMS = Object.keys({
  ...LimitedItems,
  ...TOOLS,
  ...RESOURCES,
}) as InventoryItemName[];

interface Props {
  onClose: () => void;
}
export const Withdraw: React.FC<Props> = ({ onClose }) => {
  const { gameService } = useContext(Context);
  const [game] = useActor(gameService);
  const inventory = game.context.state.inventory;

  const [selected, setSelected] = useState<SelectedItem[]>([]);
  const [amount, setAmount] = useState<Decimal | string>(new Decimal(0));

  const items = Object.keys(inventory) as InventoryItemName[];
  const validItems = items.filter(
    (itemName) => !!inventory[itemName] && WITHDRAWABLE_ITEMS.includes(itemName)
  );

  // In order to be able to type into the input box amount needs to be able to be a string
  // for when the user deletes the 0. safeAmount is a getter that will return amount as a Decimal
  const safeAmount = (value: Decimal | string): Decimal => {
    return typeof value !== "string" ? value : new Decimal(0);
  };

  const onWithdraw = async () => {
    gameService.send("WITHDRAW", {
      ids: selected.map(({ item }) => KNOWN_IDS[item]),
      amounts: selected.map(({ item, amount }) =>
        toWei(amount.toString(), getItemUnit(item))
      ),
      sfl: toWei(amount.toString()),
    });

    onClose();
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

  const enabled = canWithdraw(metamask.myAccount as string);

  if (!enabled) {
    return <span>Coming soon...</span>;
  }

  return (
    <>
      <h1 className="text-shadow">
        You can only withdraw items that you have synced to the blockchain.
      </h1>

      <h1 className="text-shadow mt-4 underline">Available resources:</h1>

      <div className="flex flex-wrap  h-fit mt-2">
        {validItems.length === 0 && (
          <span className="text-white text-shadow text-sm">
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

      {validItems.length > 0 && (
        <>
          <h1 className="text-shadow mt-4 underline">Selected resources:</h1>

          {selected.length === 0 && (
            <span className="text-white text-shadow text-sm">
              No items selected
            </span>
          )}
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
        </>
      )}

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
          {`You will recieve: ${safeAmount(amount)
            .mul((100 - tax) / 100)
            .toFixed(1)}`}
        </span>
        <img src={token} className="w-4 ml-2 img-highlight" />
      </div>

      <h1 className="text-shadow text-sm mt-4 mb-2">
        Your address: {shortAddress(metamask.myAccount || "XXXX")}
      </h1>

      <Button
        onClick={onWithdraw}
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
