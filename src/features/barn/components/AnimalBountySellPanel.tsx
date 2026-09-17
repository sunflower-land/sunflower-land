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
import { AnimalBountyQuickPanel } from "./AnimalBountyQuickPanel";

const HIDE_COMPLETED_BOUNTIES_KEY = "animalBounties.hideCompleted";

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
  const [hideCompleted, setHideCompleted] = useLocalStorage<boolean>(
    HIDE_COMPLETED_BOUNTIES_KEY,
    false,
  );

  return (
    <HudContainer zIndex="z-50">
      <div className="absolute bottom-0 left-0 right-0">
        {/* Title and timer on one line, with the hide toggle stacked below so
            neither gets squeezed on narrow screens. */}
        <div className="absolute z-20 bottom-full left-2 right-20 mb-1 flex flex-col items-start gap-1">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <Label type="default">{t("bounties.sellAnimals")}</Label>
            <Label type="info" icon={SUNNYSIDE.icons.stopwatch}>
              <TimerDisplay time={expiresAt} />
            </Label>
          </div>

          {/* Backed by a panel so the toggle stays legible over the scene. */}
          <InnerPanel
            className="flex cursor-pointer items-center gap-2"
            style={{ paddingRight: `${PIXEL_SCALE * 3}px` }}
            onClick={() => setHideCompleted((hidden) => !hidden)}
          >
            <div className="pointer-events-none">
              <Checkbox
                checked={hideCompleted}
                onChange={setHideCompleted}
                aria-label={t("bounties.hideCompleted")}
              />
            </div>
            <span className="text-xs">{t("bounties.hideCompleted")}</span>
          </InnerPanel>
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
          <div className="min-h-0 flex flex-1 overflow-hidden">
            <AnimalBountyQuickPanel
              animalTypes={animalTypes}
              selectedDeal={selectedDeal}
              hideCompleted={hideCompleted}
              onSelect={onSelect}
            />
          </div>
        </OuterPanel>
      </div>
    </HudContainer>
  );
};
