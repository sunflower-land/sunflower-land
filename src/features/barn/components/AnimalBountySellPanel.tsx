import React from "react";

import { SUNNYSIDE } from "assets/sunnyside";
import { HudContainer } from "components/ui/HudContainer";
import { Label } from "components/ui/Label";
import { OuterPanel } from "components/ui/Panel";
import { PIXEL_SCALE } from "features/game/lib/constants";
import { weekResetsAt } from "features/game/lib/factions";
import type { AnimalBounty, InventoryItemName } from "features/game/types/game";
import { TimerDisplay } from "features/retreat/components/auctioneer/AuctionDetails";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { useCountdown } from "lib/utils/hooks/useCountdown";
import { AnimalBountyQuickPanel } from "./AnimalBountyQuickPanel";

interface Props {
  animalTypes: InventoryItemName[];
  selectedDeal?: AnimalBounty;
  onSelect: (deal?: AnimalBounty) => void;
  onClose: () => void;
}

export const AnimalBountySellPanel: React.FC<Props> = ({
  animalTypes,
  selectedDeal,
  onSelect,
  onClose,
}) => {
  const { t } = useAppTranslation();
  const expiresAt = useCountdown(weekResetsAt());

  return (
    <HudContainer zIndex="z-50">
      <div className="absolute bottom-0 left-0 right-0">
        {/* Title + weekly reset countdown, perched above the panel's left edge. */}
        <div className="absolute z-20 -top-8 left-2 flex items-center gap-2">
          <Label type="default">{t("bounties.sellAnimals")}</Label>
          <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
            <TimerDisplay time={expiresAt} />
          </Label>
        </div>

        <button
          type="button"
          aria-label="Close"
          className="absolute z-20 -top-12 right-2 cursor-pointer border-0 bg-transparent p-0"
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
          <div className="min-h-0 flex flex-1 overflow-hidden">
            <AnimalBountyQuickPanel
              animalTypes={animalTypes}
              selectedDeal={selectedDeal}
              onSelect={onSelect}
            />
          </div>
        </OuterPanel>
      </div>
    </HudContainer>
  );
};
