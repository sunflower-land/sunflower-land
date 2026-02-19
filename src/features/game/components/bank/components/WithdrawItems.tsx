import { useSelector } from "@xstate/react";
import React, { useContext, useState } from "react";
import Decimal from "decimal.js-light";

import {
  BoostName,
  Inventory,
  InventoryItemName,
} from "features/game/types/game";
import { ITEM_DETAILS } from "features/game/types/images";
import { KNOWN_IDS } from "features/game/types";
import { getItemUnit } from "features/game/lib/conversion";

import { Button } from "components/ui/Button";
import { Box } from "components/ui/Box";

import { toWei } from "web3-utils";
import { wallet } from "lib/blockchain/wallet";

import { getKeys } from "features/game/types/craftables";
import { getBankItems } from "features/goblins/storageHouse/lib/storageItems";
import { SUNNYSIDE } from "assets/sunnyside";
import { INVENTORY_RELEASES } from "features/game/types/withdrawables";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { Label } from "components/ui/Label";
import { WalletAddressLabel } from "components/ui/WalletAddressLabel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { MachineState } from "features/game/lib/gameMachine";
import { hasReputation, Reputation } from "features/game/lib/reputation";
import { RequiredReputation } from "features/island/hud/components/reputation/Reputation";
import { isFaceVerified } from "features/retreat/components/personhood/lib/faceRecognition";
import { FaceRecognition } from "features/retreat/components/personhood/FaceRecognition";
import { hasBoostRestriction } from "features/game/types/withdrawRestrictions";
import { InfoPopover } from "features/island/common/InfoPopover";
import { secondsToString } from "lib/utils/time";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { getChestItems } from "features/island/hud/components/inventory/utils/inventory";

interface Props {
  onWithdraw: (ids: number[], amounts: string[]) => void;
  allowLongpressWithdrawal?: boolean;
  withdrawDisabled?: boolean;
}

export function transferInventoryItem(
  itemName: InventoryItemName,
  setFrom: React.Dispatch<
    React.SetStateAction<Partial<Record<InventoryItemName, Decimal>>>
  >,
  setTo: React.Dispatch<
    React.SetStateAction<Partial<Record<InventoryItemName, Decimal>>>
  >,
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

const _state = (state: MachineState) => state.context.state;

export const WithdrawItems: React.FC<Props> = ({
  onWithdraw,
  allowLongpressWithdrawal = true,
  withdrawDisabled,
}) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  const [inventory, setInventory] = useState<Inventory>(getBankItems(state));
  const [selected, setSelected] = useState<Inventory>({});

  const [showInfo, setShowInfo] = useState("");

  const withdraw = () => {
    const ids = getKeys(selected).map((item) => KNOWN_IDS[item]);
    const amounts = getKeys(selected).map((item) =>
      toWei(selected[item]?.toString() as string, getItemUnit(item)),
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

  const hasMoreOffChainItems = (itemName: InventoryItemName) => {
    const inventoryCount = inventory[itemName] ?? new Decimal(0);
    const currentAmount = getChestItems(state)[itemName] ?? new Decimal(0);
    const onChainAmount = state.previousInventory[itemName] ?? new Decimal(0);

    // No items available to select, but there are more off-chain items
    return inventoryCount.lessThanOrEqualTo(0) && currentAmount > onChainAmount;
  };

  const getRestrictionStatus = (itemName: BoostName) => {
    const { isRestricted, cooldownTimeLeft } = hasBoostRestriction({
      boostUsedAt: state.boostsUsedAt,
      item: itemName,
    });
    return { isRestricted, cooldownTimeLeft };
  };

  const withdrawableItemCache = getKeys(inventory).reduce(
    (cache, itemName) => {
      const { cooldownTimeLeft } = getRestrictionStatus(itemName);
      const isOnCooldown = cooldownTimeLeft > 0;
      const hasMoreOffChain = hasMoreOffChainItems(itemName);
      const hasBuff = !!COLLECTIBLE_BUFF_LABELS[itemName]?.({
        skills: state.bumpkin.skills,
        collectibles: state.collectibles,
      })?.length;

      cache[itemName] = {
        cooldownMs: cooldownTimeLeft,
        isOnCooldown,
        hasMoreOffChain,
        hasBuff,
      };
      return cache;
    },
    {} as {
      [key in InventoryItemName]?: {
        cooldownMs: number;
        isOnCooldown: boolean;
        hasMoreOffChain: boolean;
        hasBuff: boolean;
      };
    },
  );

  const sortWithdrawableItems = (
    itemA: InventoryItemName,
    itemB: InventoryItemName,
  ) => {
    const a = withdrawableItemCache[itemA];
    const b = withdrawableItemCache[itemB];

    // Handle undefined cases first
    if (!a && !b) return 0;
    if (!a) return 1;
    if (!b) return -1;

    // 1. Items on cooldown come first, sorted by most cooldown time left
    if (a.isOnCooldown && b.isOnCooldown) {
      return b.cooldownMs - a.cooldownMs;
    }
    if (a.isOnCooldown !== b.isOnCooldown) {
      return a.isOnCooldown ? -1 : 1;
    }

    // 2. Items that have more off-chain than on-chain copies
    if (a.hasMoreOffChain !== b.hasMoreOffChain) {
      return a.hasMoreOffChain ? -1 : 1;
    }

    // 3. Boosted items come before non-boosted items
    if (a.hasBuff !== b.hasBuff) {
      return a.hasBuff ? -1 : 1;
    }

    // 4. Otherwise, sort by item IDs
    return KNOWN_IDS[itemA] - KNOWN_IDS[itemB];
  };

  const withdrawableItems = getKeys(inventory)
    .filter((itemName) => {
      const withdrawAt = INVENTORY_RELEASES[itemName]?.withdrawAt;
      return !!withdrawAt && withdrawAt <= new Date();
    })
    .filter(
      (itemName) =>
        hasMoreOffChainItems(itemName) || inventory[itemName]?.gt(0),
    )
    .sort((a, b) => sortWithdrawableItems(a, b) as number);

  const selectedItems = getKeys(selected)
    .filter((item) => selected[item]?.gt(0))
    .sort((a, b) => KNOWN_IDS[a] - KNOWN_IDS[b]);

  const hasAccess = hasReputation({
    game: state,
    reputation: Reputation.Seedling,
  });

  if (!hasAccess) {
    return <RequiredReputation reputation={Reputation.Seedling} />;
  }

  if (!isFaceVerified({ game: state })) {
    return <FaceRecognition />;
  }

  return (
    <>
      <div className="p-2 mb-2">
        <Label type="warning" className="mb-2">
          <span className="text-xs">{t("withdraw.restricted")}</span>
        </Label>
        <Label type="default" className="mb-2">
          {t("withdraw.select.item")}
        </Label>
        <div className="flex flex-wrap h-fit -ml-1.5">
          {withdrawableItems.map((itemName) => {
            const details = makeItemDetails(itemName);

            // The inventory amount that is not placed
            const inventoryCount = inventory[itemName] ?? new Decimal(0);

            const { isRestricted, cooldownTimeLeft } =
              getRestrictionStatus(itemName);

            const RestrictionCooldown = cooldownTimeLeft / 1000;
            const isLocked =
              isRestricted || inventoryCount.lessThanOrEqualTo(0);

            const shouldShowPopover =
              isRestricted || hasMoreOffChainItems(itemName);

            const handleBoxClick = () => {
              if (shouldShowPopover) {
                setShowInfo((prev) => (prev === itemName ? "" : itemName));
              }
            };

            return (
              <div
                key={itemName}
                onClick={handleBoxClick}
                className="flex relative text-center"
              >
                <InfoPopover
                  className="absolute top-14 text-xxs sm:text-xs"
                  showPopover={showInfo === itemName}
                >
                  {hasMoreOffChainItems(itemName)
                    ? t("withdraw.requires.storeOnChain")
                    : isRestricted &&
                      t("withdraw.boostedItem.timeLeft", {
                        time: secondsToString(RestrictionCooldown, {
                          length: "medium",
                          isShortFormat: true,
                          removeTrailingZeros: true,
                        }),
                      })}
                </InfoPopover>

                <Box
                  count={inventoryCount}
                  key={itemName}
                  disabled={isLocked}
                  onClick={() => onAdd(itemName)}
                  image={details.image}
                  secondaryImage={
                    shouldShowPopover ? SUNNYSIDE.icons.lock : undefined
                  }
                />
              </div>
            );
          })}
          {/* Pad with empty boxes */}
          {withdrawableItems.length < 4 &&
            new Array(4 - withdrawableItems.length)
              .fill(null)
              .map((_, index) => <Box disabled key={index} />)}
        </div>

        <div className="mt-4">
          <Label type="default" className="mb-2">
            {t("selected")}
          </Label>
          <div className="flex flex-wrap h-fit -ml-1.5">
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

        <div className="w-full my-3 border-t border-white" />
        <div className="flex items-center mb-2 text-xs">
          <img
            src={SUNNYSIDE.icons.player}
            className="mr-3"
            style={{
              width: `${PIXEL_SCALE * 13}px`,
            }}
          />
          <div className="flex flex-col gap-1">
            <p>{t("withdraw.send.wallet")}</p>
            <WalletAddressLabel
              walletAddress={wallet.getConnection() || "XXXX"}
            />
          </div>
        </div>

        <p className="text-xs">
          {t("withdraw.opensea")}{" "}
          <a
            className="underline hover:text-blue-500"
            href="https://docs.sunflower-land.com/getting-started/crypto-and-digital-collectibles"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("read.more")}
          </a>
        </p>
      </div>

      <Button
        onClick={withdraw}
        disabled={selectedItems.length <= 0 || withdrawDisabled}
      >
        {t("withdraw")}
      </Button>
    </>
  );
};
