import { useActor } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";
import Decimal from "decimal.js-light";

import { Inventory, InventoryItemName } from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { shortAddress } from "lib/utils/shortAddress";
import { KNOWN_IDS } from "features/game/types";
import { getItemUnit } from "features/game/lib/conversion";

import { Button } from "components/ui/Button";
import { Box } from "components/ui/Box";

import { toWei } from "web3-utils";
import { wallet } from "lib/blockchain/wallet";

import { getKeys } from "features/game/types/craftables";
import { getBankItems } from "features/goblins/storageHouse/lib/storageItems";
import { SUNNYSIDE } from "assets/sunnyside";
import { WITHDRAWABLES } from "features/game/types/withdrawables";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";

interface Props {
  onWithdraw: (ids: number[], amounts: string[]) => void;
  allowLongpressWithdrawal?: boolean;
}

export function transferInventoryItem(
  itemName: InventoryItemName,
  setFrom: React.Dispatch<
    React.SetStateAction<Partial<Record<InventoryItemName, Decimal>>>
  >,
  setTo: React.Dispatch<
    React.SetStateAction<Partial<Record<InventoryItemName, Decimal>>>
  >
) {
  let amount = new Decimal(1);

  // Subtract 1 or remaining
  setFrom((prev) => {
    const remaining = prev[itemName] ?? new Decimal(0);
    if (remaining.lessThan(1)) {
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
    [itemName]: (prev[itemName] ?? new Decimal(0)).add(amount),
  }));
}

export const WithdrawItems: React.FC<Props> = ({
  onWithdraw,
  allowLongpressWithdrawal = true,
}) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const [gameState] = useActor(gameService);

  const [inventory, setInventory] = useState<Inventory>({});
  const [selected, setSelected] = useState<Inventory>({});

  useEffect(() => {
    const bankItems = getBankItems(gameState.context.state);
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
    transferInventoryItem(itemName, setInventory, setSelected);
  };

  const onRemove = (itemName: InventoryItemName) => {
    // Transfer from selected to inventory
    transferInventoryItem(itemName, setSelected, setInventory);
  };

  const makeItemDetails = (itemName: InventoryItemName) => {
    const details = ITEM_DETAILS[itemName];

    return {
      mintedAt: 0,
      image: details.image,
    };
  };

  const isCurrentObsession = (itemName: InventoryItemName) => {
    const obsessionCompletedAt =
      gameState.context.state.npcs?.bert?.questCompletedAt;
    const currentObsession = gameState.context.state.bertObsession;

    if (!obsessionCompletedAt || !currentObsession) return false;
    if (currentObsession.name !== itemName) return false;

    return (
      obsessionCompletedAt >= currentObsession.startDate &&
      obsessionCompletedAt <= currentObsession.endDate
    );
  };

  const withdrawableItems = getKeys(inventory)
    .filter(
      (itemName) => WITHDRAWABLES[itemName]() && !isCurrentObsession(itemName)
    )
    .sort((a, b) => KNOWN_IDS[a] - KNOWN_IDS[b]);

  const selectedItems = getKeys(selected)
    .filter((item) => selected[item]?.gt(0))
    .sort((a, b) => KNOWN_IDS[a] - KNOWN_IDS[b]);

  return (
    <>
      <div className="mt-3">
        <div className="flex items-center border-2 rounded-md border-black p-2 bg-green-background mb-3">
          <span className="text-xs">
            {t("withdraw.restricted")}{" "}
            <a
              href="https://docs.sunflower-land.com/fundamentals/withdrawing#why-cant-i-withdraw-some-items"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-500"
            >
              {"in use"}
            </a>
            {" or are "}
            <a
              href="https://docs.sunflower-land.com/fundamentals/withdrawing#why-cant-i-withdraw-some-items"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-500"
            >
              {"still being built"}
            </a>
            {"."}
          </span>
        </div>
        <h2 className="mb-3">{t("withdraw.select.item")}</h2>
        <div className="flex flex-wrap h-fit -ml-1.5">
          {withdrawableItems.map((itemName) => {
            const details = makeItemDetails(itemName);

            // The inventory amount that is not placed
            const inventoryCount = inventory[itemName] ?? new Decimal(0);

            return (
              <Box
                count={inventoryCount}
                key={itemName}
                disabled={inventoryCount.lessThanOrEqualTo(0)}
                onClick={() => onAdd(itemName)}
                image={details.image}
                canBeLongPressed={allowLongpressWithdrawal}
              />
            );
          })}
          {/* Pad with empty boxes */}
          {withdrawableItems.length < 4 &&
            new Array(4 - withdrawableItems.length)
              .fill(null)
              .map((_, index) => <Box disabled key={index} />)}
        </div>

        <div className="mt-2">
          <h2 className="">{t("selected")}</h2>
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
          <img src={SUNNYSIDE.icons.player} className="h-8 mr-2" />
          <div>
            <p className="text-sm">{t("withdraw.send.wallet")}</p>
            <p className="text-sm font-secondary">
              {shortAddress(wallet.myAccount || "XXXX")}
            </p>
          </div>
        </div>

        <span className="text-sm mb-4">
          {t("withdraw.opensea")}{" "}
          <a
            className="underline hover:text-blue-500"
            href="https://docs.sunflower-land.com/fundamentals/withdrawing"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("read.more")}
          </a>
          {"."}
        </span>
      </div>

      <Button
        className="mt-3"
        onClick={withdraw}
        disabled={selectedItems.length <= 0}
      >
        {t("withdraw")}
      </Button>
    </>
  );
};
