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

import alert from "assets/icons/expression_alerted.png";
import { getKeys } from "features/game/types/craftables";

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

  if (isLoading) {
    return <span className="text-shadow loading">Loading</span>;
  }

  const inventoryItems = getKeys(inventory).filter((item) =>
    inventory[item]?.gt(0)
  );

  const selectedItems = (Object.keys(selected) as InventoryItemName[]).filter(
    (item) => selected[item]?.gt(0)
  );

  return (
    <>
      <span className="text-shadow text-base">Select items to withdraw</span>

      <div className="flex flex-wrap h-fit">
        {inventoryItems.map((itemName) => (
          <Box
            count={inventory[itemName]}
            // isSelected={selected.includes(itemName)}
            key={itemName}
            onClick={() => onAdd(itemName)}
            image={ITEM_DETAILS[itemName].image}
            locked={
              !canWithdraw({ item: itemName, game: goblinState.context.state })
            }
          />
        ))}
        {/* Pad with empty boxes */}
        {inventoryItems.length < 4 &&
          new Array(4 - inventoryItems.length)
            .fill(null)
            .map((_, index) => <Box disabled key={index} />)}
      </div>

      <div className="mt-2">
        <span className="text-shadow text-base">Selected</span>

        <div className="flex flex-wrap h-fit mt-2">
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

      <div className="flex items-center mt-2 mb-2">
        <img src={player} className="h-8 mr-2" />
        <div>
          <p className="text-shadow text-sm">Sent to your wallet</p>
          <p className="text-shadow text-sm">
            {shortAddress(metamask.myAccount || "XXXX")}
          </p>
        </div>
      </div>

      <span className="text-center text-xs mb-4">
        Once withdrawn, you will be able to view your items on Open Sea.
      </span>

      <div className="flex items-center border-2 rounded-md border-black p-2 mt-2 mb-2 bg-[#e43b44]">
        <img src={alert} alt="alert" className="mr-2 w-5 h-5/6" />
        <span className="text-xs">
          ANY PROGRESS THAT HAS NOT BEEN SYNCED ON CHAIN WILL BE LOST.
        </span>
      </div>

      <Button onClick={withdraw} disabled={selectedItems.length <= 0}>
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
