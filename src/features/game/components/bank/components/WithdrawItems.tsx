import { useSelector } from "@xstate/react";
import React, { useContext, useEffect, useState } from "react";
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
}) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  const [inventory, setInventory] = useState<Inventory>({});
  const [selected, setSelected] = useState<Inventory>({});

  const [showInfo, setShowInfo] = useState("");

  useEffect(() => {
    const bankItems = getBankItems(state);
    setInventory(bankItems);
    setSelected({});
  }, []);

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

  const withdrawableItems = getKeys(inventory)
    .filter((itemName) => {
      const withdrawAt = INVENTORY_RELEASES[itemName]?.withdrawAt;
      return !!withdrawAt && withdrawAt <= new Date();
    })
    .sort((a, b) => KNOWN_IDS[a] - KNOWN_IDS[b]);

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

  const getRestrictionStatus = (itemName: BoostName) => {
    const { isRestricted, cooldownTimeLeft } = hasBoostRestriction({
      boostUsedAt: state.boostsUsedAt,
      item: itemName,
    });
    return { isRestricted, cooldownTimeLeft };
  };

  const sortWithdrawableItems = (
    itemA: InventoryItemName,
    itemB: InventoryItemName,
  ) => {
    const aCooldownMs = getRestrictionStatus(itemA).cooldownTimeLeft;
    const bCooldownMs = getRestrictionStatus(itemB).cooldownTimeLeft;

    const aIsOnCooldown = aCooldownMs > 0;
    const bIsOnCooldown = bCooldownMs > 0;

    const aHasBuff = !!COLLECTIBLE_BUFF_LABELS(state)[itemA]?.length;
    const bHasBuff = !!COLLECTIBLE_BUFF_LABELS(state)[itemB]?.length;

    // 1. Items with boosts come first
    if (aHasBuff !== bHasBuff) {
      return aHasBuff ? -1 : 1;
    }

    // 2. Among boosted items, those on cooldown come first
    if (aIsOnCooldown && bIsOnCooldown) {
      // 3. Among items on cooldown, sort by most cooldown time left
      return bCooldownMs - aCooldownMs;
    }
    if (aIsOnCooldown !== bIsOnCooldown) {
      return aIsOnCooldown ? -1 : 1;
    }

    // 4. Otherwise, sort by item IDs
    return KNOWN_IDS[itemA] - KNOWN_IDS[itemB];
  };

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
          {withdrawableItems
            .slice()
            .sort((a, b) => sortWithdrawableItems(a, b))
            .map((itemName) => {
              const details = makeItemDetails(itemName);

              // The inventory amount that is not placed
              const inventoryCount = inventory[itemName] ?? new Decimal(0);

              const { isRestricted, cooldownTimeLeft } =
                getRestrictionStatus(itemName);
              const RestrictionCooldown = cooldownTimeLeft / 1000;
              const handleBoxClick = () => {
                if (isRestricted) {
                  setShowInfo((prev) => (prev === itemName ? "" : itemName));
                }
              };

              return (
                <div
                  key={itemName}
                  onClick={handleBoxClick}
                  className="flex relative"
                >
                  <InfoPopover
                    className="absolute top-14 text-xxs sm:text-xs"
                    showPopover={showInfo === itemName}
                  >
                    {t("withdraw.boostedItem.timeLeft", {
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
                    disabled={
                      isRestricted || inventoryCount.lessThanOrEqualTo(0)
                    }
                    onClick={() => onAdd(itemName)}
                    image={details.image}
                    secondaryImage={
                      isRestricted ? SUNNYSIDE.icons.lock : undefined
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
            <WalletAddressLabel walletAddress={wallet.getAccount() || "XXXX"} />
          </div>
        </div>

        <p className="text-xs">
          {t("withdraw.opensea")}{" "}
          <a
            className="underline hover:text-blue-500"
            href="https://docs.sunflower-land.com/fundamentals/withdrawing"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("read.more")}
          </a>
        </p>
      </div>

      <Button onClick={withdraw} disabled={selectedItems.length <= 0}>
        {t("withdraw")}
      </Button>
    </>
  );
};
