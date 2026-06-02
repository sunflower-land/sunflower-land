import { useSelector } from "@xstate/react";
import React, { useContext, useState } from "react";
import Decimal from "decimal.js-light";

import type {
  BoostName,
  Inventory,
  InventoryItemName,
} from "features/game/types/game";
import {
  getTranslatedItemName,
  ITEM_DETAILS,
} from "features/game/types/images";
import { KNOWN_IDS } from "features/game/types";
import { getItemUnit } from "features/game/lib/conversion";

import { toWei } from "web3-utils";
import { wallet } from "lib/blockchain/wallet";

import { getKeys } from "lib/object";
import { SUNNYSIDE } from "assets/sunnyside";
import { INVENTORY_RELEASES } from "features/game/types/withdrawables";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useNow } from "lib/utils/hooks/useNow";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { hasReputation, Reputation } from "features/game/lib/reputation";
import { RequiredReputation } from "features/island/hud/components/reputation/Reputation";
import { isFaceVerified } from "features/retreat/components/personhood/lib/faceRecognition";
import { FaceRecognition } from "features/retreat/components/personhood/FaceRecognition";
import { hasBoostRestriction } from "features/game/types/withdrawRestrictions";
import { secondsToString } from "lib/utils/time";
import { COLLECTIBLE_BUFF_LABELS } from "features/game/types/collectibleItemBuffs";
import { MAX_MINT_AMOUNT } from "lib/blockchain/Withdrawals";
import chest from "assets/icons/chest.png";

import { WithdrawCollection } from "./withdraw/WithdrawCollection";
import type { WithdrawEntry } from "./withdraw/types";

interface Props {
  onWithdraw: (ids: number[], amounts: string[]) => void;
  onBack: () => void;
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
  onBack,
  withdrawDisabled,
}) => {
  const { t } = useAppTranslation();
  const now = useNow();

  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  // Cap selectable counts at `previousInventory + MAX_MINT_AMOUNT` so the
  // UI matches the backend's per-call mint cap. The backend mints any
  // shortfall up to `MAX_MINT_AMOUNT` per item per call; players with more
  // off-chain than the cap can withdraw the rest in subsequent calls.
  const capToWithdrawableLimit = (items: Inventory): Inventory =>
    getKeys(items).reduce((acc, name) => {
      const count = items[name] ?? new Decimal(0);
      const onChain = state.previousInventory[name] ?? new Decimal(0);
      const ceiling = onChain.add(MAX_MINT_AMOUNT);
      acc[name] = count.gt(ceiling) ? ceiling : count;
      return acc;
    }, {} as Inventory);

  // Placed collectibles can now be withdrawn (the backend trims placed
  // instances to the inventory count on save), so the ceiling is the full
  // inventory rather than the unplaced "chest" count.
  const [inventory, setInventory] = useState<Inventory>(() =>
    capToWithdrawableLimit(state.inventory),
  );
  const [selected, setSelected] = useState<Inventory>({});

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

  // Translate a target quantity from the stepper into the existing
  // one-at-a-time transfer model so all clamping logic is preserved.
  const onSetQty = (entry: WithdrawEntry, qty: number) => {
    const itemName = entry.key as InventoryItemName;
    let diff = qty - (selected[itemName]?.toNumber() ?? 0);
    while (diff > 0) {
      onAdd(itemName);
      diff--;
    }
    while (diff < 0) {
      onRemove(itemName);
      diff++;
    }
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
      const hasBuff = !!COLLECTIBLE_BUFF_LABELS[itemName]?.(state)?.length;

      cache[itemName] = {
        cooldownMs: cooldownTimeLeft,
        isOnCooldown,
        hasBuff,
      };
      return cache;
    },
    {} as {
      [key in InventoryItemName]?: {
        cooldownMs: number;
        isOnCooldown: boolean;
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

    // 2. Boosted items come before non-boosted items
    if (a.hasBuff !== b.hasBuff) {
      return a.hasBuff ? -1 : 1;
    }

    // 3. Otherwise, sort by item IDs
    return KNOWN_IDS[itemA] - KNOWN_IDS[itemB];
  };

  const withdrawableItems = getKeys(inventory)
    .filter((itemName) => {
      const withdrawAt = INVENTORY_RELEASES[itemName]?.withdrawAt;
      return !!withdrawAt && withdrawAt <= new Date(now);
    })
    .filter((itemName) => inventory[itemName]?.gt(0))
    .sort((a, b) => sortWithdrawableItems(a, b) as number);

  const selectedItems = getKeys(selected).filter((item) =>
    selected[item]?.gt(0),
  );

  const hasAccess = hasReputation({
    game: state,
    reputation: Reputation.Seedling,
    now,
  });

  if (!hasAccess) {
    return <RequiredReputation reputation={Reputation.Seedling} />;
  }

  if (!isFaceVerified({ game: state })) {
    return <FaceRecognition />;
  }

  // Keep fully-selected items visible in the grid alongside the still
  // available ones so the Direction C grid never drops an item the player
  // has added to the cart.
  const entryNames = [
    ...withdrawableItems,
    ...selectedItems.filter((name) => !withdrawableItems.includes(name)),
  ];

  const entries: WithdrawEntry[] = entryNames.map((itemName) => {
    const inventoryCount = inventory[itemName]?.toNumber() ?? 0;
    const selectedCount = selected[itemName]?.toNumber() ?? 0;
    const { isRestricted, cooldownTimeLeft } = getRestrictionStatus(itemName);
    const buffs = COLLECTIBLE_BUFF_LABELS[itemName]?.(state);

    const cooldownText = secondsToString(cooldownTimeLeft / 1000, {
      length: "medium",
      isShortFormat: true,
      removeTrailingZeros: true,
    });

    return {
      key: itemName,
      id: KNOWN_IDS[itemName],
      name: getTranslatedItemName(itemName),
      image: ITEM_DETAILS[itemName].image,
      total: inventoryCount + selectedCount,
      locked: isRestricted,
      lockReason: isRestricted
        ? t("withdraw.boostedItem.timeLeft", { time: cooldownText })
        : undefined,
      status: isRestricted
        ? {
            type: "warning" as const,
            icon: SUNNYSIDE.icons.timer,
            text: t("withdraw.status.cooldown", { time: cooldownText }),
          }
        : {
            type: "success" as const,
            text: t("withdraw.status.withdrawable"),
          },
      description: ITEM_DETAILS[itemName].description,
      buffs: buffs?.length ? buffs : undefined,
    };
  });

  const selectedMap = selectedItems.reduce(
    (acc, itemName) => {
      acc[itemName] = selected[itemName]?.toNumber() ?? 0;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <WithdrawCollection
      title={t("collectibles")}
      icon={chest}
      entries={entries}
      selected={selectedMap}
      onSetQty={onSetQty}
      onWithdraw={withdraw}
      withdrawDisabled={withdrawDisabled}
      walletAddress={wallet.getConnection() || "XXXX"}
      onBack={onBack}
      intro={`${t("withdraw.restricted.description")} ${t(
        "withdraw.placed.warning",
      )}`}
    />
  );
};
