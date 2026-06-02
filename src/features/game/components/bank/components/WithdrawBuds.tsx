import { useSelector } from "@xstate/react";
import React, { useContext, useState } from "react";

import { wallet } from "lib/blockchain/wallet";

import { getKeys } from "lib/object";
import { SUNNYSIDE } from "assets/sunnyside";

import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { Context } from "features/game/GameProvider";
import type { MachineState } from "features/game/lib/gameMachine";
import { hasReputation, Reputation } from "features/game/lib/reputation";
import { RequiredReputation } from "features/island/hud/components/reputation/Reputation";
import { hasBoostRestriction } from "features/game/types/withdrawRestrictions";
import { secondsToString } from "lib/utils/time";
import type { BoostName } from "features/game/types/game";
import { getBudImage } from "lib/buds/types";
import { useNow } from "lib/utils/hooks/useNow";

import { WithdrawCollection } from "./withdraw/WithdrawCollection";
import type { WithdrawEntry } from "./withdraw/types";

interface Props {
  onWithdraw: (ids: number[]) => void;
  onBack: () => void;
  withdrawDisabled?: boolean;
}

const _state = (state: MachineState) => state.context.state;

const BUD_ICON_CLASS = "scale-[1.8] origin-bottom absolute";

export const WithdrawBuds: React.FC<Props> = ({
  onWithdraw,
  onBack,
  withdrawDisabled,
}) => {
  const { t } = useAppTranslation();

  const { gameService } = useContext(Context);
  const state = useSelector(gameService, _state);

  const buds = state.buds ?? {};

  const [unselected, setUnselected] = useState<number[]>(
    getKeys(buds)
      .filter((budId) => !buds[budId].coordinates)
      .map(Number),
  );
  const [selected, setSelected] = useState<number[]>([]);

  const onAdd = (budId: number) => {
    setUnselected((prev) => prev.filter((bud) => bud !== budId));
    setSelected((prev) => [...prev, budId]);
  };

  const onRemove = (budId: number) => {
    setUnselected((prev) => [...prev, budId]);
    setSelected((prev) => prev.filter((bud) => bud !== budId));
  };

  const now = useNow();

  const hasAccess = hasReputation({
    game: state,
    reputation: Reputation.Seedling,
    now,
  });

  if (!hasAccess) {
    return <RequiredReputation reputation={Reputation.Seedling} />;
  }

  const getRestrictionStatus = (itemName: BoostName) => {
    const { isRestricted, cooldownTimeLeft } = hasBoostRestriction({
      boostUsedAt: state.boostsUsedAt,
      item: itemName,
    });
    return { isRestricted, cooldownTimeLeft };
  };

  const getBudName = (budId: number) => {
    return `Bud #${budId}`;
  };

  const sortWithdrawableItems = (a: number, b: number) => {
    const itemA = getBudName(a) as BoostName;
    const itemB = getBudName(b) as BoostName;
    const aCooldownMs = getRestrictionStatus(itemA).cooldownTimeLeft;
    const bCooldownMs = getRestrictionStatus(itemB).cooldownTimeLeft;

    const aIsOnCooldown = aCooldownMs > 0;
    const bIsOnCooldown = bCooldownMs > 0;

    // 1. Buds on cooldown come first
    if (aIsOnCooldown && bIsOnCooldown) {
      // 2. Among those, sort by most cooldown time left
      return bCooldownMs - aCooldownMs;
    }
    if (aIsOnCooldown !== bIsOnCooldown) {
      return aIsOnCooldown ? -1 : 1;
    }
    // 3. Otherwise, sort by bud IDs
    return a - b;
  };

  const onSetQty = (entry: WithdrawEntry, qty: number) => {
    const budId = entry.id;
    const isSelected = selected.includes(budId);
    if (qty >= 1 && !isSelected) onAdd(budId);
    if (qty <= 0 && isSelected) onRemove(budId);
  };

  // Selected buds remain visible in the grid (with a selected badge)
  // alongside the still-available ones.
  const budIds = [
    ...unselected.slice().sort(sortWithdrawableItems),
    ...selected,
  ];

  const entries: WithdrawEntry[] = budIds.map((budId) => {
    const budName = getBudName(budId);
    const { isRestricted, cooldownTimeLeft } = getRestrictionStatus(
      budName as BoostName,
    );

    const cooldownText = secondsToString(cooldownTimeLeft / 1000, {
      length: "medium",
      isShortFormat: true,
      removeTrailingZeros: true,
    });

    return {
      key: `bud-${budId}`,
      id: budId,
      name: budName,
      image: getBudImage(budId),
      iconClassName: BUD_ICON_CLASS,
      total: 1,
      unique: true,
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
        : { type: "success" as const, text: t("withdraw.status.withdrawable") },
    };
  });

  const selectedMap = selected.reduce(
    (acc, budId) => {
      acc[`bud-${budId}`] = 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <WithdrawCollection
      title={t("buds")}
      icon={SUNNYSIDE.icons.plant}
      entries={entries}
      selected={selectedMap}
      onSetQty={onSetQty}
      onWithdraw={() => onWithdraw(selected)}
      withdrawDisabled={withdrawDisabled}
      walletAddress={wallet.getConnection() || "XXXX"}
      onBack={onBack}
      intro={t("withdraw.restricted.description")}
    />
  );
};
