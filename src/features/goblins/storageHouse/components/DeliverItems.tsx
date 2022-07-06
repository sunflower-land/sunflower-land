import { useActor } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";
import Decimal from "decimal.js-light";

import { Context } from "features/game/GoblinProvider";
import { Inventory, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { shortAddress } from "features/farming/hud/components/Address";
import { KNOWN_IDS } from "features/game/types";
import { getItemUnit } from "features/game/lib/conversion";

import { Button } from "components/ui/Button";
import { Box } from "components/ui/Box";

import goblinHead from "assets/npcs/goblin_head.png";
import player from "assets/icons/player.png";
import remove from "assets/icons/cancel.png";

import { toWei } from "web3-utils";
import { metamask } from "lib/blockchain/metamask";

import { getKeys } from "features/game/types/craftables";
import { getDeliverableItems } from "../lib/storageItems";

interface Props {
  onWithdraw: () => void;
  allowLongpressWithdrawal?: boolean;
}

function transferItem(
  itemName: InventoryItemName,
  setFrom: React.Dispatch<
    React.SetStateAction<Partial<Record<InventoryItemName, Decimal>>>
  >,
  setTo: React.Dispatch<
    React.SetStateAction<Partial<Record<InventoryItemName, Decimal>>>
  >
) {
  let amount = 1;

  // Subtract 1 or remaining
  setFrom((prev) => {
    const remaining = prev[itemName]!.toNumber();
    if (remaining < 1) {
      amount = remaining;
    }
    return {
      ...prev,
      [itemName]: prev[itemName]?.minus(amount),
    };
  });

  // Add 1 or remaining
  setTo((prev) => ({
    ...prev,
    [itemName]: (prev[itemName] || new Decimal(0)).add(amount),
  }));
}

export const DeliverItems: React.FC<Props> = ({ onWithdraw }) => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  const [inventory, setInventory] = useState<Inventory>({});
  const [selected, setSelected] = useState<Inventory>({});

  useEffect(() => {
    // Only grab the deliverable items
    const resourceInventory = getDeliverableItems(
      goblinState.context.state.inventory
    );
    setInventory(resourceInventory);
    setSelected({});
  }, []);

  const withdraw = () => {
    const ids = getKeys(selected).map((item) => KNOWN_IDS[item]);
    const amounts = getKeys(selected).map((item) =>
      toWei(selected[item]?.toString() as string, getItemUnit(item))
    );

    goblinService.send("WITHDRAW", {
      ids,
      amounts,
      sfl: "0",
      captcha: goblinState.context.sessionId,
    });

    onWithdraw();
  };

  const onAdd = (itemName: InventoryItemName) => {
    // Transfer from inventory to selected
    let amount = 1;

    // Subtract 1 or remaining
    setInventory((prev) => {
      const remaining = prev[itemName]!.toNumber();
      if (remaining < 1) {
        amount = remaining;
      }
      return {
        ...prev,
        [itemName]: prev[itemName]?.minus(amount),
      };
    });

    // Add 1 or remaining
    setSelected((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] || new Decimal(0)).add(amount),
    }));
  };

  const onRemove = (itemName: InventoryItemName) => {
    setInventory((prev) => ({
      ...prev,
      [itemName]: goblinState.context.state.inventory[itemName],
    }));

    console.log({ itemName });
    setSelected((prev) => ({
      ...prev,
      [itemName]: new Decimal(0),
    }));
  };

  const inventoryItems = getKeys(inventory).filter((item) =>
    inventory[item]?.gt(0)
  );

  const selectedItems = getKeys(selected).filter((item) =>
    selected[item]?.gt(0)
  );

  const deliveryFee = 30;

  return (
    <>
      <div className="mt-3 lf">
        <h2 className="mb-1 text-sm">Select items to deliver:</h2>
        <div className="flex flex-wrap h-fit -ml-1.5 mb-2">
          {inventoryItems.map((itemName) => {
            const details = ITEM_DETAILS[itemName];

            const totalCountOfItemType = inventory[itemName] || new Decimal(0);

            return (
              <Box
                count={totalCountOfItemType}
                key={itemName}
                onClick={() => onAdd(itemName)}
                image={details.image}
                canBeLongPressed
              />
            );
          })}
        </div>

        <div className="mt-2" style={{ minHeight: "110px" }}>
          <h2 className="text-sm">You will receive:</h2>
          <div className="mt-2 -ml-1.5">
            {selectedItems.map((itemName) => {
              console.log({ itemName, selected });

              return (
                <div className="flex items-center pl-1 mb-2">
                  <div className="w-80 flex items-center">
                    <img
                      src={ITEM_DETAILS[itemName].image}
                      className="h-6 pr-2"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm">{`${selected[itemName]
                        ?.mul(1 - deliveryFee / 100)
                        .toString()} ${itemName}`}</span>
                      <span className="text-xs">30% delivery fee</span>
                    </div>
                  </div>

                  <img
                    src={remove}
                    className="h-4 cursor-pointer"
                    onClick={() => onRemove(itemName)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-white border-t-2 w-full my-3" />
        <div className="flex items-center mt-2 mb-2  border-white">
          <img src={player} className="h-8 mr-2" />
          <div>
            <p className="text-sm">Deliver to your wallet</p>
            <p className="text-sm">
              {shortAddress(metamask.myAccount || "XXXX")}
            </p>
          </div>
        </div>

        <span className="text-sm mb-4">
          Once delivered, you will be able to view your items on Open Sea.
        </span>
      </div>

      <Button onClick={withdraw} disabled={selectedItems.length <= 0}>
        Deliver
      </Button>

      <span className="text-xs underline mt-2">
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
