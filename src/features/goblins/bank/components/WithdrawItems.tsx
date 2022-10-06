import { useActor } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";
import Decimal from "decimal.js-light";

import { Context } from "features/game/GoblinProvider";
import { Inventory, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { shortAddress } from "lib/utils/shortAddress";
import { KNOWN_IDS } from "features/game/types";
import { getItemUnit } from "features/game/lib/conversion";

import { Button } from "components/ui/Button";
import { Box } from "components/ui/Box";

import player from "assets/icons/player.png";

import { toWei } from "web3-utils";
import { metamask } from "lib/blockchain/metamask";
import { canWithdraw } from "../lib/bankUtils";

import {
  getKeys,
  isLimitedItem,
  LimitedItemName,
} from "features/game/types/craftables";
import { mintCooldown } from "features/goblins/blacksmith/lib/mintUtils";
import { getBankItems } from "features/goblins/storageHouse/lib/storageItems";

interface Props {
  onWithdraw: (ids: number[], amounts: string[]) => void;
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

export const WithdrawItems: React.FC<Props> = ({
  onWithdraw,
  allowLongpressWithdrawal = true,
}) => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  const [inventory, setInventory] = useState<Inventory>({});
  const [selected, setSelected] = useState<Inventory>({});

  useEffect(() => {
    const bankItems = getBankItems(goblinState.context.state.inventory);
    setInventory(bankItems);
    setSelected({});
  }, []);

  const withdraw = () => {
    const ids = getKeys(selected).map((item) => KNOWN_IDS[item]);
    const amounts = getKeys(selected).map((item) =>
      toWei(selected[item]?.toString() as string, getItemUnit(item))
    );

    onWithdraw(ids, amounts);
  };

  const onAdd = (itemName: InventoryItemName) => {
    // Transfer from inventory to selected
    transferItem(itemName, setInventory, setSelected);
  };

  const onRemove = (itemName: InventoryItemName) => {
    // Transfer from selected to inventory
    transferItem(itemName, setSelected, setInventory);
  };

  const makeItemDetails = (itemName: InventoryItemName) => {
    const details = ITEM_DETAILS[itemName];

    return isLimitedItem(itemName)
      ? {
          ...goblinState.context.limitedItems[itemName as LimitedItemName],
          image: details.image,
        }
      : details;
  };

  const inventoryItems = getKeys(inventory)
    .filter((item) => inventory[item]?.gt(0))
    .sort((a, b) => KNOWN_IDS[a] - KNOWN_IDS[b]);

  const selectedItems = getKeys(selected)
    .filter((item) => selected[item]?.gt(0))
    .sort((a, b) => KNOWN_IDS[a] - KNOWN_IDS[b]);

  const getTotalNumberOfItemType = (itemName: InventoryItemName) => {
    const state = goblinState.context.state;
    // Return the number of chickens minus the ones that are currently laying eggs
    if (itemName === "Chicken" && inventory["Chicken"]) {
      const totalChicksLayingEggs = Object.keys(state.chickens).length;
      // Only hungry (unfed) chickens can be withdrawn
      const totalHungryChicks = inventory["Chicken"].sub(totalChicksLayingEggs);

      return new Decimal(totalHungryChicks);
    }

    return inventory[itemName] || new Decimal(0);
  };

  return (
    <>
      <div className="mt-3">
        <div className="flex items-center border-2 rounded-md border-black p-2 bg-green-background mb-3">
          <span className="text-xs">
            Items that are{" "}
            <a
              href="https://docs.sunflower-land.com/fundamentals/withdrawing#why-cant-i-withdraw-some-items"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              in use
            </a>{" "}
            or{" "}
            <a
              href="https://docs.sunflower-land.com/fundamentals/withdrawing#why-cant-i-withdraw-some-items"
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              still being built
            </a>{" "}
            by the goblins are not available to be withdrawn.
          </span>
        </div>
        <h2 className="mb-3">Select items to withdraw</h2>
        <div className="flex flex-wrap h-fit -ml-1.5">
          {inventoryItems.map((itemName) => {
            const details = makeItemDetails(itemName);
            const gameState = goblinState.context.state;

            const withdrawable = canWithdraw({
              item: itemName,
              game: gameState,
            });

            const cooldownInProgress =
              withdrawable &&
              mintCooldown({
                cooldownSeconds: details?.cooldownSeconds,
                mintedAt: details?.mintedAt,
              }) > 0;

            // This amount is used to block withdrawal of chickens who are in the process of laying eggs.
            const totalCountOfItemType = getTotalNumberOfItemType(itemName);
            // Once all the chickens that are available have been added the rest will be locked
            const locked =
              !withdrawable || cooldownInProgress || totalCountOfItemType.eq(0);

            return (
              <Box
                count={totalCountOfItemType}
                key={itemName}
                onClick={() => onAdd(itemName)}
                image={details.image}
                locked={locked}
                canBeLongPressed={allowLongpressWithdrawal}
                cooldownInProgress={cooldownInProgress}
              />
            );
          })}
          {/* Pad with empty boxes */}
          {inventoryItems.length < 4 &&
            new Array(4 - inventoryItems.length)
              .fill(null)
              .map((_, index) => <Box disabled key={index} />)}
        </div>

        <div className="mt-2">
          <h2 className="">Selected</h2>
          <div className="flex flex-wrap h-fit mt-2 -ml-1.5">
            {selectedItems.map((itemName) => {
              return (
                <Box
                  count={selected[itemName]}
                  key={itemName}
                  onClick={() => onRemove(itemName)}
                  canBeLongPressed={allowLongpressWithdrawal}
                  image={ITEM_DETAILS[itemName].image}
                />
              );
            })}
            {/* Pad with empty boxes */}
            {selectedItems.length < 4 &&
              new Array(4 - selectedItems.length)
                .fill(null)
                .map((_, index) => <Box disabled key={index} />)}
          </div>
        </div>

        <div className="border-white border-t-2 w-full my-3" />
        <div className="flex items-center mt-2 mb-2  border-white">
          <img src={player} className="h-8 mr-2" />
          <div>
            <p className="text-sm">Send to your wallet</p>
            <p className="text-sm">
              {shortAddress(metamask.myAccount || "XXXX")}
            </p>
          </div>
        </div>

        <span className="text-sm mb-4">
          Once withdrawn, you will be able to view your items on Open Sea.
        </span>
      </div>

      <Button
        className="my-3"
        onClick={withdraw}
        disabled={selectedItems.length <= 0}
      >
        Withdraw
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
