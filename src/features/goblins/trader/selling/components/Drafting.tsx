import React, { ChangeEvent, useState, useEffect } from "react";
import Decimal from "decimal.js-light";
import classNames from "classnames";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";

import { Inventory, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { getKeys } from "features/game/types/craftables";

import token from "assets/icons/token_2.png";
import { ItemLimits } from "lib/blockchain/Trader";
import { Draft } from "../lib/sellingMachine";

const MAX_SFL = new Decimal(10000);
const VALID_NUMBER = new RegExp(/^\d*\.?\d*$/);

interface DraftingProps {
  slotId: number;
  itemLimits: ItemLimits;
  inventory: Inventory;
  draft?: Draft;
  onBack: () => void;
  onUpdate: (slotId: number, draft: Draft) => void;
  onConfirm: () => void;
}

export const Drafting: React.FC<DraftingProps> = ({
  slotId,
  itemLimits,
  inventory,
  draft,
  onBack,
  onUpdate,
  onConfirm,
}) => {
  const inventoryItems = getKeys(inventory).filter((itemName) =>
    itemLimits[itemName].gt(0)
  );

  const [resourceAmount, setResourceAmount] = useState(
    Math.min(inventory[inventoryItems[0]]?.toNumber() as number, 1)
  );
  const [sflAmount, setSflAmount] = useState(1);
  const [selected, setSelected] = useState<InventoryItemName>(
    inventoryItems[0]
  );

  // Execute on first load. draft will have value if backing from Confirming component
  useEffect(() => {
    if (draft) {
      setSelected(draft.resourceName);
      setResourceAmount(draft.resourceAmount);
      setSflAmount(draft.sfl);
    }
  }, []);

  useEffect(() => {
    onUpdate(slotId, {
      resourceName: selected,
      resourceAmount: resourceAmount,
      sfl: sflAmount,
    });
  }, [slotId, selected, resourceAmount, sflAmount]);

  const select = (itemName: InventoryItemName) => {
    setSelected(itemName);
    setResourceAmount(Math.min(inventory[itemName]?.toNumber() as number, 1));
  };

  const handleSflChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (VALID_NUMBER.test(e.target.value)) {
      setSflAmount(Number(e.target.value));
    }
  };

  const handleResourceChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (VALID_NUMBER.test(e.target.value)) {
      setResourceAmount(Number(e.target.value));
    }
  };

  const currentInventoryAmount = inventory[selected] || new Decimal(0);
  const maxSellAmount = itemLimits[selected];

  const disableListTradeButton =
    sflAmount === 0 ||
    resourceAmount === 0 ||
    new Decimal(sflAmount).gt(MAX_SFL) ||
    new Decimal(resourceAmount).gt(currentInventoryAmount);

  return (
    <>
      <div className="p-2">
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

        <div className="flex flex-col pt-4 pb-3">
          <h1 className="mb-4">Trade Details</h1>
          <div className="flex items-start justify-between mb-2">
            <div className="relative w-full mr-4">
              <input
                type="number"
                name="resourceAmount"
                value={resourceAmount}
                onChange={handleResourceChange}
                className={classNames(
                  "text-shadow shadow-inner shadow-black bg-brown-200 w-full p-2",
                  {
                    "text-error": new Decimal(resourceAmount).gt(
                      currentInventoryAmount || maxSellAmount
                    ),
                  }
                )}
              />
              <span className="text-xxs absolute top-1/2 -translate-y-1/2 right-2">{`Max: ${maxSellAmount}`}</span>
            </div>
            <div className="w-[10%] flex self-center justify-center">
              <img
                src={ITEM_DETAILS[selected].image}
                alt="selected item"
                className="w-6"
              />
            </div>
          </div>
          <div className="text-left w-full mb-2">for</div>
          <div className="flex items-center justify-between mb-2">
            <div className="relative w-full mr-4">
              <input
                type="number"
                name="sflAmount"
                value={sflAmount}
                onChange={handleSflChange}
                className={classNames(
                  "text-shadow shadow-inner shadow-black bg-brown-200 w-full p-2",
                  {
                    "text-error": new Decimal(sflAmount).gt(MAX_SFL),
                  }
                )}
              />
              <span className="text-xxs absolute top-1/2 -translate-y-1/2 right-2">{`Max: ${MAX_SFL}`}</span>
            </div>
            <div className="w-[10%] flex self-center justify-center">
              <img src={token} alt="sfl token" className="w-6" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex space-x-2 w-full">
        <Button onClick={onBack}>Back</Button>
        <Button
          onClick={onConfirm}
          disabled={disableListTradeButton}
          className="whitespace-nowrap"
        >
          List trade
        </Button>
      </div>
    </>
  );
};
