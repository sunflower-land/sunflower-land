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

import player from "assets/icons/player.png";

import { toWei } from "web3-utils";
import { metamask } from "lib/blockchain/metamask";
import { canWithdraw } from "../lib/bankUtils";
import { getOnChainState } from "features/game/actions/onchain";

import {
  getKeys,
  isLimitedItem,
  LimitedItemName,
} from "features/game/types/craftables";
import { mintCooldown } from "features/goblins/blacksmith/lib/mintUtils";

interface Props {
  onWithdraw: (ids: number[], amounts: string[]) => void;
}
export const WithdrawItems: React.FC<Props> = ({ onWithdraw }) => {
  const { goblinService } = useContext(Context);
  const [goblinState] = useActor(goblinService);

  const [isLoading, setIsLoading] = useState(true);
  const [inventory, setInventory] = useState<Inventory>({});
  const [selected, setSelected] = useState<Inventory>({});

  useEffect(() => {
    setIsLoading(true);

    const load = async () => {
      const { game: state } = await getOnChainState({
        id: goblinState.context.state.id as number,
        farmAddress: goblinState.context.state.farmAddress as string,
      });

      setInventory(state.inventory);
      setIsLoading(false);
    };

    setSelected({});
    load();
  }, []);

  const withdraw = () => {
    const ids = getKeys(selected).map((item) => KNOWN_IDS[item]);
    const amounts = getKeys(selected).map((item) =>
      toWei(selected[item]?.toString() as string, getItemUnit(item))
    );

    onWithdraw(ids, amounts);
  };

  const onAdd = (itemName: InventoryItemName) => {
    setSelected((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] || new Decimal(0)).add(1),
    }));

    setInventory((prev) => ({
      ...prev,
      [itemName]: prev[itemName]?.minus(1),
    }));
  };

  const onRemove = (itemName: InventoryItemName) => {
    setInventory((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] || new Decimal(0)).add(1),
    }));

    setSelected((prev) => ({
      ...prev,
      [itemName]: prev[itemName]?.minus(1),
    }));
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

  if (isLoading) {
    return <span className="text-shadow loading mt-2">Loading</span>;
  }

  const inventoryItems = getKeys(inventory).filter((item) =>
    inventory[item]?.gt(0)
  );

  const selectedItems = (Object.keys(selected) as InventoryItemName[]).filter(
    (item) => selected[item]?.gt(0)
  );

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

            const withdrawable = canWithdraw({
              item: itemName,
              game: goblinState.context.state,
            });

            const cooldownInProgress =
              mintCooldown({
                cooldownSeconds: details?.cooldownSeconds,
                mintedAt: details?.mintedAt,
              }) > 0;

            const locked = !withdrawable || cooldownInProgress;

            return (
              <Box
                count={inventory[itemName]}
                // isSelected={selected.includes(itemName)}
                key={itemName}
                onClick={() => onAdd(itemName)}
                image={details.image}
                locked={locked}
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

      <Button onClick={withdraw} disabled={selectedItems.length <= 0}>
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
