import React from "react";

import { Box } from "components/ui/Box";
import { Label } from "components/ui/Label";
import { SUNNYSIDE } from "assets/sunnyside";
import chest from "assets/icons/chest.png";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { Stepper } from "./Stepper";
import type { WithdrawEntry } from "./types";

interface Props {
  entry?: WithdrawEntry;
  selectedQty: number;
  onSetQty: (entry: WithdrawEntry, qty: number) => void;
  /** Copy shown in the empty state (defaults to the withdraw wording). */
  emptyText?: string;
  /** Label next to the stepper (defaults to the withdraw wording). */
  inCartText?: string;
}

/**
 * Shared item-detail body used in both the desktop docked rail and the mobile
 * detail screen. Shows the item, its status, description and boosts, plus the
 * lock reason or the quantity stepper. Copy defaults to the withdraw flow but
 * can be overridden so the deposit flow can reuse the same layout.
 */
export const WithdrawItemDetail: React.FC<Props> = ({
  entry,
  selectedQty,
  onSetQty,
  emptyText,
  inCartText,
}) => {
  const { t } = useAppTranslation();

  if (!entry) {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-2 p-4 min-h-[120px]">
        <img src={chest} className="w-8 opacity-50" />
        <span className="text-xs">
          {emptyText ?? t("withdraw.detail.empty")}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-1">
      <div className="flex items-center gap-2">
        <Box image={entry.image} iconClassName={entry.iconClassName} />
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <span className="text-sm">{entry.name}</span>
          {entry.status && (
            <Label type={entry.status.type} icon={entry.status.icon}>
              {entry.status.text}
            </Label>
          )}
        </div>
      </div>

      {entry.description && (
        <p className="text-xs leading-relaxed m-0">{entry.description}</p>
      )}

      {!!entry.buffs?.length && (
        <div className="flex flex-col gap-1">
          {entry.buffs.map((buff, index) => (
            <Label
              key={index}
              type={buff.labelType}
              icon={buff.boostTypeIcon}
              secondaryIcon={buff.boostedItemIcon}
            >
              {buff.shortDescription}
            </Label>
          ))}
        </div>
      )}

      {entry.locked ? (
        <Label type="warning" icon={SUNNYSIDE.icons.lock}>
          {entry.lockReason}
        </Label>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span className="text-xs">
              {inCartText ?? t("withdraw.inYourWithdrawal")}
            </span>
            <Stepper
              value={selectedQty}
              max={entry.total}
              onChange={(value) => onSetQty(entry, value)}
            />
          </div>
          {entry.inUseWarning &&
            entry.safeWithdrawCount !== undefined &&
            selectedQty > entry.safeWithdrawCount && (
              <Label type="warning" icon={SUNNYSIDE.icons.expression_alerted}>
                {entry.inUseWarning}
              </Label>
            )}
        </>
      )}
    </div>
  );
};
