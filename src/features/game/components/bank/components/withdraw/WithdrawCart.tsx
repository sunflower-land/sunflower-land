import React from "react";

import { Box } from "components/ui/Box";
import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { WalletAddressLabel } from "components/ui/WalletAddressLabel";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";

import { Stepper } from "./Stepper";
import type { WithdrawEntry } from "./types";

interface Props {
  entries: WithdrawEntry[];
  selected: Record<string, number>;
  onSetQty: (entry: WithdrawEntry, qty: number) => void;
  onWithdraw: () => void;
  withdrawDisabled?: boolean;
  walletAddress: string;
  /** Show the wallet destination + withdraw button (hidden in desktop rail
   *  when the action lives below, shown on the mobile cart screen). */
  showFooter?: boolean;
  /** Heading above the cart list (defaults to the withdraw wording). */
  title?: string;
  /** Copy for the empty cart (defaults to the withdraw wording). */
  emptyText?: string;
  /** Label for the confirm button (defaults to the withdraw wording). */
  actionText?: (count: number) => string;
  /** Replaces the default "sent to your wallet" destination block (e.g. so the
   *  deposit flow can show the farm as the destination instead). */
  footer?: React.ReactNode;
}

/**
 * The "Your withdrawal" cart: the running list of selected items with a
 * per-row stepper, the destination and the confirm action. Copy + destination
 * default to the withdraw flow but can be overridden so the deposit flow can
 * reuse the same layout.
 */
export const WithdrawCart: React.FC<Props> = ({
  entries,
  selected,
  onSetQty,
  onWithdraw,
  withdrawDisabled,
  walletAddress,
  showFooter = true,
  title,
  emptyText,
  actionText,
  footer,
}) => {
  const { t } = useAppTranslation();

  const entriesByKey = new Map(entries.map((entry) => [entry.key, entry]));
  const cartEntries = Object.keys(selected)
    .filter((key) => (selected[key] ?? 0) > 0)
    .map((key) => entriesByKey.get(key))
    .filter((entry): entry is WithdrawEntry => !!entry);

  // Sum over the rendered cart rows so the header count and button state can
  // never disagree with the list actually shown.
  const totalSelected = cartEntries.reduce(
    (sum, entry) => sum + (selected[entry.key] ?? 0),
    0,
  );

  return (
    <div className="flex flex-col gap-2 h-full min-h-0 w-full">
      <div className="flex items-center justify-between">
        <span className="text-sm">{title ?? t("withdraw.yourWithdrawal")}</span>
        <Label type={totalSelected > 0 ? "success" : "default"}>
          {t("withdraw.itemsSelected", { count: totalSelected })}
        </Label>
      </div>

      <div className="scrollable flex flex-col gap-1 flex-1 min-h-[50px] overflow-y-auto">
        {cartEntries.length === 0 && (
          <span className="text-xs">
            {emptyText ?? t("withdraw.cart.empty")}
          </span>
        )}
        {cartEntries.map((entry) => (
          <div key={entry.key} className="flex items-center gap-1">
            <Box image={entry.image} iconClassName={entry.iconClassName} />
            <span className="text-xs flex-1 truncate">{entry.name}</span>
            <Stepper
              value={selected[entry.key] ?? 0}
              max={entry.total}
              onChange={(value) => onSetQty(entry, value)}
            />
          </div>
        ))}
      </div>

      {showFooter && (
        <>
          <div className="w-full border-t border-white" />
          {footer ?? (
            <div className="flex items-center text-xs">
              <img
                src={SUNNYSIDE.icons.player}
                className="mr-3"
                style={{ width: `${PIXEL_SCALE * 13}px` }}
              />
              <div className="flex flex-col gap-1">
                <p>{t("withdraw.send.wallet")}</p>
                <WalletAddressLabel walletAddress={walletAddress} />
              </div>
            </div>
          )}
          <Button
            onClick={onWithdraw}
            disabled={totalSelected <= 0 || withdrawDisabled}
          >
            <div className="flex items-center justify-center">
              <img src={SUNNYSIDE.icons.confirm} className="h-4 mr-1" />
              {actionText
                ? actionText(totalSelected)
                : totalSelected > 0
                  ? t("withdraw.withdrawCount", { count: totalSelected })
                  : t("withdraw")}
            </div>
          </Button>
        </>
      )}
    </div>
  );
};
