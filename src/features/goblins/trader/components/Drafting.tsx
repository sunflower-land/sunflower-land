import React, { useState } from "react";
import Decimal from "decimal.js-light";

import { Box } from "components/ui/Box";
import { OuterPanel } from "components/ui/Panel";

import { Inventory, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { Button } from "components/ui/Button";

import token from "assets/icons/token.gif";
import { Draft } from "../lib/tradingPostMachine";
import { ItemLimits } from "lib/blockchain/Trader";

const MAX_SFL = new Decimal(10000);

interface DraftingProps {
  slotId: number;
  itemLimits: ItemLimits;
  inventory: Inventory;
  onCancel: () => void;
  onList: (draft: Draft) => void;
}

export const Drafting: React.FC<DraftingProps> = ({
  slotId,
  itemLimits,
  inventory,
  onCancel,
  onList,
}) => {
  const inventoryItems = (Object.keys(inventory) as InventoryItemName[]).filter(
    (itemName) => itemLimits[itemName].gt(0)
  );

  const [resourceAmount, setResourceAmount] = useState(
    Math.min(inventory[inventoryItems[0]]?.toNumber() as number, 1)
  );
  const [sflAmount, setSFLAmount] = useState(1);
  const [selected, setSelected] = useState<InventoryItemName>(
    inventoryItems[0]
  );

  const draft: Draft = {
    slotId: slotId,
    resourceName: selected,
    resourceAmount: resourceAmount,
    sfl: sflAmount,
  };

  const select = (itemName: InventoryItemName) => {
    setSelected(itemName);

    const amount = Math.min(inventory[itemName]?.toNumber() as number, 1);
    setResourceAmount(amount);
  };

  return (
    <div>
      <span>Select an item to list</span>
      <div className="flex flex-wrap mt-2">
        {inventoryItems.map((itemName) => (
          <Box
            count={inventory[itemName]}
            isSelected={selected === itemName}
            key={itemName}
            onClick={() => select(itemName)}
            image={ITEM_DETAILS[itemName].image}
          />
        ))}
      </div>
      <span className="text-xs">{`Max: ${itemLimits[selected]}`}</span>
      <div className="flex">
        <OuterPanel className="w-1/2 flex flex-col items-center">
          <span className="text-xs">{selected}</span>
          <img src={ITEM_DETAILS[selected].image} className="w-12" />
          <span className="text-lg py-2">{resourceAmount}</span>
          <div className="flex w-full">
            <Button
              className="text-sm"
              onClick={() => setResourceAmount((prev) => prev - 10)}
              disabled={resourceAmount < 10}
            >
              -10
            </Button>
            <Button
              className="text-sm"
              onClick={() => setResourceAmount((prev) => prev - 1)}
              disabled={resourceAmount < 1}
            >
              -1
            </Button>
            <Button
              className="text-sm"
              onClick={() => setResourceAmount((prev) => prev + 1)}
              disabled={
                resourceAmount + 1 >
                (inventory[selected] || new Decimal(0)).toNumber()
              }
            >
              +1
            </Button>
            <Button
              className="text-sm"
              onClick={() => setResourceAmount((prev) => prev + 10)}
              disabled={
                resourceAmount + 10 >
                (inventory[selected] || new Decimal(0)).toNumber()
              }
            >
              +10
            </Button>
          </div>
        </OuterPanel>
        <OuterPanel className="w-1/2  flex flex-col items-center">
          <span className="text-xs">Sell amount</span>
          <img src={token} className="w-12" />
          <span className="text-lg py-2">{sflAmount}</span>
          <div className="flex w-full">
            <Button
              className="text-sm"
              onClick={() => setSFLAmount((prev) => prev - 10)}
              disabled={sflAmount < 10}
            >
              -10
            </Button>
            <Button
              className="text-sm"
              onClick={() => setSFLAmount((prev) => prev - 1)}
              disabled={sflAmount < 1}
            >
              -1
            </Button>
            <Button
              className="text-sm"
              onClick={() => setSFLAmount((prev) => prev + 1)}
              disabled={MAX_SFL.lt(sflAmount + 1)}
            >
              +1
            </Button>
            <Button
              className="text-sm"
              onClick={() => setSFLAmount((prev) => prev + 10)}
              disabled={MAX_SFL.lt(sflAmount + 10)}
            >
              +10
            </Button>
          </div>
        </OuterPanel>
      </div>
      <div className="flex">
        <Button className="mt-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          className="mt-1"
          onClick={() => onList(draft)}
          disabled={sflAmount === 0 || resourceAmount === 0}
        >
          List trade
        </Button>
      </div>
    </div>
  );
};
