import React, { useState } from "react";

import { Button } from "components/ui/Button";
import { Label } from "components/ui/Label";
import { SplitScreenView } from "components/ui/SplitScreenView";
import { TextInput } from "components/ui/TextInput";
import { SUNNYSIDE } from "assets/sunnyside";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useIsMobile } from "lib/utils/hooks/useIsMobile";

import { WithdrawItemGrid } from "./WithdrawItemGrid";
import { WithdrawItemDetail } from "./WithdrawItemDetail";
import { WithdrawCart } from "./WithdrawCart";
import type { WithdrawEntry } from "./types";

type MobileScreen = "grid" | "detail" | "cart";

interface Props {
  /** Section heading + icon (e.g. "Collectibles" + chest). */
  title: string;
  icon: string;
  /** All withdrawable entries (already sorted/filtered by the screen). */
  entries: WithdrawEntry[];
  /** Map of entry key -> selected quantity. */
  selected: Record<string, number>;
  onSetQty: (entry: WithdrawEntry, qty: number) => void;
  onWithdraw: () => void;
  withdrawDisabled?: boolean;
  walletAddress: string;
  /** Navigate back to the withdraw main menu. */
  onBack: () => void;
  /** Warning copy shown above the grid. */
  intro?: string;
  searchable?: boolean;
}

/**
 * Direction C withdraw layout. On desktop it is a two-pane split — a named
 * item grid on the left and a docked rail (item detail + cart) on the right.
 * On mobile it becomes separate screens — grid → detail → cart — with back
 * navigation.
 */
export const WithdrawCollection: React.FC<Props> = ({
  title,
  icon,
  entries,
  selected,
  onSetQty,
  onWithdraw,
  withdrawDisabled,
  walletAddress,
  onBack,
  intro,
  searchable = true,
}) => {
  const { t } = useAppTranslation();
  const isMobile = useIsMobile();

  const [query, setQuery] = useState("");
  const [focusedKey, setFocusedKey] = useState<string | undefined>(undefined);
  const [screen, setScreen] = useState<MobileScreen>("grid");

  const visibleEntries = query
    ? entries.filter((entry) =>
        entry.name.toLowerCase().includes(query.toLowerCase()),
      )
    : entries;

  const readyCount = entries.filter((entry) => !entry.locked).length;
  // Sum over the rendered entries so the count matches the cart's own total.
  const totalSelected = entries.reduce(
    (sum, entry) => sum + (selected[entry.key] ?? 0),
    0,
  );

  const focusedEntry = entries.find((entry) => entry.key === focusedKey);
  const focusedQty = focusedKey ? (selected[focusedKey] ?? 0) : 0;

  const onPick = (entry: WithdrawEntry) => {
    setFocusedKey(entry.key);
    if (isMobile) setScreen("detail");
  };

  // Contextual back: within a sub-screen (cart, or mobile detail), return to
  // the grid; otherwise leave the section entirely.
  const handleBack = () => {
    if (screen !== "grid") {
      setScreen("grid");
      return;
    }
    onBack();
  };

  const headerTitle =
    screen === "cart"
      ? t("withdraw.reviewWithdrawal")
      : screen === "detail"
        ? t("withdraw.itemDetails")
        : title;

  const headerIcon = screen === "cart" ? SUNNYSIDE.icons.confirm : icon;

  const search = searchable && (
    <TextInput
      value={query}
      onValueChange={setQuery}
      onCancel={() => setQuery("")}
      icon={SUNNYSIDE.icons.search}
      placeholder={t("search")}
    />
  );

  const grid = (
    <WithdrawItemGrid
      entries={visibleEntries}
      selected={selected}
      focusedKey={isMobile ? undefined : focusedKey}
      onPick={onPick}
    />
  );

  const introLabel = intro && (
    <Label type="warning" className="mb-2">
      <span className="text-xxs">{intro}</span>
    </Label>
  );

  const header = (
    <div className="flex items-center gap-2 mb-1 px-1">
      <img
        src={SUNNYSIDE.icons.arrow_left}
        className="cursor-pointer"
        style={{ width: `${PIXEL_SCALE * 11}px` }}
        alt={t("back")}
        onClick={handleBack}
      />
      <Label type="default" icon={headerIcon}>
        {headerTitle}
      </Label>
      {screen === "grid" && (
        <span className="text-xxs ml-auto">
          {t("withdraw.readyCount", { count: readyCount })}
        </span>
      )}
    </div>
  );

  // Reusable "Review withdrawal" action → opens the full cart view (shared by
  // the desktop detail rail and the mobile grid screen).
  const reviewButton = (
    <Button className="mt-1" onClick={() => setScreen("cart")}>
      <div className="flex items-center justify-center">
        <img src={SUNNYSIDE.icons.confirm} className="h-4 mr-1" />
        {totalSelected > 0
          ? t("withdraw.reviewWithdrawalCount", { count: totalSelected })
          : t("withdraw.reviewWithdrawal")}
      </div>
    </Button>
  );

  /* ---- Full cart view (desktop + mobile) ---- */
  if (screen === "cart") {
    return (
      <div className="flex flex-col">
        {header}
        <WithdrawCart
          entries={entries}
          selected={selected}
          onSetQty={onSetQty}
          onWithdraw={onWithdraw}
          withdrawDisabled={withdrawDisabled}
          walletAddress={walletAddress}
        />
      </div>
    );
  }

  /* ---- Mobile item-detail screen ---- */
  if (isMobile && screen === "detail") {
    return (
      <div className="flex flex-col">
        {header}
        <WithdrawItemDetail
          entry={focusedEntry}
          selectedQty={focusedQty}
          onSetQty={onSetQty}
        />
        <Button className="mt-1" onClick={() => setScreen("grid")}>
          <div className="flex items-center justify-center">
            <img src={SUNNYSIDE.icons.arrow_left} className="h-4 mr-1" />
            {t("withdraw.backToItems")}
          </div>
        </Button>
      </div>
    );
  }

  /* ---- Desktop two-pane: grid (content) + detail rail (panel) ---- */
  if (!isMobile) {
    return (
      <div className="flex flex-col">
        {header}
        {searchable && <div className="px-1 mb-1">{search}</div>}
        <SplitScreenView
          tallDesktopContent
          content={
            <div className="w-full">
              {introLabel}
              {grid}
            </div>
          }
          panel={
            <div className="flex flex-col gap-1">
              <WithdrawItemDetail
                entry={focusedEntry}
                selectedQty={focusedQty}
                onSetQty={onSetQty}
              />
              {reviewButton}
            </div>
          }
        />
      </div>
    );
  }

  /* ---- Mobile grid screen ---- */
  return (
    <div className="flex flex-col">
      {header}
      {searchable && <div className="px-1 mb-1">{search}</div>}
      <div className="max-h-[55vh] overflow-y-auto scrollable">
        {introLabel}
        {grid}
      </div>
      {reviewButton}
    </div>
  );
};
