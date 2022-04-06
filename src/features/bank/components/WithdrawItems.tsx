import { useActor } from "@xstate/react";
import React, { useContext, useState } from "react";
import Decimal from "decimal.js-light";

import { Context } from "features/game/GameProvider";
import { InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { BLACKSMITH_ITEMS, TOOLS } from "features/game/types/craftables";
import { RESOURCES } from "features/game/types/resources";

import { Button } from "components/ui/Button";

import { Box } from "components/ui/Box";
import { KNOWN_IDS } from "features/game/types";
import { toWei } from "web3-utils";
import { getItemUnit } from "features/game/lib/conversion";

type SelectedItem = {
  item: InventoryItemName;
  amount: Decimal;
};

const WITHDRAWABLE_ITEMS = Object.keys({
  ...BLACKSMITH_ITEMS,
  ...TOOLS,
  ...RESOURCES,
}) as InventoryItemName[];

interface Props {
  onWithdraw: (ids: number[], amounts: string[]) => void;
}
export const WithdrawItems: React.FC<Props> = ({ onWithdraw }) => {
  const { gameService } = useContext(Context);
  const [game] = useActor(gameService);
  const inventory = game.context.state.inventory;

  const [selected, setSelected] = useState<SelectedItem[]>([]);
  const items = Object.keys(inventory) as InventoryItemName[];
  const validItems = items.filter(
    (itemName) => !!inventory[itemName] && WITHDRAWABLE_ITEMS.includes(itemName)
  );

  const withdraw = () => {
    onWithdraw(
      selected.map(({ item }) => KNOWN_IDS[item]),
      selected.map(({ item, amount }) =>
        toWei(amount.toString(), getItemUnit(item))
      )
    );
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
  return (
    <>
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

      <Button onClick={withdraw}>Withdraw</Button>
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
