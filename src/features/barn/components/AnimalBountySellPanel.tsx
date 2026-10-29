import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { Checkbox } from "components/ui/Checkbox";
import { HudContainer } from "components/ui/HudContainer";
import { Label } from "components/ui/Label";
import { InnerPanel, OuterPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { weekResetsAt } from "features/game/lib/factions";
import type { AnimalBounty, InventoryItemName } from "features/game/types/game";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { useLocalStorage } from "lib/utils/hooks/useLocalStorage";
import {
  AnimalBountyQuickPanel,
  type TradeInCardProps,
} from "./AnimalBountyQuickPanel";
import { ConfirmButton } from "components/ui/ConfirmButton";
import { Button } from "components/ui/Button";

const HIDE_COMPLETED_BOUNTIES_KEY = "animalBounties.hideCompleted";

interface Props {
  animalTypes: InventoryItemName[];
  selectedDeal?: AnimalBounty;
  bulkMode?: boolean;
  onBulkModeChange?: (enabled: boolean) => void;
  /** Bulk mode: bounty id -> animal id pairs marked for sale. */
  pendingSales?: Record<string, string>;
  onSelect: (deal?: AnimalBounty) => void;
  onSellPending?: () => void;
  onClearPending?: () => void;
  onClose: () => void;
  tradeIn?: TradeInCardProps;
}

/** A checkbox toggle backed by a panel so it stays legible over the scene. */
const PanelToggle: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}> = ({ checked, onChange, label }) => (
  <InnerPanel
    className="flex cursor-pointer items-center gap-2"
    style={{ paddingRight: `${PIXEL_SCALE * 3}px` }}
    onClick={() => onChange(!checked)}
  >
    <div className="pointer-events-none">
      <Checkbox checked={checked} onChange={onChange} aria-label={label} />
    </div>
    <span className="text-xs whitespace-nowrap">{label}</span>
  </InnerPanel>
);

export const AnimalBountySellPanel: React.FC<Props> = ({
  animalTypes,
  selectedDeal,
  bulkMode = false,
  onBulkModeChange,
  pendingSales = {},
  onSelect,
  onSellPending,
  onClearPending,
  onClose,
  tradeIn,
}) => {
  const { t } = useAppTranslation();
  const expiresAt = useCountdown(weekResetsAt());
  const [hideCompleted, setHideCompleted] = useLocalStorage<boolean>(
    HIDE_COMPLETED_BOUNTIES_KEY,
    false,
  );
  const pendingCount = Object.keys(pendingSales).length;

  return (
    <HudContainer zIndex="z-50">
      <div className="absolute bottom-0 left-0 right-0">
        {/* Title and timer on one line, with the toggles stacked below so
            neither gets squeezed on narrow screens. */}
        <div className="absolute z-20 bottom-full left-2 right-20 mb-1 flex flex-col items-start gap-1">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <Label type="default">{t("bounties.sellAnimals")}</Label>
            <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
              <TimerDisplay time={expiresAt} />
            </Label>
          </div>

          <div className="flex flex-wrap gap-1">
            <PanelToggle
              checked={hideCompleted}
              onChange={setHideCompleted}
              label={t("bounties.hideCompleted")}
            />
            {onBulkModeChange && (
              <PanelToggle
                checked={bulkMode}
                onChange={onBulkModeChange}
                label={t("bounties.bulkSell")}
              />
            )}
          </div>
        </div>

        <button
          type="button"
          aria-label="Close"
          className="absolute z-20 bottom-full right-2 mb-2 cursor-pointer border-0 bg-transparent p-0"
          onClick={onClose}
        >
          <img
            src={SUNNYSIDE.ui.disc_cancel}
            alt=""
            style={{ width: `${PIXEL_SCALE * 18}px` }}
          />
        </button>

        {/* No panel padding: the inner panel frames the cards tightly. */}
        <OuterPanel
          className="relative !max-h-[50vh] overflow-y-hidden flex flex-col"
          style={{ padding: 0 }}
        >
          {/* Bulk mode actions live on the panel, not over the scene. */}
          {bulkMode && (
            <div className="flex justify-end gap-1 px-2 pt-1">
              <div className="flex gap-1 ml-auto">
                {onClearPending && pendingCount > 0 && (
                  <Button
                    className="!w-auto whitespace-nowrap"
                    onClick={onClearPending}
                  >
                    {t("clear")}
                  </Button>
                )}
                {onSellPending && (
                  <ConfirmButton
                    className="!w-auto whitespace-nowrap"
                    divClassName="!w-auto"
                    disabled={pendingCount === 0}
                    onConfirm={onSellPending}
                  >
                    {t("bounties.sellSelected", { count: pendingCount })}
                  </ConfirmButton>
                )}
              </div>
            </div>
          )}

          <div className="min-h-0 flex flex-1 overflow-hidden">
            <AnimalBountyQuickPanel
              animalTypes={animalTypes}
              selectedDeal={selectedDeal}
              pendingSales={bulkMode ? pendingSales : {}}
              hideCompleted={hideCompleted}
              onSelect={onSelect}
              tradeIn={tradeIn}
            />
          </div>
        </OuterPanel>
      </div>
    </HudContainer>
  );
};
