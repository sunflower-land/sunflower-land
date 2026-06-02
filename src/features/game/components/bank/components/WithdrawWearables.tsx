import { useSelector } from "@xstate/react";
import React, { useContext, useState } from "react";

import type { BoostName, Wardrobe } from "features/game/types/game";

import { wallet } from "lib/blockchain/wallet";

import { getKeys } from "lib/object";
import { SUNNYSIDE } from "assets/sunnyside";
import { type BumpkinItem, ITEM_IDS } from "features/game/types/bumpkin";
import { availableWardrobe } from "features/game/events/landExpansion/equip";
import { WEARABLE_RELEASES } from "features/game/types/withdrawables";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import { getImageUrl } from "lib/utils/getImageURLS";
import type { MachineState } from "features/game/lib/gameMachine";
import { hasReputation, Reputation } from "features/game/lib/reputation";
import { RequiredReputation } from "features/island/hud/components/reputation/Reputation";
import { isFaceVerified } from "features/retreat/components/personhood/lib/faceRecognition";
import { FaceRecognition } from "features/retreat/components/personhood/FaceRecognition";
import { hasBoostRestriction } from "features/game/types/withdrawRestrictions";
import { secondsToString } from "lib/utils/time";
import { BUMPKIN_ITEM_BUFF_LABELS } from "features/game/types/bumpkinItemBuffs";
import { useNow } from "lib/utils/hooks/useNow";
import { MAX_MINT_AMOUNT } from "lib/blockchain/Withdrawals";

import { WithdrawCollection } from "./withdraw/WithdrawCollection";
import type { WithdrawEntry } from "./withdraw/types";

interface Props {
  onWithdraw: (ids: number[], amounts: number[]) => void;
  onBack: () => void;
  withdrawDisabled?: boolean;
}

const _state = (state: MachineState) => state.context.state;

export const WithdrawWearables: React.FC<Props> = ({
  onWithdraw,
  onBack,
  withdrawDisabled,
}) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  // Cap at `previousWardrobe + MAX_MINT_AMOUNT` to match the BE per-call
  // mint cap. The backend mints any shortfall up to `MAX_MINT_AMOUNT` per
  // item per call.
  const getTrueAvailableWardrobe = () => {
    const available = availableWardrobe(state);

    return getKeys(available).reduce((acc, key) => {
      const currentAmount = available[key] ?? 0;
      const onChain = state.previousWardrobe[key] ?? 0;
      acc[key] = Math.min(currentAmount, onChain + MAX_MINT_AMOUNT);
      return acc;
    }, {} as Wardrobe);
  };

  const [wardrobe, setWardrobe] = useState<Wardrobe>(() =>
    getTrueAvailableWardrobe(),
  );
  const [selected, setSelected] = useState<Wardrobe>({});

  const now = useNow();

  const withdraw = () => {
    const ids = getKeys(selected).map((item) => ITEM_IDS[item]);
    const amounts = getKeys(selected).map((item) => selected[item]) as number[];

    onWithdraw(ids, amounts);
  };

  const onAdd = (itemName: BumpkinItem) => {
    setWardrobe((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] ?? 0) - 1,
    }));

    setSelected((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] ?? 0) + 1,
    }));
  };

  const onRemove = (itemName: BumpkinItem) => {
    setWardrobe((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] ?? 0) + 1,
    }));

    setSelected((prev) => {
      const newSelected = { ...prev };
      if (newSelected[itemName] === 1) {
        delete newSelected[itemName];
      } else {
        newSelected[itemName] = (newSelected[itemName] ?? 0) - 1;
      }
      return newSelected;
    });
  };

  // Translate a target quantity from the stepper into the existing
  // one-at-a-time transfer model.
  const onSetQty = (entry: WithdrawEntry, qty: number) => {
    const itemName = entry.key as BumpkinItem;
    let diff = qty - (selected[itemName] ?? 0);
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

  // Precompute/cached values for sorting to avoid repeated expensive calls
  const withdrawableItemCache = getKeys(wardrobe).reduce(
    (cache, itemName) => {
      const { cooldownTimeLeft } = getRestrictionStatus(itemName);
      const isOnCooldown = cooldownTimeLeft > 0;
      const hasBuff = !!BUMPKIN_ITEM_BUFF_LABELS[itemName]?.length;

      cache[itemName] = {
        cooldownMs: cooldownTimeLeft,
        isOnCooldown,
        hasBuff,
      };

      return cache;
    },
    {} as {
      [key in BumpkinItem]?: {
        cooldownMs: number;
        isOnCooldown: boolean;
        hasBuff: boolean;
      };
    },
  );

  const sortWithdrawableItems = (itemA: BumpkinItem, itemB: BumpkinItem) => {
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
    return ITEM_IDS[itemA] - ITEM_IDS[itemB];
  };

  const withdrawableItems = [...new Set([...getKeys(wardrobe)])]
    .filter((itemName) => {
      const withdrawAt = WEARABLE_RELEASES[itemName]?.withdrawAt;
      const canWithdraw = !!withdrawAt && withdrawAt <= new Date(now);
      return canWithdraw;
    })
    .filter((itemName) => (wardrobe[itemName] ?? 0) > 0)
    .sort((a, b) => sortWithdrawableItems(a, b));

  const selectedItems = getKeys(selected).filter((item) => !!selected[item]);

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

  // Keep fully-selected wearables visible in the grid alongside the still
  // available ones.
  const entryNames = [
    ...withdrawableItems,
    ...selectedItems.filter((name) => !withdrawableItems.includes(name)),
  ];

  const entries: WithdrawEntry[] = entryNames.map((itemName) => {
    const wardrobeCount = wardrobe[itemName] ?? 0;
    const selectedCount = selected[itemName] ?? 0;
    const { isRestricted, cooldownTimeLeft } = getRestrictionStatus(itemName);
    const buffs = BUMPKIN_ITEM_BUFF_LABELS[itemName];

    const cooldownText = secondsToString(cooldownTimeLeft / 1000, {
      length: "medium",
      isShortFormat: true,
      removeTrailingZeros: true,
    });

    return {
      key: itemName,
      id: ITEM_IDS[itemName],
      name: itemName,
      image: getImageUrl(ITEM_IDS[itemName]),
      total: wardrobeCount + selectedCount,
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
      buffs: buffs?.length ? buffs : undefined,
    };
  });

  const selectedMap = selectedItems.reduce(
    (acc, itemName) => {
      acc[itemName] = selected[itemName] ?? 0;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <WithdrawCollection
      title={t("wearables")}
      icon={SUNNYSIDE.icons.wardrobe}
      entries={entries}
      selected={selectedMap}
      onSetQty={onSetQty}
      onWithdraw={withdraw}
      withdrawDisabled={withdrawDisabled}
      walletAddress={wallet.getConnection() || "XXXX"}
      onBack={onBack}
      intro={t("withdraw.restricted.description")}
    />
  );
};
